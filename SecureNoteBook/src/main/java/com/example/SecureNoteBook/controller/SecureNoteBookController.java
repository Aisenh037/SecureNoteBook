package com.example.SecureNoteBook.controller;

import com.example.SecureNoteBook.jwt.JwtUtils;
import com.example.SecureNoteBook.jwt.LoginRequest;
import com.example.SecureNoteBook.jwt.LoginResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.example.SecureNoteBook.model.User;
import com.example.SecureNoteBook.model.AuthProvider;
import com.example.SecureNoteBook.repository.UserRepository;
import org.springframework.security.authentication.BadCredentialsException;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class SecureNoteBookController {

    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;

    public SecureNoteBookController(
            JwtUtils jwtUtils,
            AuthenticationManager authenticationManager,
            UserRepository userRepository
    ) {
        this.jwtUtils = jwtUtils;
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
    }

    /* ================= AUTH ================= */

    @PostMapping("/signin")
    public ResponseEntity<?> authenticate(@RequestBody LoginRequest request) {

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new BadCredentialsException("Invalid username or password"));

        if (user.getProvider() != AuthProvider.LOCAL) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "message",
                            "Use OAuth login for this account"
                    ));
        }

        try {
            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    request.getUsername(),
                                    request.getPassword()
                            )
                    );

            UserDetails userDetails =
                    (UserDetails) authentication.getPrincipal();

            String jwt = jwtUtils.generateJwtFromUsername(
                    userDetails.getUsername()
            );

            List<String> roles = userDetails.getAuthorities()
                    .stream()
                    .map(a -> a.getAuthority())
                    .toList();

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

    @PreAuthorize("hasAnyAuthority('ROLE_USER','ROLE_ADMIN')")
    @GetMapping("/api/profile")
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
