import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.jsoup.Jsoup;

import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;

public class Service {

    String cpuListUrl = "https://www.cpubenchmark.net/CPU_mega_page.html";
    String gpuListUrl = "https://www.videocardbenchmark.net/GPU_mega_page.html";

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

    public JSONArray parseHtml(String hardwareName) {
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

        return hardwareList;
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

    public void saveHardwareList(String hardwareName) throws IOException {
        JSONArray hardwareList = parseHtml(hardwareName);

        try (FileWriter file = new FileWriter(hardwareName.toUpperCase() + "s.txt")) {
            file.write(hardwareList.toJSONString());
            //System.out.println(hardwareName.toUpperCase() + " List:\n " + hardwareList);
        }
    }

    public void downloadHardwareLists() throws IOException {
        saveHardwareList("cpu");
        saveHardwareList("gpu");
    }

}
