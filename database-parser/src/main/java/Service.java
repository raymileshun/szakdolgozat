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

            hardware.put("hardwareId", hardwareId);
            hardware.put("hardwareName", hardwareObjectName);
            hardware.put("hardwareConsumption", hardwareConsumption);

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
            String consumption = (String) hardware.get("hardwareConsumption");
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
        String waterCoolerPumpName= "pump";
        String waterCoolerFanName= "fan";
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
            waterCooler = new JSONObject();
            waterCooler.put("hardwareId", waterCoolerId);
            waterCooler.put("hardwareName", wCooler);
            waterCooler.put("hardwareConsumption", waterCoolerConsumption);
            waterCoolingJsonList.add(waterCooler);

            waterCoolerId++;
            waterCoolerConsumption+=5;
        }

        try {
            saveHardwareList(waterCoolingJsonList,"WaterCooler");
        } catch (IOException e) {
            e.printStackTrace();
        }




        JSONArray ramJsonList = new JSONArray();
        JSONObject ram;

        ram = new JSONObject();
        ram.put("hardwareId", 1);
        ram.put("hardwareName", "DDR1");
        ram.put("hardwareConsumption", 10);
        ramJsonList.add(ram);

        ram = new JSONObject();
        ram.put("hardwareId", 2);
        ram.put("hardwareName", "DDR2");
        ram.put("hardwareConsumption", 7);
        ramJsonList.add(ram);

        ram = new JSONObject();
        ram.put("hardwareId", 3);
        ram.put("hardwareName", "DDR3");
        ram.put("hardwareConsumption", 5);
        ramJsonList.add(ram);

        ram = new JSONObject();
        ram.put("hardwareId", 4);
        ram.put("hardwareName", "DDR4");
        ram.put("hardwareConsumption", 3);
        ramJsonList.add(ram);

        try {
            saveHardwareList(ramJsonList,"ram");
        } catch (IOException e) {
            e.printStackTrace();
        }



        JSONArray discWriterJsonlist = new JSONArray();
        JSONObject discWriter;

        discWriter = new JSONObject();
        discWriter.put("hardwareId", 1);
        discWriter.put("hardwareName", "CD-ROM / CD-RW");
        discWriter.put("hardwareConsumption", 20);
        discWriterJsonlist.add(discWriter);

        discWriter = new JSONObject();
        discWriter.put("hardwareId", 2);
        discWriter.put("hardwareName", "DVD-ROM / DVD-RW / DVD+RW");
        discWriter.put("hardwareConsumption", 25);
        discWriterJsonlist.add(discWriter);

        discWriter = new JSONObject();
        discWriter.put("hardwareId", 3);
        discWriter.put("hardwareName", "DVD / CD-RW Kombo");
        discWriter.put("hardwareConsumption", 30);
        discWriterJsonlist.add(discWriter);

        discWriter = new JSONObject();
        discWriter.put("hardwareId", 4);
        discWriter.put("hardwareName", "Blu-Ray");
        discWriter.put("hardwareConsumption", 25);
        discWriterJsonlist.add(discWriter);

        try {
            saveHardwareList(discWriterJsonlist,"discwriter");
        } catch (IOException e) {
            e.printStackTrace();
        }

        JSONArray garbageMarkersJsonlist = new JSONArray();
        try {
            saveHardwareList(garbageMarkersJsonlist,"garbagemarker");
        } catch (IOException e) {
            e.printStackTrace();
        }


    }

}
