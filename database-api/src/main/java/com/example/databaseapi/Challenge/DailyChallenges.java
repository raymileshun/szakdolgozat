package com.example.databaseapi.Challenge;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.util.ArrayList;

public class DailyChallenges {


    //Ezt biztos lehetne szebben is megcsinálni, de siettem, úgyhogy azért döntöttem emelett a megvalósítás mellett.
    public boolean getDailyChallengeResponseForId(int challengeId, Object currentState, Object previousState) {
        switch (challengeId){
            case 0: return pickUpAGarbageChallenge(currentState,previousState);
        }
        return false;
    }



    public boolean pickUpAGarbageChallenge(Object currentState, Object previousState){

        String garbageMarkersOpeningTag="garbageMarkers=\\[";
        String garbageMarkersClosingTag="\\]";

        String currentGarbageMarkersString = currentState.toString().split(garbageMarkersOpeningTag)[1].split(garbageMarkersClosingTag)[0];

        int id;
        float latitude;
        float longitude;
        boolean isItCollected;
        String marker;
        JSONArray currentStateGarbageMarkers = new JSONArray();
        JSONArray previousStateGarbageMarkers = new JSONArray();
        JSONObject garbageMarker;

        int markerArrayLength=currentGarbageMarkersString.split("},").length;
        for(int i=0;i<markerArrayLength;i++){
            garbageMarker=new JSONObject();

            marker=currentGarbageMarkersString.split("},")[i].trim();
            id=Integer.parseInt(marker.split("id=")[1].split(",")[0]);
            isItCollected= Boolean.parseBoolean(marker.split("isItCollected=")[1].split(",")[0]);

            garbageMarker.put("id",id);
            garbageMarker.put("isItCollected",isItCollected);
            currentStateGarbageMarkers.add(garbageMarker);
        }

        boolean isPreviousStateEmpty=false;
        String previousGarbageMarkersString=previousState.toString().split(garbageMarkersOpeningTag)[1].split(garbageMarkersClosingTag)[0];
        markerArrayLength=previousGarbageMarkersString.split("},").length;
        //System.out.println(previousGarbageMarkersString);
    try {
        for (int i = 0; i < markerArrayLength; i++) {
            garbageMarker = new JSONObject();

            marker = previousGarbageMarkersString.split("},")[i].trim();
            id = Integer.parseInt(marker.split("id=")[1].split(",")[0]);
            isItCollected = Boolean.parseBoolean(marker.split("isItCollected=")[1].split(",")[0]);

            garbageMarker.put("id", id);
            garbageMarker.put("isItCollected", isItCollected);
            previousStateGarbageMarkers.add(garbageMarker);
        }
    }catch (ArrayIndexOutOfBoundsException e){
        isPreviousStateEmpty=true;
    }

        //Itt igazából a currentState és previousState mérete megegyezik, úgyhogy dolgozhatok az i értékkel mindkettőnél
        for(int i=0;i<currentStateGarbageMarkers.size();i++){
            JSONObject currentMarker = (JSONObject) currentStateGarbageMarkers.get(i);
            JSONObject previousMarker = (JSONObject) previousStateGarbageMarkers.get(i);
            boolean isCurrentStateCollected= currentMarker.get("isItCollected").toString().equals("true")?true:false;
            boolean isPreviousStateCollected= previousMarker.get("isItCollected").toString().equals("true")?true:false;
            if(isCurrentStateCollected && !isPreviousStateCollected){
                return true;
            }
        }


        return false;
    }
}
