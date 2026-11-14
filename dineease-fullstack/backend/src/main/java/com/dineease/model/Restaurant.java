package com.dineease.model;

import jakarta.persistence.*;

@Entity
public class Restaurant {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String name;
    private String cuisine;
    private String distance;
    private Double rating;
    private Integer reviewCount;
    private String imageUrl;
    private String address;
    private String phone;

    public Restaurant() {}
    public Restaurant(String name, String cuisine, String distance, Double rating, Integer reviewCount, String imageUrl, String address, String phone) {
        this.name=name; this.cuisine=cuisine; this.distance=distance; this.rating=rating; this.reviewCount=reviewCount; this.imageUrl=imageUrl; this.address=address; this.phone=phone;
    }
    public Long getId(){return id;} public String getName(){return name;} public String getCuisine(){return cuisine;}
    public String getDistance(){return distance;} public Double getRating(){return rating;} public Integer getReviewCount(){return reviewCount;}
    public String getImageUrl(){return imageUrl;} public String getAddress(){return address;} public String getPhone(){return phone;}
}
