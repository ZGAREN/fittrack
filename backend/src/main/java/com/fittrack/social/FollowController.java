package com.fittrack.social;

import com.fittrack.security.CurrentUserService;
import com.fittrack.user.UserSummaryDto;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/follows")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;
    private final CurrentUserService currentUserService;

    @PostMapping("/{userId}")
    public ResponseEntity<Void> follow(@PathVariable Long userId) {
        followService.follow(currentUserService.getCurrentUserId(), userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> unfollow(@PathVariable Long userId) {
        followService.unfollow(currentUserService.getCurrentUserId(), userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/following")
    public List<UserSummaryDto> following() {
        return followService.following(currentUserService.getCurrentUserId());
    }

    @GetMapping("/followers")
    public List<UserSummaryDto> followers() {
        return followService.followers(currentUserService.getCurrentUserId());
    }
}
