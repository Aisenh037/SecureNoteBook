package com.example.SecureNoteBook.dto;

public class ProfileResponse {
    private String username;
    private String email;
    private String provider;

    public ProfileResponse(String u, String e, String p) {
        this.username = u;
        this.email = e;
        this.provider = p;
    }
}
