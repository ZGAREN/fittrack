package com.fittrack.activity.dto;

import com.fittrack.activity.ActivityType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.time.Instant;
import java.util.List;

public record ActivityCreateRequest(
        @NotNull ActivityType type,
        @NotBlank String title,
        @NotNull Instant startTime,
        @PositiveOrZero long durationSeconds,
        @PositiveOrZero double distanceMeters,
        @Valid List<GpsPointDto> points) {
}
