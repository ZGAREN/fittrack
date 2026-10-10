package com.fittrack.social;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FollowRepository extends JpaRepository<Follow, Long> {

    Optional<Follow> findByFollowerIdAndFolloweeId(Long followerId, Long followeeId);

    List<Follow> findByFollowerId(Long followerId);

    List<Follow> findByFolloweeId(Long followeeId);

    boolean existsByFollowerIdAndFolloweeId(Long followerId, Long followeeId);
}
