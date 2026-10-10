package com.fittrack.security;

import com.fittrack.common.NotFoundException;
import com.fittrack.user.User;
import com.fittrack.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CurrentUserService {

    private final UserRepository userRepository;

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new NotFoundException("Utilisateur introuvable"));
    }

    public Long getCurrentUserId() {
        return getCurrentUser().getId();
    }
}
