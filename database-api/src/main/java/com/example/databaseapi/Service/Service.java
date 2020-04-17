package com.example.databaseapi.Service;

import com.example.databaseapi.Challenge.Challenge;
import com.example.databaseapi.Challenge.DailyChallenges;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;

public class Service {

    JSONParser parser = new JSONParser();
    String directoryName = "jsons/";
    String garbageMarkerSavingLocation=directoryName+"GARBAGEMARKERs.txt";
    String challengesSavingLocation=directoryName+"CHALLENGEs.txt";

    public Object parseFile(String hardwareName) throws IOException, ParseException {
        return parser.parse(new FileReader(directoryName+hardwareName.toUpperCase()+"s.txt"));

    }

    //there's something wrong with the JSON parser, that's why I used .split().
    //I know, this isn't the best method but it'll do for now.
    public JSONArray getFilteredHardwareList(String hardwareName, String searchedHardwareName) throws IOException, ParseException {
        JSONArray hardwareList = null;
        try {
            hardwareList = (JSONArray) parseFile(hardwareName);
        } catch (IOException e) {
            e.printStackTrace();
        }
        JSONArray filteredHardwareList = new JSONArray();
        for (int i = 0; i < hardwareList.size(); i++) {
            try {
                JSONObject hardware = (JSONObject) hardwareList.get(i);
                //System.out.println(hardware);
                String hardwarePieceName = hardware.toString().split(hardwareName + "Name\":")[1].replace("\"", "").replace("}", "").trim();
                if ((hardwarePieceName.toUpperCase()).contains(searchedHardwareName.toUpperCase())) {
                    filteredHardwareList.add(hardware);
                }
            } catch (Exception e){
                e.printStackTrace();
            }
        }

        return filteredHardwareList;
    }


//    public Object saveMarker(String id, String latitude, String longitude) throws IOException {
      public Object saveMarker(String latitude, String longitude, String imagePath) throws IOException, ParseException {

        boolean fileExists=true;
        JSONArray json = new JSONArray();
        JSONArray array = new JSONArray();
        try {
            json = (JSONArray) parser.parse(new FileReader(garbageMarkerSavingLocation));
        }catch (FileNotFoundException e){
            fileExists=false;
        }
        int markerId = json.size();

          Date date = Calendar.getInstance().getTime();
          DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
          String strDate = dateFormat.format(date);

          JSONObject marker = new JSONObject();
        marker.put("id",markerId);
        marker.put("latitude",latitude);
        marker.put("longitude",longitude);
//          marker.put("latitude",48.083235);
//          marker.put("longitude",20.7785);
        marker.put("isItCollected","false");
        marker.put("uploadDate",strDate);

        if(fileExists){
            array=json;
        }
        array.add(marker);

        try (FileWriter file = new FileWriter(garbageMarkerSavingLocation)) {
            file.write(array.toJSONString());
        }

        BufferedImage bImage = null;
        try {

            File initialImage = new File(imagePath);
            bImage = ImageIO.read(initialImage);

            ImageIO.write(bImage, "jpg", new File("garbage-pictures/"+markerId+".jpg"));
          } catch (IOException e) {

          }

        JSONObject response = new JSONObject();
        response.put("statusCode",200);
        response.put("message","Sikeres mentés!");

        return response;
    }

    public Object updateMarker(String id) throws IOException {
        JSONArray markerArray = new JSONArray();
        JSONObject response = new JSONObject();
        try {
            markerArray = (JSONArray) parser.parse(new FileReader(garbageMarkerSavingLocation));
        }catch (IOException | ParseException e){

            response.put("statusCode",400);
            response.put("message","A file még nem létezik!");
            return response;
        }
        JSONObject marker = null;
        int index=-1;
        for(int i=0;i<markerArray.size();i++){
            marker= (JSONObject) markerArray.get(i);
            if((marker.get("id").toString()).equals(id)){
                index=i;
                marker.put("isItCollected","true");
                break;
            }
        }
        
        if(index!=-1){
            markerArray.remove(index);
            markerArray.add(index,marker);
        } else{
            response.put("statusCode",400);
            response.put("message","A markert nem lehet frissíteni, mert nem létezik!");
            return response;
        }

        try (FileWriter file = new FileWriter(garbageMarkerSavingLocation)) {
            file.write(markerArray.toJSONString());
        }

        response.put("statusCode",200);
        response.put("message","A frissítés megtörtént!");
        return response;
    }



    public void addChallenge(Challenge challenge) throws IOException {
        boolean fileExists=true;
        JSONArray json = new JSONArray();
        JSONArray array = new JSONArray();
        try {
            json = (JSONArray) parser.parse(new FileReader(challengesSavingLocation));
        }catch (IOException | ParseException e){
            fileExists=false;
        }


        if(fileExists){
            array=json;
        }
        array.add(challenge.convertChallengeToJsonObject());

        try (FileWriter file = new FileWriter(challengesSavingLocation)) {
            file.write(array.toJSONString());
        }
    }

    public void updateChallenge(int id) throws IOException {
        JSONArray challengesArray = new JSONArray();
        try {
            challengesArray = (JSONArray) parser.parse(new FileReader(challengesSavingLocation));
        }catch (IOException | ParseException e){
                //hibakezelés hogy nem lehet megnyitni a filet, mert nem létezik
        }
        ArrayList<Challenge> challenges = serializeJsonToChallengeObject(challengesArray);
        int index=-1;
        for (Challenge challenge:challenges){
            if(challenge.getChallengeId()==id){
                index=challenge.getChallengeId();
                challenge.setItCompleted(true);
                break;
            }
        }

        if(index!=-1){
            challengesArray.remove(index);
            challengesArray.add(index,challenges.get(index).convertChallengeToJsonObject());
        }
        try (FileWriter file = new FileWriter(challengesSavingLocation)) {
            file.write(challengesArray.toJSONString());
        }
    }


    public JSONObject getChallengeById(int challengeId){
        JSONArray challengesList = null;
        try {
            challengesList = (JSONArray) parseFile("challenge");
        } catch (IOException | ParseException e) {
            e.printStackTrace();
        }
        ArrayList<Challenge> challenges = serializeJsonToChallengeObject(challengesList);

        for(Challenge challenge : challenges){
            if(challenge.getChallengeId()==challengeId){
                return challenge.convertChallengeToJsonObject();
            }
        }

        return new JSONObject();
    }

    //Én komolyan nem értem hogy a simpleJsonnel miért nem lehet kiszedni az objektumokat normálisan, és akkor nem kellene mindenféle
    //String manipulációt csinálni
    public Object getDailyChallengeResponse(JSONObject states) throws IOException, ParseException {
        Object currentState = states.get("currentState");
        Object previousState= states.get("previousState");
        JSONObject response = new JSONObject();

        JSONArray challengesJson = (JSONArray) parseFile("challenge");
        ArrayList<Challenge> challenges = serializeJsonToChallengeObject(challengesJson);
        for (Challenge challenge: challenges){
            if(challenge.isDailyChallengeCompletedForId(currentState,previousState) && !challenge.isItCompleted()) {
                response.put("statusCode", 200);
                response.put("challengeId", challenge.getChallengeId());
                updateChallenge(challenge.getChallengeId());
                return response;
            }
        }

        response.put("statusCode",400);
        return response;
    }

    public ArrayList<Challenge> serializeJsonToChallengeObject(JSONArray jsonArray){
        ArrayList<Challenge> challengesList = new ArrayList<>();
        Challenge challenge;

        for(int i=0;i<jsonArray.size();i++){
            JSONObject jsonObject = (JSONObject) jsonArray.get(i);
            int challengeId = Integer.parseInt(String.valueOf(jsonObject.get("challengeId")));
            String challengeDescription= String.valueOf(jsonObject.get("challengeDescription"));
            boolean isItCompleted = jsonObject.get("isItCompleted").toString().equals("true")?true:false;

            challengesList.add(new Challenge(challengeId,challengeDescription,isItCompleted));

        }

        return challengesList;
    }
}

