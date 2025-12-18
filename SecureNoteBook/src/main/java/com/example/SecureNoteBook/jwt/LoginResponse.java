package com.example.SecureNoteBook.jwt;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class LoginResponse {

    @JsonProperty("jwtToken")
    private String jwtToken;

    private String username;
    private List<String> roles;

    public LoginResponse() {
    }

    public LoginResponse(String jwtToken, String username, List<String> roles) {
        this.jwtToken = jwtToken;
        this.username = username;
        this.roles = roles;
    }

    public String getJwtToken() {
        return jwtToken;
    }

    public void setJwtToken(String jwtToken) {
        this.jwtToken = jwtToken;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}
