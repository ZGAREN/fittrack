import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivityService } from '../../core/services/activity.service';
import { Activity } from '../../core/models/activity.model';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './feed.html',
  styleUrl: './feed.scss'
})
export class Feed implements OnInit {
  private readonly activityService = inject(ActivityService);

  readonly activities = signal<Activity[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.activityService.getFeed().subscribe({
      next: (activities) => {
        this.activities.set(activities);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
