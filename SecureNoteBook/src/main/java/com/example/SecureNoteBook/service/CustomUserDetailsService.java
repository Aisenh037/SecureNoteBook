package com.example.SecureNoteBook.service;

import com.example.SecureNoteBook.model.AuthProvider;
import com.example.SecureNoteBook.model.User;
import com.example.SecureNoteBook.repository.UserRepository;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
@Primary
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found"));

        if (user.getProvider() != AuthProvider.LOCAL) {
            throw new UsernameNotFoundException(
                    "OAuth users must login via OAuth"
            );
        }

        if (user.getPassword() == null) {
            throw new IllegalStateException(
                    "LOCAL user has null password"
            );
        }

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                user.getRoles().stream()
                        .map(SimpleGrantedAuthority::new)
                        .toList()
        );
    }

}
