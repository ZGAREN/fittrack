package com.fittrack.activity.dto;

import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record GpsPointDto(
        @NotNull Double latitude,
        @NotNull Double longitude,
        Double elevation,
        @NotNull Instant recordedAt,
        int sequence) {
}
