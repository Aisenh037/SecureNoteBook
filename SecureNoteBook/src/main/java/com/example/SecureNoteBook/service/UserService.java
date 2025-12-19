package com.example.SecureNoteBook.service;

import com.example.SecureNoteBook.model.User;

public interface UserService {

    User getOrCreateOAuthUser(String username, String provider);

}
