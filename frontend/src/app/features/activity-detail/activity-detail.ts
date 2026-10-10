import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as L from 'leaflet';
import { ActivityService } from '../../core/services/activity.service';
import { Activity } from '../../core/models/activity.model';

@Component({
  selector: 'app-activity-detail',
  standalone: true,
  imports: [],
  templateUrl: './activity-detail.html',
  styleUrl: './activity-detail.scss'
})
export class ActivityDetail implements AfterViewInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly activityService = inject(ActivityService);

  @ViewChild('mapContainer') mapContainerRef!: ElementRef<HTMLDivElement>;

  private map: L.Map | null = null;

  readonly activity = signal<Activity | null>(null);
  readonly loading = signal(true);

  ngAfterViewInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.activityService.getById(id).subscribe({
      next: (activity) => {
        this.activity.set(activity);
        this.loading.set(false);
        this.renderMap(activity);
      },
      error: () => this.loading.set(false)
    });
  }

  private renderMap(activity: Activity): void {
    const points = activity.points ?? [];
    const center: [number, number] = points.length
      ? [points[0].latitude, points[0].longitude]
      : [48.8566, 2.3522];

    this.map = L.map(this.mapContainerRef.nativeElement).setView(center, 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    if (points.length > 1) {
      const latLngs = points.map((p) => [p.latitude, p.longitude] as [number, number]);
      const polyline = L.polyline(latLngs, { color: '#ff5722', weight: 4 }).addTo(this.map);
      this.map.fitBounds(polyline.getBounds(), { padding: [20, 20] });
    }
  }

  delete(): void {
    const activity = this.activity();
    if (!activity) return;
    if (!confirm('Supprimer cette activité ?')) return;
    this.activityService.delete(activity.id).subscribe(() => this.router.navigate(['/history']));
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }
}
