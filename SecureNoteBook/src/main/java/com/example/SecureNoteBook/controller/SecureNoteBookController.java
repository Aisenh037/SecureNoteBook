package com.example.SecureNoteBook.controller;

import com.example.SecureNoteBook.jwt.JwtUtils;
import com.example.SecureNoteBook.jwt.LoginRequest;
import com.example.SecureNoteBook.jwt.LoginResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class SecureNoteBookController {

    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    public SecureNoteBookController(
            JwtUtils jwtUtils,
            AuthenticationManager authenticationManager
    ) {
        this.jwtUtils = jwtUtils;
        this.authenticationManager = authenticationManager;
    }

    /* ================= AUTH ================= */

    @PostMapping("/signin")
    public ResponseEntity<?> authenticate(@RequestBody LoginRequest request) {

        try {
            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    request.getUsername(),
                                    request.getPassword()
                            )
                    );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            String jwt = jwtUtils.generateJwtFromUsername(
                    userDetails.getUsername()
            );

            List<String> roles = userDetails.getAuthorities()
                    .stream()
                    .map(a -> a.getAuthority())
                    .collect(Collectors.toList());

            return ResponseEntity.ok(
                    new LoginResponse(
                            jwt,
                            userDetails.getUsername(),
                            roles
                    )
            );

        } catch (AuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid username or password"));
        }
    }

    /* ================= PROFILE ================= */

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/profile")
    public ResponseEntity<?> profile() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Unauthorized"));
        }

        Object principal = authentication.getPrincipal();

        //  OAUTH USER (principal is String)
        if (principal instanceof String) {
            return ResponseEntity.ok(
                    Map.of(
                            "username", principal,
                            "roles", authentication.getAuthorities()
                                    .stream()
                                    .map(a -> a.getAuthority())
                                    .collect(Collectors.toList())
                    )
            );
        }

        //  LOCAL USER (principal is UserDetails)
        UserDetails userDetails = (UserDetails) principal;

        return ResponseEntity.ok(
                Map.of(
                        "username", userDetails.getUsername(),
                        "roles", userDetails.getAuthorities()
                                .stream()
                                .map(a -> a.getAuthority())
                                .collect(Collectors.toList())
                )
        );
    }

    /* ================= DEMO ================= */

    @GetMapping("/hello")
    public String hello() {
        return "Hello Bro!";
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/user")
    public String userHello() {
        return "Hello User!";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public String adminHello() {
        return "Hello Admin!";
    }
}
