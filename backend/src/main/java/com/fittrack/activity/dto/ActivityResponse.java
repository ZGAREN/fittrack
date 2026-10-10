package com.fittrack.activity.dto;

import com.fittrack.activity.Activity;
import com.fittrack.activity.ActivityType;
import java.time.Instant;
import java.util.List;

public record ActivityResponse(
        Long id,
        ActivityType type,
        String title,
        Instant startTime,
        long durationSeconds,
        double distanceMeters,
        double averageSpeedKmh,
        Long ownerId,
        String ownerDisplayName,
        List<GpsPointDto> points) {

    public static ActivityResponse summary(Activity activity) {
        return new ActivityResponse(
                activity.getId(),
                activity.getType(),
                activity.getTitle(),
                activity.getStartTime(),
                activity.getDurationSeconds(),
                activity.getDistanceMeters(),
                activity.getAverageSpeedKmh(),
                activity.getOwner().getId(),
                activity.getOwner().getDisplayName(),
                null);
    }

    public static ActivityResponse detail(Activity activity) {
        List<GpsPointDto> points = activity.getPoints().stream()
                .map(p -> new GpsPointDto(p.getLatitude(), p.getLongitude(), p.getElevation(), p.getRecordedAt(), p.getSequence()))
                .toList();
        return new ActivityResponse(
                activity.getId(),
                activity.getType(),
                activity.getTitle(),
                activity.getStartTime(),
                activity.getDurationSeconds(),
                activity.getDistanceMeters(),
                activity.getAverageSpeedKmh(),
                activity.getOwner().getId(),
                activity.getOwner().getDisplayName(),
                points);
    }
}
