import Models.CustomHardware;
import Models.Food;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.jsoup.Jsoup;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Service {

    String cpuListUrl = "https://www.cpubenchmark.net/CPU_mega_page.html";
    String gpuListUrl = "https://www.videocardbenchmark.net/GPU_mega_page.html";

    String databaseDirectoryName= "jsons";
    String imageDirectoryName = "garbage-pictures";

    String hardwareIdText="hardwareId";
    String hardwareNameText="hardwareName";
    String hardwareConsumptionText="hardwareConsumption";

    public String getHtml(String pageUrl) {
        String html = null;
        try {
            html = Jsoup.connect(pageUrl)
                    .maxBodySize(0)
                    .timeout(260000)
                    .get()
                    .html();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return html;
    }

    public void parseHtml(String hardwareName) throws IOException {
        String rawHtml = null;
        switch (hardwareName.toUpperCase()) {
            case "CPU":
                rawHtml = getHtml(cpuListUrl);
                break;
            case "GPU":
                rawHtml = getHtml(gpuListUrl);
                break;
        }


        int hardwareListLength = rawHtml.split("<tr id=\"" + hardwareName.toLowerCase()).length;
        //int hardwareListLength = rawHtml.split("<tr id=\"cpu").length;
        //System.out.println(hardwareListLength);
        String hardwareInfo = "";

        String hardwareId = "";
        String hardwareObjectName = "";
        String hardwareConsumption = "";
        //ArrayList<CPU> cpuList = new ArrayList<CPU>();
        JSONArray hardwareList = new JSONArray();
        JSONObject hardware;

        //System.out.println(rawHtml.split("<tr id=\"cpu")[1]);

        for (int i = 1; i < hardwareListLength; i++) {
            hardware = new JSONObject();
            hardwareInfo = rawHtml.split("<tr id=\"" + hardwareName.toLowerCase())[i];
            //System.out.println(hardwareInfo);
            try {
                hardwareId = hardwareInfo.split("\"")[0].trim();

                hardwareObjectName = hardwareInfo.split("<a href")[1];
                hardwareObjectName = hardwareObjectName.split("</a>")[0];
                hardwareObjectName = hardwareObjectName.split("\">")[1].trim();

                if ((hardwareName.toUpperCase()).equals("CPU")) {
                    hardwareConsumption = hardwareInfo.split("<td>")[6].split("<")[0].trim();
                } else if ((hardwareName.toUpperCase()).equals("GPU")) {
                    hardwareConsumption = hardwareInfo.split("<td>")[5].split("<")[0].trim();
                }
            } catch (IndexOutOfBoundsException e) {

            }

            hardware.put(hardwareIdText, hardwareId);
            hardware.put(hardwareNameText, hardwareObjectName);
            hardware.put(hardwareConsumptionText, hardwareConsumption);
            hardwareList.add(hardware);
            // cpuList.add(new CPU(cpuId, cpuName, cpuConsumption));
        }

        hardwareList=filterHardwareList(hardwareList, hardwareName);

        saveHardwareList(hardwareList, hardwareName);
    }

    public JSONArray filterHardwareList(JSONArray hardwareList, String hardwareName){
        ArrayList unnecessearyHardwaresArray= new ArrayList();
        for (int i = 0; i < hardwareList.size(); ++i) {
            JSONObject hardware = (JSONObject) hardwareList.get(i);
            String consumption = (String) hardware.get(hardwareConsumptionText);
            //System.out.println(consumption);
            try {
                if (consumption.equals("NA") || consumption.equals("") || consumption == null || consumption.equals("null")) {
                    unnecessearyHardwaresArray.add(hardware);
                }
            }catch (NullPointerException e){

            }
        }
        for (Object hardware: unnecessearyHardwaresArray) {
            hardwareList.remove(hardware);
        }
        return hardwareList;
    }

    public void saveHardwareList(JSONArray hardwareList, String hardwareName) throws IOException {

        try (FileWriter file = new FileWriter(databaseDirectoryName+"/"+hardwareName.toUpperCase() + "s.txt")) {
            file.write(hardwareList.toJSONString());
            //System.out.println(hardwareName.toUpperCase() + " List:\n " + hardwareList);
        }
        System.out.println(hardwareName.toUpperCase()+" lista elkészítve!");
    }

    public void downloadHardwareLists() throws IOException {
        new File(databaseDirectoryName).mkdir();
        new File(imageDirectoryName).mkdir();
        parseHtml("cpu");
        parseHtml("gpu");

        createCustomJsonHardwareLists();
    }

    //Olyan harwerek vannak itt, amiket nem lehetett netről parsolni, vagy egyszerűbb
    //kézzel létrehozni és JSON-be lementeni.
    public void createCustomJsonHardwareLists(){
        JSONArray waterCoolingJsonList = new JSONArray();
        String waterCoolerPumpName= "pumpa";
        String waterCoolerFanName= "ventillator";
        List<String> waterCoolersTypeList = Arrays.asList(
                "1x "+waterCoolerPumpName +" 1x "+waterCoolerFanName,
                "1x "+waterCoolerPumpName +" 2x "+waterCoolerFanName,
                "1x "+waterCoolerPumpName +" 3x "+waterCoolerFanName,
                "2x "+waterCoolerPumpName +" 2x "+waterCoolerFanName,
                "2x "+waterCoolerPumpName +" 3x "+waterCoolerFanName,
                "2x "+waterCoolerPumpName +" 4x "+waterCoolerFanName,
                "2x "+waterCoolerPumpName +" 5x "+waterCoolerFanName,
                "2x "+waterCoolerPumpName +" 6x "+waterCoolerFanName
        );

        JSONObject waterCooler;
        int waterCoolerId=1;
        int waterCoolerConsumption=15;

        for (String wCooler:waterCoolersTypeList) {

            waterCoolingJsonList.add(new CustomHardware(waterCoolerId,wCooler,waterCoolerConsumption).convertCustomHardwareToJsonObject());

            waterCoolerId++;
            waterCoolerConsumption+=5;
        }

        try {
            saveHardwareList(waterCoolingJsonList,"WaterCooler");
        } catch (IOException e) {
            e.printStackTrace();
        }




        JSONArray ramJsonList = new JSONArray();

        ramJsonList.add(new CustomHardware(1,"DDR1",10).convertCustomHardwareToJsonObject());
        ramJsonList.add(new CustomHardware(2,"DDR2",7).convertCustomHardwareToJsonObject());
        ramJsonList.add(new CustomHardware(3,"DDR3",5).convertCustomHardwareToJsonObject());
        ramJsonList.add(new CustomHardware(4,"DDR4",3).convertCustomHardwareToJsonObject());

        try {
            saveHardwareList(ramJsonList,"ram");
        } catch (IOException e) {
            e.printStackTrace();
        }



        JSONArray discWriterJsonlist = new JSONArray();

        discWriterJsonlist.add(new CustomHardware(1,"CD-ROM / CD-RW",20).convertCustomHardwareToJsonObject());
        discWriterJsonlist.add(new CustomHardware(2,"DVD-ROM / DVD-RW / DVD+RW",25).convertCustomHardwareToJsonObject());
        discWriterJsonlist.add(new CustomHardware(3,"DVD / CD-RW Kombo",30).convertCustomHardwareToJsonObject());
        discWriterJsonlist.add(new CustomHardware(4,"Blu-Ray",25).convertCustomHardwareToJsonObject());

        try {
            saveHardwareList(discWriterJsonlist,"discwriter");
        } catch (IOException e) {
            e.printStackTrace();
        }


        //Konzolok fogyasztásának létrehozni a JSON filet.
        JSONArray gamingConsolesJsonList = new JSONArray();

        gamingConsolesJsonList.add(new CustomHardware(1,"XBOX One",120).convertCustomHardwareToJsonObject());
        gamingConsolesJsonList.add(new CustomHardware(2,"XBOX One S",90).convertCustomHardwareToJsonObject());
        gamingConsolesJsonList.add(new CustomHardware(3,"XBOX One X",180).convertCustomHardwareToJsonObject());
        gamingConsolesJsonList.add(new CustomHardware(4,"PS4",150).convertCustomHardwareToJsonObject());
        gamingConsolesJsonList.add(new CustomHardware(5,"PS4 Slim",110).convertCustomHardwareToJsonObject());
        gamingConsolesJsonList.add(new CustomHardware(6,"PS4 Pro",160).convertCustomHardwareToJsonObject());
        gamingConsolesJsonList.add(new CustomHardware(7,"XBOX 360",180).convertCustomHardwareToJsonObject());
        gamingConsolesJsonList.add(new CustomHardware(8,"XBOX 360 S",90).convertCustomHardwareToJsonObject());
        gamingConsolesJsonList.add(new CustomHardware(9,"PS3",190).convertCustomHardwareToJsonObject());
        gamingConsolesJsonList.add(new CustomHardware(10,"PS3 Slim",85).convertCustomHardwareToJsonObject());
        gamingConsolesJsonList.add(new CustomHardware(11,"Nintendo Switch",18).convertCustomHardwareToJsonObject());
        gamingConsolesJsonList.add(new CustomHardware(12,"Wii",40).convertCustomHardwareToJsonObject());
        gamingConsolesJsonList.add(new CustomHardware(13,"Wii U",35).convertCustomHardwareToJsonObject());

        try {
            saveHardwareList(gamingConsolesJsonList,"console");
        } catch (IOException e) {
            e.printStackTrace();
        }


        JSONArray foodPollutionList = createFoodPollutionList();
        try {
            saveHardwareList(foodPollutionList,"foodpollution");
        } catch (IOException e) {
            e.printStackTrace();
        }


        //Kezdetnek üres garbageMarker JSON file létrehozása
        JSONArray garbageMarkersJsonlist = new JSONArray();
        try {
            saveHardwareList(garbageMarkersJsonlist,"garbagemarker");
        } catch (IOException e) {
            e.printStackTrace();
        }

        //Üres challegen file létrehozása
        JSONArray challengesJsonlist = new JSONArray();
        try {
            saveHardwareList(challengesJsonlist,"challenge");
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    JSONArray createFoodPollutionList(){
        JSONArray foodPollutionJsonList = new JSONArray();

        foodPollutionJsonList.add(new Food(1,"Beef",36,35).convertFoodToJson());
        foodPollutionJsonList.add(new Food(2,"Chocolate",34,0).convertFoodToJson());
        foodPollutionJsonList.add(new Food(3,"Coffee",29,0).convertFoodToJson());
        foodPollutionJsonList.add(new Food(4,"Lamb",14,26).convertFoodToJson());
        foodPollutionJsonList.add(new Food(5,"Pork",12,2).convertFoodToJson());
        foodPollutionJsonList.add(new Food(6,"Chicken",10,0).convertFoodToJson());
        foodPollutionJsonList.add(new Food(7,"Eggs",5,0).convertFoodToJson());
        foodPollutionJsonList.add(new Food(8,"Vegetables",2,0).convertFoodToJson());


        return foodPollutionJsonList;
    }



}
