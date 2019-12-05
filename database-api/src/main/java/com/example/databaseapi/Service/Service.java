package com.example.databaseapi.Service;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.FileReader;
import java.io.IOException;

public class Service {

    JSONParser parser = new JSONParser();

    public Object parseFile(String hardwareName) throws IOException, ParseException {
        return parser.parse(new FileReader(hardwareName.toUpperCase()+"s.txt"));
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

}

