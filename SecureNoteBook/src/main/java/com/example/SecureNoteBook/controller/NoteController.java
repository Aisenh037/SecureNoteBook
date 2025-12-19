package com.example.SecureNoteBook.controller;

import com.example.SecureNoteBook.dto.NoteRequest;
import com.example.SecureNoteBook.dto.NoteResponse;
import com.example.SecureNoteBook.model.Note;
import com.example.SecureNoteBook.service.NoteService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
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

    /* ================= CREATE ================= */
    @PostMapping
    public ResponseEntity<NoteResponse> create(
            @RequestBody NoteRequest req,
            Authentication auth
    ) {
        return ResponseEntity.ok(
                noteService.create(req, auth.getName())
        );
    }

    /* ================= READ (PAGED) ================= */
    @GetMapping
    public ResponseEntity<Page<NoteResponse>> getNotes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication auth
    ) {
        return ResponseEntity.ok(
                noteService.getPaged(auth.getName(), page, size)
        );
    }

    /* ================= UPDATE (TITLE / CONTENT / PIN) ================= */
    @PutMapping("/{id}")
    public ResponseEntity<NoteResponse> update(
            @PathVariable Long id,
            @RequestBody NoteRequest req,
            Authentication auth
    ) {
        return ResponseEntity.ok(
                noteService.update(id, req, auth.getName())
        );
    }

    /* ================= PIN / UNPIN ================= */
    @PatchMapping("/{id}/pin")
    public ResponseEntity<NoteResponse> togglePin(
            @PathVariable Long id,
            Authentication auth
    ) {
        return ResponseEntity.ok(
                noteService.togglePin(id, auth.getName())
        );
    }

    /* ================= DELETE ================= */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            Authentication auth
    ) {
        noteService.delete(id, auth.getName());
        return ResponseEntity.noContent().build();
    }
}