package com.fittrack.user;

public record UserSummaryDto(Long id, String displayName, String email) {

    public static UserSummaryDto from(User user) {
        return new UserSummaryDto(user.getId(), user.getDisplayName(), user.getEmail());
    }
}
