package com.example.databaseapi;

import com.example.databaseapi.Challenge.Challenge;
import com.example.databaseapi.Challenge.DailyChallenges;
import com.example.databaseapi.Controllers.Endpoints;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

import java.util.ArrayList;

@SpringBootApplication
@ComponentScan(basePackageClasses = Endpoints.class)
public class CpuDatabaseApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(CpuDatabaseApiApplication.class, args);


    }

}
