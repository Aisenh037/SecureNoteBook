package com.example.SecureNoteBook.repository;

import com.example.SecureNoteBook.model.Note;
import com.example.SecureNoteBook.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

public interface NoteRepository extends JpaRepository<Note, Long> {

    List<Note> findByUser(User user);

    Page<Note> findByUser(User user, Pageable pageable);

    Optional<Note> findByIdAndUser(Long id, User user);
}
