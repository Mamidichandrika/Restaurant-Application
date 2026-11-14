package com.dineease.controller;

import com.dineease.dto.BookingRequest;
import com.dineease.model.*;
import com.dineease.repository.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    private final BookingRepository bookings;
    private final RestaurantRepository restaurants;
    private final UserRepository users;
    private final MenuItemRepository menu;
    public BookingController(BookingRepository bookings, RestaurantRepository restaurants, UserRepository users, MenuItemRepository menu){
        this.bookings=bookings;this.restaurants=restaurants;this.users=users;this.menu=menu;
    }

    @PostMapping @Transactional
    public Booking create(@Valid @RequestBody BookingRequest request){
        if(!users.existsById(request.userId())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"User not found");
        if(!restaurants.existsById(request.restaurantId())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Restaurant not found");
        if(request.bookingDate().isBefore(java.time.LocalDate.now())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Booking date cannot be in the past");
        Booking booking=new Booking();
        booking.setUserId(request.userId()); booking.setRestaurantId(request.restaurantId());
        booking.setBookingDate(request.bookingDate()); booking.setBookingTime(request.bookingTime());
        booking.setGuests(request.guests()); booking.setTableType(request.tableType()); booking.setPaymentMethod(request.paymentMethod());
        int subtotal=0;
        if(request.items()!=null) for(BookingRequest.BookingLineRequest line:request.items()){
            MenuItem item=menu.findById(line.menuItemId()).orElseThrow(()->new ResponseStatusException(HttpStatus.BAD_REQUEST,"Menu item not found"));
            if(!item.getRestaurantId().equals(request.restaurantId())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Menu item belongs to another restaurant");
            int qty=line.quantity(); subtotal += item.getPrice()*qty;
            booking.addItem(new BookingItem(item.getId(),item.getName(),item.getPrice(),qty));
        }
        int tax=Math.round(subtotal*0.05f), fee=subtotal>0?40:0;
        booking.setSubtotal(subtotal);booking.setTax(tax);booking.setServiceFee(fee);booking.setTotal(subtotal+tax+fee);
        return bookings.save(booking);
    }

    @GetMapping("/{id}") public Booking get(@PathVariable Long id){
        return bookings.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Booking not found"));
    }
}
