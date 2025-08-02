import { Component, inject } from '@angular/core';
import { Auth, User, user } from '@angular/fire/auth';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AsyncPipe, NgOptimizedImage, UpperCasePipe } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-avatar',
  imports: [
    AsyncPipe,
    MatMenuModule,
    MatIconModule,
    RouterLink,
    MatIconButton,
    NgOptimizedImage,
    UpperCasePipe,
  ],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
  private auth: Auth = inject(Auth);
  user$: Observable<User | null>;

  constructor(
    public authService: AuthService,
    private router: Router,
  ) {
    this.user$ = user(this.auth);
  }

  logout(): void {
    this.authService
      .logout()
      .pipe(take(1))
      .subscribe(() => this.router.navigate(['/']));
  }

  userSettings(): void {
    // TODO: Implement user settings dialog
  }
}
