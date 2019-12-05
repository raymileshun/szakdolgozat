const tf = require('@tensorflow/tfjs');
const mobilenet = require('@tensorflow-models/mobilenet');
const tfnode = require('@tensorflow/tfjs-node');
const knnClassifier =require('@tensorflow-models/knn-classifier')
var express = require('express')
const fs = require('fs');
const formidable = require('formidable')


const { createCanvas, loadImage, Image } = require('canvas')



var app = express();
const port = 8090;
let classifier = knnClassifier.create();

const FILTEREDARRAY_SIZE=3;
const RESIZINGFACTOR=1;
const CONFIDENCE=0.9;
const endpoints={
  ORIGINAL_MOBILENET : "submitMobileNetImage",
  TRAINED_MOBILENET : "submitOwnImage"
}

const ENDPOINTURL= endpoints.ORIGINAL_MOBILENET;

const classifierFileName="elso.json"
let labels=[]


let mobilenetModel;
let ownModel;
let predictions=null;
let trainingResponse=null;


app.listen(port, async ()=>{
    console.log(`Server is listening on ${port}`)
    mobilenetModel = await mobilenet.load();
    console.log("MobileNet model loaded!")
})




const readImage = path => {
  const imageBuffer = fs.readFileSync(path);
  const tfimage = tfnode.node.decodeImage(imageBuffer);
  return tfimage;
}



const imageClassification = async function(path) {
  const image = await readImage(path);
  predictions = await mobilenetModel.classify(image);
}



const trainModel = async function(path, classId) {
  try{
  const image = await readImage(path);
  const activation = mobilenetModel.infer(image, 'conv_preds');
  classifier.addExample(activation, classId);


  image.dispose();
} catch(err){
  return;
}

}


app.get('/', function(req, res){
  res.send('<form method="post" action="/'+endpoints.ORIGINAL_MOBILENET+'" enctype="multipart/form-data">'
    + '<p>Try with original model: <input type="file" name="image" /></p>'
    + '<p><input type="submit" value="Upload" /></p>'
    + '</form>'
    + '<form method="post" action="/'+endpoints.TRAINED_MOBILENET+'" enctype="multipart/form-data">'
      + '<p>Try with trained model: <input type="file" name="image" /></p>'
      + '<p><input type="submit" value="Upload" /></p>'
      + '</form>');
});



//Used for classyfing images with the built in MobileNet model.
app.post('/submitMobileNetImage', (req, res) => {
  new formidable.IncomingForm().parse(req)
    .on('field', (name, field) => {
      console.log('Field', name, field)
    })
    .on('file', async (name, file) => {
      let path = JSON.stringify(file).split("path\":")[1].split(",")[0].replace("\"","").replace("\"","");
      await imageClassification(path);
      console.log(predictions)
      res.send(predictions)
    })
    .on('aborted', () => {
      console.error('Request aborted by the user')
    })
    .on('error', (err) => {
      console.error('Error', err)
      throw err
    })
    .on('end', () => {
      // res.send(predictions)
    })
})




//Used with own newly trained mobilenet model to get back predictions for your images.
app.post('/submitOwnImage', (req, res) => {
  new formidable.IncomingForm().parse(req)
    .on('field', (name, field) => {
      console.log('Field', name, field)
    })
    .on('file', async (name, file) => {
      let path = JSON.stringify(file).split("path\":")[1].split(",")[0].replace("\"","").replace("\"","");
      const img = new Image();
      img.src=await path;
      const canvas = createCanvas(img.width/RESIZINGFACTOR, img.height/RESIZINGFACTOR);
      const ctx = canvas.getContext('2d');

      ctx.drawImage(img, 0, 0, img.width/RESIZINGFACTOR, img.height/RESIZINGFACTOR);

      const activation = mobilenetModel.infer(tf.browser.fromPixels(canvas), 'conv_preds');

      trainingResponse=await classifier.predictClass(activation)
      let response= await printResponse(trainingResponse)
      res.send(response)
      //console.log(trainingResponse);

      // res.status(200).send(predictions[0].probability>CONFIDENCE? true : false);
    })
    .on('aborted', () => {
      console.error('Request aborted by the user')
    })
    .on('error', (err) => {
      console.error('Error', err)
      throw err
    })
    .on('end', () => {
      // res.send(predictions)
    })
})



app.post('/train', (req, res) => {
  new formidable.IncomingForm().parse(req)
    .on('field', (name, field) => {
      console.log('Field', name, field)
    })
    .on('file', async (name, file) => {
        let path = JSON.stringify(file).split("path\":")[1].split(",")[0].replace("\"","").replace("\"","");
        let className=await req.query['className'];
        let classId= await req.query['classId'];
        console.log(className+" "+classId);
        await trainModel(path, parseInt(classId));
        if(labels.length===0){
          let label={
            "classId":classId,
            "className":className
          }
          labels.push(label);
        }
        let contains=false;
        for(let i=0;i<labels.length;i++){
            if(labels[i].classId===classId){
              contains=true;
              break;
            }
        }

        if(!contains){
          let label={
              "classId":classId,
              "className":className
            }
            labels.push(label);
        }
        res.send("ok")
    })
    .on('aborted', () => {
      console.error('Request aborted by the user')
    })
    .on('error', (err) => {
      console.error('Error', err)
      res.send("not ok")
      // throw err
    })
    .on('end', () => {
      // res.send(predictions)
    })
})



app.get('/saveModel', async function(req, res){
  await saveLabels();
  await saveModel();
  res.send("Models saved");

});

app.get('/loadModel', async function(req, res){
  await loadLabels();
  await loadModel();
  res.send("Models loaded")

});


const printResponse = async function(trainingResponse) {
    let confidences= trainingResponse.confidences
    let sortableArray=[];
    let filteredArray=[];
    let response;
    let status="false";

    Object.keys(confidences).forEach((key) => {
      sortableArray.push([key,confidences[key]])
    })

    await sortableArray.sort(function(a,b){
      return b[1]-a[1];
    })

    for(let i=0;i<FILTEREDARRAY_SIZE;i++){
      filteredArray.push(sortableArray[i]);
    }
    for(let i=0;i<filteredArray.length;i++){
      for(let j=0;j<filteredArray[i].length;j++){
        if(j%2===0){
          filteredArray[i][j]= await getClassNameForClassId(filteredArray[i][j]);

          if(filteredArray[i][j]==="garbageInForest" && filteredArray[i][j+1]>CONFIDENCE){
                status="true";
          }

        }
      }
    }

    response={
      "confidences":filteredArray,
      "isItGarbage":status
    }

   console.log(filteredArray);

   return response;
}

const getClassNameForClassId = async function(classId){
  for(let i=0;i<labels.length; i++){
    if(labels[i].classId==classId){
        return labels[i].className;
    }
  }
}

const saveLabels= async function(){
  fs.writeFileSync("labels.json",JSON.stringify(labels))
}

const saveModel = async function(){
   let dataset = await classifier.getClassifierDataset()
   var datasetObj = {}
   Object.keys(dataset).forEach((key) => {
     let dt = Array.from(dataset[key].dataSync())
     let data={
       'data': dt,
       'shape': dataset[key].shape
     }

     datasetObj[key] = data;

   });
   let jsonStr = await JSON.stringify(datasetObj)
   fs.writeFileSync(classifierFileName,jsonStr)
   classifier=knnClassifier.create();

}

//Load the labels too

const loadModel = async function() {
   let dataset = fs.readFileSync(classifierFileName);
   let tensorObj = await JSON.parse(dataset)
   Object.keys(tensorObj).forEach((key) => {
     tensorObj[key] = tf.tensor(tensorObj[key].data, tensorObj[key].shape)
   })
   classifier.setClassifierDataset(tensorObj);

 }


 const loadLabels = async function() {
    let dataset = fs.readFileSync("labels.json");
    labels = await JSON.parse(dataset);
  }







//---------------------------------------------------------------------------------------------------------------------------------------------
// ######################################################################
// ######################################################################
//                      BACKUP RÉSZEK


app.get('/getResponse', async function (req, res) {
  await imageClassificationWithLocalFile('./rabbit.jpg');
  console.log(predictions);
  res.status(200).send(predictions);
});

const readImageWithLocalFile = path => {
  const imageBuffer = fs.readFileSync(path);
  const tfimage = tfnode.node.decodeImage(imageBuffer);
  return tfimage;
}

const imageClassificationWithLocalFile = async function(path) {
  const image = readImageWithLocalFile(path);
  predictions = await mobilenetModel.classify(image);
}




// const MODEL = "ow"
// app.listen(port, async ()=>{
//     console.log(`Server is listening on ${port}`)
//     switch (MODEL.toUpperCase()) {
//       case "MOBILENET":
//         mobilenetModel = await mobilenet.load();
//         break;
//       case "OWN":
//         ownModel= await tf.loadLayersModel('file://flami_model/model.json');
//         break;
//       default: mobilenetModel = await mobilenet.load();
//     }
//     // mobilenetModel = await mobilenet.load();
//     // ownModel= await tf.loadLayersModel('file://model/model.json');
//     console.log(MODEL+ " Model loaded!")
// })


// const imageClassification = async function(path) {
//   const image = await readImage(path);
//   switch (MODEL.toUpperCase()) {
//     case "MOBILENET":
//       predictions = await mobilenetModel.classify(image);
//       break;
//     case "OWN":
//       const smalImg = tf.image.resizeBilinear(image, [224, 224]);
//       const resized = tf.cast(smalImg, 'float32');
//       const t4d = tf.tensor4d(Array.from(resized.dataSync()),[1,224,224,3])
//       predictions = await ownModel.predict(t4d);
//       break;
//     default: predictions = await mobilenetModel.classify(image);
//   }
//   // predictions = await mobilenetModel.classify(image);
//   // predictions = await ownModel.predict(image);
// }





// app.post('/train', (req, res) => {
//   new formidable.IncomingForm().parse(req)
//     .on('field', (name, field) => {
//       console.log('Field', name, field)
//     })
//     .on('file', async (name, file) => {
//         let path = JSON.stringify(file).split("path\":")[1].split(",")[0].replace("\"","").replace("\"","");
//         await trainModel(path);
//         // trainingResponse=await classifier.predictClass(activation)
//         // res.send(trainingResponse);
//         res.send("ok")
//     })
//     .on('aborted', () => {
//       console.error('Request aborted by the user')
//     })
//     .on('error', (err) => {
//       console.error('Error', err)
//       throw err
//     })
//     .on('end', () => {
//       // res.send(predictions)
//     })
// })
