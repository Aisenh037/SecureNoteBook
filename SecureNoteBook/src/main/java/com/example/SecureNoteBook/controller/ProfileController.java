package com.example.SecureNoteBook.controller;

import com.example.SecureNoteBook.dto.PasswordUpdateRequest;
import com.example.SecureNoteBook.dto.ProfileResponse;
import com.example.SecureNoteBook.dto.ProfileUpdateRequest;
import com.example.SecureNoteBook.model.AuthProvider;
import com.example.SecureNoteBook.model.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.example.SecureNoteBook.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping(
        value = "/api/profile",
        produces = "application/json"
)
@PreAuthorize("hasAnyAuthority('ROLE_USER','ROLE_ADMIN')")
public class ProfileController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ProfileResponse get(Authentication auth) {
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow();

        return new ProfileResponse(
                user.getUsername(),
                user.getUsername(), // Using username in place of email since they're the same in our model
                user.getProvider().name()
        );
    }

    @PutMapping
    public ProfileResponse update(
            @RequestBody ProfileUpdateRequest req,
            Authentication auth
    ) {
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow();

        user.setUsername(req.getUsername());
        // Not setting email as it's the same as username in our model

        userRepository.save(user);

        return new ProfileResponse(
                user.getUsername(),
                user.getUsername(), // Using username in place of email since they're the same in our model
                user.getProvider().name()
        );
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(
            @RequestBody PasswordUpdateRequest req,
            Authentication auth
    ) {
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow();

        if (user.getProvider() != AuthProvider.LOCAL) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Password change not allowed"));
        }

        if (!passwordEncoder.matches(
                req.getCurrentPassword(),
                user.getPassword()
        )) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid current password"));
        }

        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok(
                Map.of("message", "Password updated successfully")
        );
    }

}

