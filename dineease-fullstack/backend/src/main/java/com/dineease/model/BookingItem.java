package com.dineease.model;

import jakarta.persistence.*;

@Entity
public class BookingItem {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    private Long menuItemId;
    private String itemName;
    private Integer unitPrice;
    private Integer quantity;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="booking_id") private Booking booking;

    public BookingItem() {}
    public BookingItem(Long menuItemId,String itemName,Integer unitPrice,Integer quantity){this.menuItemId=menuItemId;this.itemName=itemName;this.unitPrice=unitPrice;this.quantity=quantity;}
    public void setBooking(Booking booking){this.booking=booking;}
    public Long getId(){return id;} public Long getMenuItemId(){return menuItemId;} public String getItemName(){return itemName;}
    public Integer getUnitPrice(){return unitPrice;} public Integer getQuantity(){return quantity;}
}
