package com.fittrack.user;

import com.fittrack.common.NotFoundException;
import com.fittrack.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final CurrentUserService currentUserService;
    private final UserRepository userRepository;

    @GetMapping("/me")
    public UserSummaryDto me() {
        return UserSummaryDto.from(currentUserService.getCurrentUser());
    }

    @GetMapping("/{id}")
    public UserSummaryDto byId(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(UserSummaryDto::from)
                .orElseThrow(() -> new NotFoundException("Utilisateur introuvable"));
    }
}
