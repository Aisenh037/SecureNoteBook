package com.example.SecureNoteBook.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // email (Google) OR login (GitHub)
    @Column(unique = true, nullable = false)
    private String username;

    // null for OAuth users
    @Column
    private String password;

    // LOCAL | GITHUB | GOOGLE
    @Column(nullable = false)
    private String provider;

    @Column(nullable = false)
    private boolean enabled = true;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id")
    )
    @Column(name = "role")
    private Set<String> roles = new HashSet<>();
}
