import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { GpsPoint } from '../models/activity.model';

@Injectable({ providedIn: 'root' })
export class GeoTrackerService {
  private watchId: string | null = null;
  private points: GpsPoint[] = [];
  private startedAt: number | null = null;

  async requestPermission(): Promise<boolean> {
    const status = await Geolocation.checkPermissions();
    if (status.location === 'granted') {
      return true;
    }
    const requested = await Geolocation.requestPermissions();
    return requested.location === 'granted';
  }

  async start(): Promise<void> {
    this.points = [];
    this.startedAt = Date.now();

    this.watchId = await Geolocation.watchPosition(
      { enableHighAccuracy: true, timeout: 10000 },
      (position, err) => {
        if (err || !position) {
          return;
        }
        this.points.push({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          elevation: position.coords.altitude ?? null,
          recordedAt: new Date(position.timestamp).toISOString(),
          sequence: this.points.length
        });
      }
    );
  }

  async stop(): Promise<{ points: GpsPoint[]; durationSeconds: number; distanceMeters: number }> {
    if (this.watchId) {
      await Geolocation.clearWatch({ id: this.watchId });
      this.watchId = null;
    }
    const durationSeconds = this.startedAt ? Math.round((Date.now() - this.startedAt) / 1000) : 0;
    const distanceMeters = this.computeDistance(this.points);
    const points = this.points;
    this.points = [];
    this.startedAt = null;
    return { points, durationSeconds, distanceMeters };
  }

  getLivePoints(): GpsPoint[] {
    return this.points;
  }

  private computeDistance(points: GpsPoint[]): number {
    let total = 0;
    for (let i = 1; i < points.length; i++) {
      total += this.haversine(points[i - 1], points[i]);
    }
    return total;
  }

  private haversine(a: GpsPoint, b: GpsPoint): number {
    const R = 6371000;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(b.latitude - a.latitude);
    const dLon = toRad(b.longitude - a.longitude);
    const lat1 = toRad(a.latitude);
    const lat2 = toRad(b.latitude);
    const sinDLat = Math.sin(dLat / 2);
    const sinDLon = Math.sin(dLon / 2);
    const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
    return 2 * R * Math.asin(Math.sqrt(h));
  }
}
