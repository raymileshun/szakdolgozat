package com.example.databaseapi.Controllers;

import com.example.databaseapi.Service.Service;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

@RestController
public class Endpoints {

    Service service = new Service();

    @GetMapping("/cpus")
    Object cpusEndpoint() throws IOException, ParseException {
        SimpleDateFormat formatter= new SimpleDateFormat("yyyy-MM-dd 'at' HH:mm:ss z");
        Date date = new Date(System.currentTimeMillis());
        System.out.println("Request at: "+formatter.format(date));
        return service.parseFile("cpu");
    }

    @GetMapping("/gpus")
    Object gpuEndpoint() throws IOException, ParseException {
        return service.parseFile("gpu");
    }

    @GetMapping(value = "/cpus/{cpuName}")
    public @ResponseBody
    JSONArray filteredCpuListEndpoint(@PathVariable String cpuName) throws IOException, ParseException {
        return service.getFilteredHardwareList("cpu",cpuName);
    }

    @GetMapping(value = "/gpus/{gpuName}")
    public @ResponseBody
    JSONArray filteredGpuListEndpoint(@PathVariable String gpuName) throws IOException, ParseException {
        return service.getFilteredHardwareList("gpu",gpuName);
    }

    @GetMapping(value = "/consumption/{consumption}")
    public @ResponseBody
    JSONObject consumptionCostEndpoint(@PathVariable String consumption)  {
        JSONObject response=new JSONObject();
        try {
            response.put("consumptionInKWh:",Integer.parseInt(consumption));
            response.put("consumptionPrice:", (int) (Integer.parseInt(consumption) * 36.8));
        } catch (NumberFormatException e){
           // e.printStackTrace();
        }
        return response;
    }

}
