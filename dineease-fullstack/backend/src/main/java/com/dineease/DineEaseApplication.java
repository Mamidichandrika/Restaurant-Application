package com.dineease;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.dineease.repository")
@EntityScan(basePackages = "com.dineease.model")
public class DineEaseApplication {

    public static void main(String[] args) {
        SpringApplication.run(DineEaseApplication.class, args);
    }
}