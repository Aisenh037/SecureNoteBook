package com.example.SecureNoteBook.controller;

import com.example.SecureNoteBook.dto.NoteRequest;
import com.example.SecureNoteBook.dto.NoteResponse;
import com.example.SecureNoteBook.model.Note;
import com.example.SecureNoteBook.service.NoteService;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @PostMapping
    public NoteResponse create(@RequestBody NoteRequest req,
                       Authentication auth) {
        return noteService.create(req, auth.getName());
    }

//    @GetMapping
//    public List<NoteResponse> getAll(Authentication auth) {
//        return noteService.getAll(auth.getName());
//    }

    @GetMapping
    public Page<NoteResponse> getNotes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication auth
    ) {
        return noteService.getPaged(auth.getName(), page, size);
    }


    @PutMapping("/{id}")
    public NoteResponse update(@PathVariable Long id,
                       @RequestBody NoteRequest req,
                       Authentication auth) {
        return noteService.update(id, req, auth.getName());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id,
                       Authentication auth) {
        noteService.delete(id, auth.getName());
    }
}
