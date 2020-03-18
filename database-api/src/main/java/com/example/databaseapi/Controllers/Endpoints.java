package com.example.databaseapi.Controllers;

import com.example.databaseapi.Service.Service;
import org.apache.commons.io.IOUtils;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
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

    @GetMapping("/watercoolers")
    Object waterCoolerEndpoint() throws IOException, ParseException {
        return service.parseFile("watercooler");
    }

    @GetMapping("/rams")
    Object ramEndpoint() throws IOException, ParseException {
        return service.parseFile("ram");
    }

    @GetMapping("/discwriters")
    Object discwriterEndpoint() throws IOException, ParseException {
        return service.parseFile("discwriter");
    }

    @GetMapping("/garbagemarkers")
    Object garbageMarkersEndpoint() throws IOException, ParseException {
        return service.parseFile("garbagemarker");
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

    @RequestMapping(value = "/getimage/{id}", method = RequestMethod.GET)
    public ResponseEntity<byte[]> getImage(@PathVariable String id) throws IOException {
        File fi = new File("garbage-pictures/"+id+".jpg");
        byte[] image = Files.readAllBytes(fi.toPath());
        return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(image);
    }

//    @RequestMapping(value = "/saveMarker/{id}/{latitude}/{longitude}", method = RequestMethod.GET)
//    public Object saveMarker(@PathVariable String id,@PathVariable String latitude, @PathVariable String longitude) throws IOException {
        @RequestMapping(value = "/saveMarker/{latitude}/{longitude}", method = RequestMethod.POST)
        public Object saveMarker(@PathVariable String latitude, @PathVariable String longitude, @RequestBody String imagePath) throws IOException, ParseException {
        return service.saveMarker(latitude,longitude,imagePath);
    }

    @RequestMapping(value = "/updateMarker/{id}", method = RequestMethod.PUT)
    public Object updateMarker(@PathVariable String id) throws IOException, ParseException {
        return service.updateMarker(id);
    }

}
