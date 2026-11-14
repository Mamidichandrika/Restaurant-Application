package com.dineease.controller;

import com.dineease.dto.LoginRequest;
import com.dineease.model.AppUser;
import com.dineease.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository users;
    public UserController(UserRepository users){this.users=users;}

    @PostMapping("/login")
    public AppUser login(@Valid @RequestBody LoginRequest request) {
        return users.findByMobileNumber(request.mobileNumber())
            .map(user -> { user.setUsername(request.username()); return users.save(user); })
            .orElseGet(() -> users.save(new AppUser(request.username(), request.mobileNumber())));
    }
}
