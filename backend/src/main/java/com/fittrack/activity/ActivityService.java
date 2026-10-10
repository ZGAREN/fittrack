package com.fittrack.activity;

import com.fittrack.activity.dto.ActivityCreateRequest;
import com.fittrack.activity.dto.ActivityResponse;
import com.fittrack.activity.dto.GpsPointDto;
import com.fittrack.common.NotFoundException;
import com.fittrack.social.FollowService;
import com.fittrack.user.User;
import com.fittrack.user.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;
    private final FollowService followService;

    public ActivityResponse create(Long ownerId, ActivityCreateRequest request) {
        User owner = userRepository.findById(ownerId).orElseThrow(() -> new NotFoundException("Utilisateur introuvable"));

        Activity activity = new Activity();
        activity.setOwner(owner);
        activity.setType(request.type());
        activity.setTitle(request.title());
        activity.setStartTime(request.startTime());
        activity.setDurationSeconds(request.durationSeconds());
        activity.setDistanceMeters(request.distanceMeters());

        if (request.points() != null) {
            for (GpsPointDto p : request.points()) {
                GpsPoint point = new GpsPoint();
                point.setLatitude(p.latitude());
                point.setLongitude(p.longitude());
                point.setElevation(p.elevation());
                point.setRecordedAt(p.recordedAt());
                point.setSequence(p.sequence());
                activity.addPoint(point);
            }
        }

        activity = activityRepository.save(activity);
        return ActivityResponse.detail(activity);
    }

    @Transactional(readOnly = true)
    public ActivityResponse getById(Long id) {
        return ActivityResponse.detail(findActivity(id));
    }

    @Transactional(readOnly = true)
    public List<ActivityResponse> getForOwner(Long ownerId) {
        return activityRepository.findByOwnerIdOrderByStartTimeDesc(ownerId).stream()
                .map(ActivityResponse::summary)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ActivityResponse> getFeed(Long userId) {
        List<Long> ids = followService.followingIds(userId);
        if (ids.isEmpty()) {
            return List.of();
        }
        return activityRepository.findByOwnerIdInOrderByStartTimeDesc(ids).stream()
                .map(ActivityResponse::summary)
                .toList();
    }

    public void delete(Long activityId, Long requesterId) {
        Activity activity = findActivity(activityId);
        if (!activity.getOwner().getId().equals(requesterId)) {
            throw new IllegalArgumentException("Vous ne pouvez supprimer que vos propres activités");
        }
        activityRepository.delete(activity);
    }

    private Activity findActivity(Long id) {
        return activityRepository.findById(id).orElseThrow(() -> new NotFoundException("Activité introuvable"));
    }
}
