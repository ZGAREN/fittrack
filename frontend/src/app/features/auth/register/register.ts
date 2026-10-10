import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: '../auth.scss'
})
export class Register {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  displayName = '';
  readonly errorMessage = signal<string | null>(null);
  readonly loading = signal(false);

  submit(): void {
    this.errorMessage.set(null);
    this.loading.set(true);
    this.authService.register(this.email, this.password, this.displayName).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/record']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message ?? 'Inscription impossible');
      }
    });
  }
}
