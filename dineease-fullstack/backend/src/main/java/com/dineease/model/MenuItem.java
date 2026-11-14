package com.dineease.model;

import jakarta.persistence.*;

@Entity
public class MenuItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private Long restaurantId;
    private String name;
    @Column(length=1000) private String description;
    private Integer price;
    @Column(length=1000) private String imageUrl;

    public MenuItem() {}
    public MenuItem(Long restaurantId,String name,String description,Integer price,String imageUrl){this.restaurantId=restaurantId;this.name=name;this.description=description;this.price=price;this.imageUrl=imageUrl;}
    public Long getId(){return id;} public Long getRestaurantId(){return restaurantId;} public String getName(){return name;}
    public String getDescription(){return description;} public Integer getPrice(){return price;} public String getImageUrl(){return imageUrl;}
}
