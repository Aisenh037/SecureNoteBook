package com.example.SecureNoteBook.service;

import com.example.SecureNoteBook.dto.NoteRequest;
import com.example.SecureNoteBook.dto.NoteResponse;
import com.example.SecureNoteBook.model.Note;
import com.example.SecureNoteBook.model.User;
import com.example.SecureNoteBook.repository.NoteRepository;
import com.example.SecureNoteBook.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    public NoteService(NoteRepository noteRepository,
                       UserRepository userRepository) {
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
    }

    /* ================= CREATE ================= */
    @Transactional
    public NoteResponse create(NoteRequest req, String username) {
        User user = getUser(username);

        Note note = new Note(
                req.getTitle(),
                req.getContent(),
                user
        );

        return mapToResponse(noteRepository.save(note));
    }

    /* ================= READ (LEGACY – avoid in UI) ================= */
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<NoteResponse> getAll(String username) {
        User user = getUser(username);

        return noteRepository.findByUser(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /* ================= READ (PAGED – USE THIS) ================= */
    @Transactional(Transactional.TxType.SUPPORTS)
    public Page<NoteResponse> getPaged(String username, int page, int size) {
        User user = getUser(username);

        PageRequest pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "updatedAt")
        );

        return noteRepository
                .findByUser(user, pageable)
                .map(this::mapToResponse);
    }

    /* ================= UPDATE ================= */
    @Transactional
    public NoteResponse update(Long id, NoteRequest req, String username) {
        User user = getUser(username);

        Note note = noteRepository
                .findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));

        note.setTitle(req.getTitle());
        note.setContent(req.getContent());

        return mapToResponse(noteRepository.save(note));
    }

    /* ================= DELETE ================= */
    @Transactional
    public void delete(Long id, String username) {
        User user = getUser(username);

        Note note = noteRepository
                .findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));

        noteRepository.delete(note);
    }

    /* ================= HELPERS ================= */
    private User getUser(String username) {
        return userRepository
                .findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private NoteResponse mapToResponse(Note note) {
        return new NoteResponse(
                note.getId(),
                note.getTitle(),
                note.getContent(),
                note.getCreatedAt(),
                note.getUpdatedAt()
        );
    }
}
