package Models;

import org.json.simple.JSONObject;

public class Food {

    int foodId;
    String foodName;
    int foodCO2Pollution;
    int foodMethanePollution;

    public Food(int foodId, String foodName, int foodCO2Pollution, int foodMethanePollution) {
        this.foodId = foodId;
        this.foodName = foodName;
        this.foodCO2Pollution = foodCO2Pollution;
        this.foodMethanePollution = foodMethanePollution;
    }

    public JSONObject convertFoodToJson() {
        JSONObject food = new JSONObject();
        food.put("foodId",foodId);
        food.put("foodName",foodName);
        food.put("co2Pollution", foodCO2Pollution);
        food.put("methanePollution",foodMethanePollution);

        return food;
    }
}
