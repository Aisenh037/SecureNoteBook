package com.example.SecureNoteBook.dto;

public class NoteRequest {

    private String title;
    private String content;
    private Boolean pinned;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Boolean getPinned() { return pinned; }
}
