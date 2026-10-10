export type ActivityType = 'RUNNING' | 'CYCLING' | 'WALKING' | 'HIKING' | 'OTHER';

export interface GpsPoint {
  latitude: number;
  longitude: number;
  elevation?: number | null;
  recordedAt: string;
  sequence: number;
}

export interface Activity {
  id: number;
  type: ActivityType;
  title: string;
  startTime: string;
  durationSeconds: number;
  distanceMeters: number;
  averageSpeedKmh: number;
  ownerId: number;
  ownerDisplayName: string;
  points: GpsPoint[] | null;
}

export interface ActivityCreateRequest {
  type: ActivityType;
  title: string;
  startTime: string;
  durationSeconds: number;
  distanceMeters: number;
  points: GpsPoint[];
}
