package com.dineease.config;

import com.dineease.model.*;
import com.dineease.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner seed(RestaurantRepository restaurants, MenuItemRepository menu) {
        return args -> {
            if (restaurants.count() > 0) return;
            Restaurant paradise=restaurants.save(new Restaurant("PARADISE","Hyderabadi Biryani, Tandoori","0.7 miles away",4.9,340,
                "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=1000","123 Foodie Lane, Culinary City","(555) 123-4567"));
            Restaurant mubarak=restaurants.save(new Restaurant("MUBARAK","Biryani, Indian Cuisine","0.5 miles away",4.6,180,
                "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1000","45 Market Road, Culinary City","(555) 222-4567"));
            restaurants.save(new Restaurant("SPICE GARDEN","North Indian, Chinese","1.2 miles away",4.5,125,
                "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1000","8 Garden Street, Culinary City","(555) 333-4567"));
            menu.save(new MenuItem(paradise.getId(),"Biryani","Spicy rice with chicken",250,"https://images.unsplash.com/photo-1563379091339-03246963d96c?w=300"));
            menu.save(new MenuItem(paradise.getId(),"Kaju Paneer Curry","Rich creamy curry with paneer and cashew paste",300,"https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300"));
            menu.save(new MenuItem(paradise.getId(),"Grilled Chicken","Smoky and juicy grilled chicken",280,"https://images.unsplash.com/photo-1532634896-26909d0d4b8b?w=300"));
            menu.save(new MenuItem(paradise.getId(),"Butter Naan","Soft and buttery naan made fresh in tandoor",60,"https://images.unsplash.com/photo-1600628422019-9a3e6c3a7f83?w=300"));
            menu.save(new MenuItem(paradise.getId(),"Cold Coffee","Chilled coffee blended with milk and cream",120,"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300"));
            menu.save(new MenuItem(mubarak.getId(),"Chicken Dum Biryani","Traditional aromatic chicken biryani",240,"https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=300"));
            menu.save(new MenuItem(mubarak.getId(),"Veg Biryani","Fragrant rice with seasonal vegetables",190,"https://images.unsplash.com/photo-1596797038530-2c107229654b?w=300"));
        };
    }
}
