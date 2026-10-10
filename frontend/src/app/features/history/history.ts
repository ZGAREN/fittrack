import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivityService } from '../../core/services/activity.service';
import { Activity } from '../../core/models/activity.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './history.html',
  styleUrl: './history.scss'
})
export class History implements OnInit {
  private readonly activityService = inject(ActivityService);

  readonly activities = signal<Activity[]>([]);
  readonly loading = signal(true);

  readonly totalDistanceKm = signal(0);
  readonly totalDurationHours = signal(0);

  ngOnInit(): void {
    this.activityService.getMine().subscribe({
      next: (activities) => {
        this.activities.set(activities);
        this.loading.set(false);
        const totalMeters = activities.reduce((sum, a) => sum + a.distanceMeters, 0);
        const totalSeconds = activities.reduce((sum, a) => sum + a.durationSeconds, 0);
        this.totalDistanceKm.set(totalMeters / 1000);
        this.totalDurationHours.set(totalSeconds / 3600);
      },
      error: () => this.loading.set(false)
    });
  }

  typeLabel(type: string): string {
    const labels: Record<string, string> = {
      RUNNING: 'Course',
      CYCLING: 'Vélo',
      WALKING: 'Marche',
      HIKING: 'Randonnée',
      OTHER: 'Autre'
    };
    return labels[type] ?? type;
  }
}
