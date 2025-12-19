package com.example.SecureNoteBook.service;

import com.example.SecureNoteBook.model.User;
import com.example.SecureNoteBook.model.AuthProvider;
import com.example.SecureNoteBook.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User getOrCreateOAuthUser(String username, String provider) {
        return userRepository.findByUsername(username)
                .orElseGet(() -> {
                    User user = new User();
                    user.setUsername(username);
                    user.setProvider(AuthProvider.valueOf(provider.toUpperCase()));
                    user.setEnabled(true);
                    user.setRoles(Set.of("USER"));
                    return userRepository.save(user);
                });
    }
}
