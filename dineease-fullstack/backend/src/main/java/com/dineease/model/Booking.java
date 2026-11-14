package com.dineease.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Booking {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private Long userId;
    private Long restaurantId;
    private LocalDate bookingDate;
    private LocalTime bookingTime;
    private Integer guests;
    private String tableType;
    private String paymentMethod;
    private Integer subtotal;
    private Integer tax;
    private Integer serviceFee;
    private Integer total;
    private String status = "CONFIRMED";
    @OneToMany(mappedBy="booking", cascade=CascadeType.ALL, orphanRemoval=true)
    private List<BookingItem> items = new ArrayList<>();

    public Booking() {}
    public void addItem(BookingItem item){items.add(item);item.setBooking(this);}
    public Long getId(){return id;} public Long getUserId(){return userId;} public void setUserId(Long v){userId=v;}
    public Long getRestaurantId(){return restaurantId;} public void setRestaurantId(Long v){restaurantId=v;}
    public LocalDate getBookingDate(){return bookingDate;} public void setBookingDate(LocalDate v){bookingDate=v;}
    public LocalTime getBookingTime(){return bookingTime;} public void setBookingTime(LocalTime v){bookingTime=v;}
    public Integer getGuests(){return guests;} public void setGuests(Integer v){guests=v;}
    public String getTableType(){return tableType;} public void setTableType(String v){tableType=v;}
    public String getPaymentMethod(){return paymentMethod;} public void setPaymentMethod(String v){paymentMethod=v;}
    public Integer getSubtotal(){return subtotal;} public void setSubtotal(Integer v){subtotal=v;}
    public Integer getTax(){return tax;} public void setTax(Integer v){tax=v;}
    public Integer getServiceFee(){return serviceFee;} public void setServiceFee(Integer v){serviceFee=v;}
    public Integer getTotal(){return total;} public void setTotal(Integer v){total=v;}
    public String getStatus(){return status;} public List<BookingItem> getItems(){return items;}
}
