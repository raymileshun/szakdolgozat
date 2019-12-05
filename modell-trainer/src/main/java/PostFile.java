import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpVersion;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.params.CoreProtocolPNames;
import org.apache.http.util.EntityUtils;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import java.lang.*;
import java.io.*;


public class PostFile {

    public static String trainingEndpoint="train";
    public static String submitEndpoint="submit-form";
    static String classesJson="";
    static String className=null;
    static int classId=-1;
    //ennyi osztályt fog beolvasni. Azért kell, mert ha az összes (ami kb 700) osztályra tanítjuk be a modellt, akkor nagyon lassú lesz.
	//A 200-as értéket javaslom
    static int CLASSLIMIT;

    //Ezt a kép átméretezésére akartam használni
    static final int RESIZINGFACTOR=2;

    static {
        try {
			
            classesJson = usingBufferedReader("/classes.json");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    public static void main(String[] args) throws Exception {
		
		JSONParser parser = new JSONParser();
		Object obj = parser.parse(new FileReader(
                    "properties.txt"));
 
        JSONObject jsonObject = (JSONObject) obj;
        
		
		CLASSLIMIT=((Long) jsonObject.get("classLimit")).intValue();
		String garbageFolderLocation = (String) jsonObject.get("garbageFolderPath");
		String imageNetFolderLocation= (String) jsonObject.get("imagenetFolderPath");
		
        File garbageFolder = new File(garbageFolderLocation);
        File imageNetFolder = new File(imageNetFolderLocation);
		
		
        //File garbageFolder = new File("c:\\Users\\rhorak\\workspace\\node-image-classification-master\\training_images");
		//File imageNetFolder = new File("c:\\Users\\rhorak\\workspace\\imagenet-sample-train\\train");


//        new PostFile().listFilesForFolder(file,trainingEndpoint);
        //new PostFile().listFilesForFolder(imageNetFolder,trainingEndpoint);
        trainModel(imageNetFolder,trainingEndpoint, "imagenet");
        trainModel(garbageFolder,trainingEndpoint, "garbage");



    }

    public static void listFilesForFolder(final File folder, String endpointUrl, String trainingType) throws IOException {
        for (final File fileEntry : folder.listFiles()) {
            if(classId==CLASSLIMIT && !trainingType.equals("garbage")){
                break;
            }

            if (fileEntry.isDirectory()) {
                className=getClassNameForFolder(fileEntry.getName());
                className=className.replace("_","").replace(" ","");
                if(className==null){
                    continue;
                }
                classId++;
                listFilesForFolder(fileEntry, endpointUrl, trainingType);
            } else {
                try {
                    if(trainingType.equals("garbage")){
                        className="garbageInForest";
                    }
                    fireRequest(new File(folder + "\\" + fileEntry.getName()), endpointUrl + "?className=" + className + "&classId=" + classId);
                }catch(Exception e){
                    e.printStackTrace();
                }
            }
        }
    }


    public static String getClassNameForFolder(String directoryName){
        try {
            return classesJson.split(directoryName)[1].split("class_name\":")[1].split("\"")[1].split("\"")[0];
        } catch (Exception e){
            return null;
        }
    }

    private static String usingBufferedReader(String filePath) throws IOException {

				
        InputStream is = PostFile.class.getResourceAsStream(filePath);
        BufferedReader buf = new BufferedReader(new InputStreamReader(is));

        String line = buf.readLine();
        StringBuilder sb = new StringBuilder();

        while(line != null){
            sb.append(line).append("\n");
            line = buf.readLine();
        }

        String fileAsString = sb.toString();

        return fileAsString;

    }

    public static void fireRequest(File file, String endpoint) throws IOException {
        HttpClient client = new DefaultHttpClient();
        client.getParams().setParameter(CoreProtocolPNames.PROTOCOL_VERSION, HttpVersion.HTTP_1_1);

        HttpPost post = new HttpPost("http://localhost:8090/"+endpoint);

        MultipartEntityBuilder builder = MultipartEntityBuilder.create();
        builder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
        builder.addBinaryBody("image", file);
        HttpEntity entity = builder.build();

        post.setEntity(entity);
        HttpResponse response = client.execute(post);
        System.out.println(EntityUtils.toString(response.getEntity()));

    }

    public static void trainModel(File file, String endpoint, String trainingType) throws IOException {
        listFilesForFolder(file, endpoint, trainingType);
    }


}