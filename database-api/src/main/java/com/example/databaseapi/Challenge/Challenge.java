package com.example.databaseapi.Challenge;

import org.json.simple.JSONObject;

public class Challenge {


    private int challengeId;
    private String challengeDescription;
    private boolean isItCompleted;

    public Challenge(int challengeId, String challengeDescription, boolean isItCompleted) {
        this.challengeId = challengeId;
        this.challengeDescription = challengeDescription;
        this.isItCompleted = isItCompleted;
    }

    public int getChallengeId() {
        return challengeId;
    }

    public void setChallengeId(int challengeId) {
        this.challengeId = challengeId;
    }

    public String getChallengeDescription() {
        return challengeDescription;
    }

    public void setChallengeDescription(String challengeDescription) {
        this.challengeDescription = challengeDescription;
    }

    public boolean isItCompleted() {
        return isItCompleted;
    }

    public void setItCompleted(boolean itCompleted) {
        isItCompleted = itCompleted;
    }

    public boolean isDailyChallengeCompletedForId(Object currentState,Object previousState){
         return new DailyChallenges().getDailyChallengeResponseForId(this.challengeId,currentState,previousState);
    }

    //Olyasmi mint a toString(), csak JSON-é alakít
    public JSONObject convertChallengeToJsonObject(){
        JSONObject challenge = new JSONObject();
        challenge.put("challengeId",challengeId);
        challenge.put("challengeDescription",challengeDescription);
        challenge.put("isItCompleted",isItCompleted);

        return challenge;

    }
}
