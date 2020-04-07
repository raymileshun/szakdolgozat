package Models;

import org.json.simple.JSONObject;

public class CustomHardware {

    int hardwareId;
    String hardwareName;
    int hardwareConsumption;


    public CustomHardware(int hardwareId, String hardwareName, int hardwareConsumption) {
        this.hardwareId = hardwareId;
        this.hardwareName = hardwareName;
        this.hardwareConsumption = hardwareConsumption;
    }

    public JSONObject convertCustomHardwareToJsonObject() {
        JSONObject hardware = new JSONObject();

        hardware.put("hardwareId",hardwareId);
        hardware.put("hardwareName",hardwareName);
        hardware.put("hardwareConsumption",hardwareConsumption);

        return hardware;
    }
}
