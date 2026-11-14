package com.dineease.dto;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
public record BookingRequest(
    @NotNull Long userId, @NotNull Long restaurantId, @NotNull LocalDate bookingDate,
    @NotNull LocalTime bookingTime, @Min(1) @Max(20) Integer guests,
    @NotBlank String tableType, @NotBlank String paymentMethod,
    List<BookingLineRequest> items
) {
    public record BookingLineRequest(@NotNull Long menuItemId, @Min(1) Integer quantity) {}
}
