package com.dineease.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
public record LoginRequest(@NotBlank String username, @NotBlank @Pattern(regexp="^[0-9]{10}$", message="Mobile number must contain 10 digits") String mobileNumber) {}
