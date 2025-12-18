package com.example.SecureNoteBook.service;

public interface UserService {

    void getOrCreateOAuthUser(String username, String provider);

}
