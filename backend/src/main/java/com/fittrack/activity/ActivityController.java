package com.fittrack.activity;

import com.fittrack.activity.dto.ActivityCreateRequest;
import com.fittrack.activity.dto.ActivityResponse;
import com.fittrack.security.CurrentUserService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;
    private final CurrentUserService currentUserService;

    @PostMapping
    public ResponseEntity<ActivityResponse> create(@Valid @RequestBody ActivityCreateRequest request) {
        Long userId = currentUserService.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED).body(activityService.create(userId, request));
    }

    @GetMapping("/me")
    public List<ActivityResponse> getMine() {
        return activityService.getForOwner(currentUserService.getCurrentUserId());
    }

    @GetMapping("/feed")
    public List<ActivityResponse> getFeed() {
        return activityService.getFeed(currentUserService.getCurrentUserId());
    }

    @GetMapping("/{id}")
    public ActivityResponse getById(@PathVariable Long id) {
        return activityService.getById(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Long userId = currentUserService.getCurrentUserId();
        activityService.delete(id, userId);
        return ResponseEntity.noContent().build();
    }
}
