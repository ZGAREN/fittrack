import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { FollowService } from '../../core/services/follow.service';
import { UserSummary } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  private readonly userService = inject(UserService);
  private readonly followService = inject(FollowService);

  readonly me = signal<UserSummary | null>(null);
  readonly following = signal<UserSummary[]>([]);
  readonly followers = signal<UserSummary[]>([]);
  readonly message = signal<string | null>(null);

  followUserId = '';

  ngOnInit(): void {
    this.userService.me().subscribe((user) => this.me.set(user));
    this.refreshLists();
  }

  refreshLists(): void {
    this.followService.following().subscribe((list) => this.following.set(list));
    this.followService.followers().subscribe((list) => this.followers.set(list));
  }

  follow(): void {
    const id = Number(this.followUserId);
    if (!id) return;
    this.message.set(null);
    this.followService.follow(id).subscribe({
      next: () => {
        this.followUserId = '';
        this.message.set('Utilisateur suivi !');
        this.refreshLists();
      },
      error: (err) => this.message.set(err.error?.message ?? 'Impossible de suivre cet utilisateur')
    });
  }

  unfollow(userId: number): void {
    this.followService.unfollow(userId).subscribe(() => this.refreshLists());
  }
}
