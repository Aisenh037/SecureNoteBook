package com.example.SecureNoteBook.dto;

public class PasswordUpdateRequest {
    private String currentPassword;
    private String newPassword;

    public String getCurrentPassword() { return currentPassword; }
    public String getNewPassword() { return newPassword; }
}
