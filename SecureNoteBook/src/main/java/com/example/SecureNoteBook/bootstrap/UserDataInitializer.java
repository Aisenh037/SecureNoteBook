package com.example.SecureNoteBook.bootstrap;

import com.example.SecureNoteBook.model.User;
import com.example.SecureNoteBook.repository.UserRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
public class UserDataInitializer {

    @Bean
    ApplicationRunner seedUsers(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {

            // ================= ADMIN =================
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin@123"));
                admin.setProvider("LOCAL");
                admin.setEnabled(true);
                admin.setRoles(Set.of("ROLE_ADMIN"));
                userRepository.save(admin);
            }

            // ================= USER =================
            if (userRepository.findByUsername("karan").isEmpty()) {
                User user = new User();
                user.setUsername("karan");
                user.setPassword(passwordEncoder.encode("kc@123"));
                user.setProvider("LOCAL");
                user.setEnabled(true);
                user.setRoles(Set.of("ROLE_USER"));
                userRepository.save(user);
            }
        };
    }
}
