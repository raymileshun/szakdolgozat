package com.example.databaseapi.Service;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;

public class Service {

    JSONParser parser = new JSONParser();
    String directoryName = "jsons/";
    String garbageMarkerSavingLocation=directoryName+"GARBAGEMARKERs.txt";

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

        JSONObject marker = new JSONObject();
        marker.put("id",markerId);
        marker.put("latitude",latitude);
        marker.put("longitude",longitude);
//          marker.put("latitude",48.083235);
//          marker.put("longitude",20.7785);
        marker.put("isItCollected","false");

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
}

