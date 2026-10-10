import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { ActivityService } from '../../core/services/activity.service';
import { GeoTrackerService } from '../../core/services/geo-tracker.service';
import { ActivityType } from '../../core/models/activity.model';

@Component({
  selector: 'app-record',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './record.html',
  styleUrl: './record.scss'
})
export class Record implements AfterViewInit, OnDestroy {
  private readonly activityService = inject(ActivityService);
  private readonly geoTracker = inject(GeoTrackerService);
  private readonly router = inject(Router);

  @ViewChild('mapContainer') mapContainerRef!: ElementRef<HTMLDivElement>;

  private map: L.Map | null = null;
  private polyline: L.Polyline | null = null;
  private refreshHandle: ReturnType<typeof setInterval> | null = null;
  private tickHandle: ReturnType<typeof setInterval> | null = null;

  title = 'Sortie';
  type: ActivityType = 'RUNNING';

  readonly recording = signal(false);
  readonly saving = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly elapsedSeconds = signal(0);
  readonly distanceMeters = signal(0);

  private startTime: string | null = null;
  private tickStart = 0;

  ngAfterViewInit(): void {
    this.map = L.map(this.mapContainerRef.nativeElement).setView([48.8566, 2.3522], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);
    this.polyline = L.polyline([], { color: '#ff5722', weight: 4 }).addTo(this.map);
  }

  async start(): Promise<void> {
    this.errorMessage.set(null);
    const granted = await this.geoTracker.requestPermission();
    if (!granted) {
      this.errorMessage.set('Autorisation de localisation refusée.');
      return;
    }

    this.startTime = new Date().toISOString();
    this.tickStart = Date.now();
    this.elapsedSeconds.set(0);
    this.distanceMeters.set(0);
    await this.geoTracker.start();
    this.recording.set(true);

    this.tickHandle = setInterval(() => {
      this.elapsedSeconds.set(Math.round((Date.now() - this.tickStart) / 1000));
    }, 1000);

    this.refreshHandle = setInterval(() => this.refreshMap(), 2000);
  }

  async stop(): Promise<void> {
    if (this.tickHandle) clearInterval(this.tickHandle);
    if (this.refreshHandle) clearInterval(this.refreshHandle);

    const result = await this.geoTracker.stop();
    this.recording.set(false);
    this.distanceMeters.set(result.distanceMeters);

    if (result.points.length < 2) {
      this.errorMessage.set("Trop peu de points GPS enregistrés pour sauvegarder l'activité.");
      return;
    }

    this.saving.set(true);
    this.activityService
      .create({
        type: this.type,
        title: this.title || 'Sortie',
        startTime: this.startTime ?? new Date().toISOString(),
        durationSeconds: result.durationSeconds,
        distanceMeters: result.distanceMeters,
        points: result.points
      })
      .subscribe({
        next: (activity) => {
          this.saving.set(false);
          this.router.navigate(['/activity', activity.id]);
        },
        error: (err) => {
          this.saving.set(false);
          this.errorMessage.set(err.error?.message ?? "Impossible d'enregistrer l'activité");
        }
      });
  }

  private refreshMap(): void {
    const points = this.geoTracker.getLivePoints();
    if (points.length === 0 || !this.map || !this.polyline) {
      return;
    }
    const latLngs = points.map((p) => [p.latitude, p.longitude] as [number, number]);
    this.polyline.setLatLngs(latLngs);
    this.map.panTo(latLngs[latLngs.length - 1]);

    let distance = 0;
    for (let i = 1; i < points.length; i++) {
      distance += this.distanceBetween(points[i - 1], points[i]);
    }
    this.distanceMeters.set(distance);
  }

  private distanceBetween(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }): number {
    const R = 6371000;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(b.latitude - a.latitude);
    const dLon = toRad(b.longitude - a.longitude);
    const lat1 = toRad(a.latitude);
    const lat2 = toRad(b.latitude);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  formatElapsed(): string {
    const total = this.elapsedSeconds();
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
  }

  formatDistance(): string {
    return (this.distanceMeters() / 1000).toFixed(2);
  }

  ngOnDestroy(): void {
    if (this.tickHandle) clearInterval(this.tickHandle);
    if (this.refreshHandle) clearInterval(this.refreshHandle);
    this.map?.remove();
  }
}
