let pointsArray=[];
const pointsNumber=20;
const k= 3;


function setup() {
  createCanvas(800, 800);
  rectMode(CENTER)
  for(let i=0;i<pointsNumber;i++){
    pointsArray.push(new Point());
  }
  let x = document.createElement("TABLE")
  x.setAttribute("id", "ratioTable")
  document.body.appendChild(x)
  document.getElementById("ratioTable").insertRow().insertCell(0);

}

function draw() {
  let fos=[];
  background(0);
  drawCoordinateLines();
  drawClassIds();
  let closest=getKClosestIndexes();
  for(let i=0;i<pointsArray.length;i++){
    if(closest.includes(i)){
        strokeWeight(5)
        stroke('blue')
        line(mouseX,mouseY,pointsArray[i].x,pointsArray[i].y)
        pointsArray[i].isClose=true;
        fos.push(pointsArray[i]);
    } else{
      pointsArray[i].isClose=false
    }
    pointsArray[i].show();

    noStroke()
    fill(255,0,0)
    text(parseInt(calculateDistance(pointsArray[i])),pointsArray[i].x,pointsArray[i].y)
  }
  getPointsRatio(fos)
}

function drawCoordinateLines(){
  strokeWeight(2)
  stroke('white')
  line(width/2,height,width/2,0);
  strokeWeight(2)
  stroke('white')
  line(0,height/2,width,height/2);
}

function drawClassIds(){
  let offset=20;
  noStroke();
  fill(255)
  text(0,offset,offset)
  text(1,width/2+offset,offset)
  text(2,width/2+offset,height/2+offset)
  text(3,offset,height/2+offset)
}



function getPointsRatio(array){
  let occurences=[]
  for(let i=0;i<array.length;i++){
    let id=array[i].classId;
    // console.log(occurences)
    if(occurences.length===0 || !arrayHasMultipleElements(occurences,id)){
      let obj={
        "id":id,
        "occurences": getOccurencesInArray(array,array[i].classId)
      }
      occurences.push(obj);
    }
  }
  occurences.sort(function(a,b){
    return a[1]-b[1]
  });
  let arrayLength=occurences.length
  let allOccurences=getOccurencesInArray(occurences);

  let textToWrite=""
  for(let i=0;i<arrayLength;i++){
    textToWrite+=" id: "+occurences[i].id+" occurence: "+occurences[i].occurences+" dominance: "+occurences[i].occurences/k+"\n<br>"
  }
  document.getElementById("ratioTable").rows[0].cells[0].innerHTML=textToWrite;
  noStroke()
  fill(0,255,0)
  // text(textToWrite,width/2,height/2)
  // console.log(occurences)

}



function arrayHasMultipleElements(array,searchableElement){
  let ids=[];
  for(let i=0;i<array.length;i++){
    ids.push(array[i].id)
  }
  return ids.includes(searchableElement)

}

function getOccurencesInArray(array,searchableElement){
  let occurence=0;
    for(let i=0;i<array.length;i++){
      if(array[i].classId===searchableElement){
        occurence++;
      }
    }
    return occurence;
}




function getKClosestIndexes(){
  let distanceArray=[];
  let closestArray=[];
  for(let i=0;i<pointsArray.length;i++){
    distanceArray.push([i,calculateDistance(pointsArray[i])])
  }

  distanceArray.sort(function(a,b){
    return a[1]-b[1]
  });


  for(let i=0;i<k;i++){
    closestArray[i]=distanceArray[i][0];
  }
  return closestArray;

}



function calculateDistance(pnt){
  return dist(mouseX,mouseY,pnt.x,pnt.y)
}
