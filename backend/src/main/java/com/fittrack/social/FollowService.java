package com.fittrack.social;

import com.fittrack.common.NotFoundException;
import com.fittrack.user.User;
import com.fittrack.user.UserRepository;
import com.fittrack.user.UserSummaryDto;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;

    public void follow(Long followerId, Long followeeId) {
        if (followerId.equals(followeeId)) {
            throw new IllegalArgumentException("Vous ne pouvez pas vous suivre vous-même");
        }
        if (followRepository.existsByFollowerIdAndFolloweeId(followerId, followeeId)) {
            return;
        }
        User follower = userRepository.findById(followerId).orElseThrow(() -> new NotFoundException("Utilisateur introuvable"));
        User followee = userRepository.findById(followeeId).orElseThrow(() -> new NotFoundException("Utilisateur introuvable"));
        Follow follow = new Follow();
        follow.setFollower(follower);
        follow.setFollowee(followee);
        followRepository.save(follow);
    }

    public void unfollow(Long followerId, Long followeeId) {
        followRepository.findByFollowerIdAndFolloweeId(followerId, followeeId).ifPresent(followRepository::delete);
    }

    @Transactional(readOnly = true)
    public List<UserSummaryDto> following(Long followerId) {
        return followRepository.findByFollowerId(followerId).stream()
                .map(f -> UserSummaryDto.from(f.getFollowee()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<UserSummaryDto> followers(Long followeeId) {
        return followRepository.findByFolloweeId(followeeId).stream()
                .map(f -> UserSummaryDto.from(f.getFollower()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<Long> followingIds(Long followerId) {
        return followRepository.findByFollowerId(followerId).stream()
                .map(f -> f.getFollowee().getId())
                .toList();
    }
}
