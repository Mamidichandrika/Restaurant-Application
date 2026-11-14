package com.dineease.controller;

import com.dineease.model.*;
import com.dineease.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {
    private final RestaurantRepository restaurants;
    private final MenuItemRepository menu;
    public RestaurantController(RestaurantRepository restaurants, MenuItemRepository menu){this.restaurants=restaurants;this.menu=menu;}

    @GetMapping public List<Restaurant> all(){return restaurants.findAll();}
    @GetMapping("/{id}") public Restaurant one(@PathVariable Long id){return restaurants.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Restaurant not found"));}
    @GetMapping("/{id}/menu") public List<MenuItem> menu(@PathVariable Long id){one(id);return menu.findByRestaurantId(id);}
}
