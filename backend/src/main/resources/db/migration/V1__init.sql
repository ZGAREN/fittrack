CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE activities (
    id BIGSERIAL PRIMARY KEY,
    owner_id BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    type VARCHAR(32) NOT NULL,
    title VARCHAR(255) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    duration_seconds BIGINT NOT NULL,
    distance_meters DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_activities_owner_id ON activities (owner_id);

CREATE TABLE gps_points (
    id BIGSERIAL PRIMARY KEY,
    activity_id BIGINT NOT NULL REFERENCES activities (id) ON DELETE CASCADE,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    elevation DOUBLE PRECISION,
    recorded_at TIMESTAMP NOT NULL,
    sequence INT NOT NULL
);

CREATE INDEX idx_gps_points_activity_id ON gps_points (activity_id);

CREATE TABLE follows (
    id BIGSERIAL PRIMARY KEY,
    follower_id BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    followee_id BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL,
    UNIQUE (follower_id, followee_id)
);
