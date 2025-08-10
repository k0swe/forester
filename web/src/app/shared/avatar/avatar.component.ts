import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth, User, user } from '@angular/fire/auth';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { UserSettingsComponent } from '../user-settings/user-settings.component';

@Component({
  selector: 'kel-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  imports: [
    AsyncPipe,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    RouterLink,
  ],
})
export class AvatarComponent {
  authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  private auth: Auth = inject(Auth);
  user$: Observable<User>;

  constructor() {
    this.user$ = user(this.auth);
  }

  logout(): void {
    this.authService
      .logout()
      .pipe(take(1))
      .subscribe(() => this.router.navigate(['/']));
  }

  userSettings(): void {
    const dialogRef = this.dialog.open(UserSettingsComponent, {
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((dialogReturn) => {
      if (dialogReturn instanceof Observable) {
        (dialogReturn as Observable<void>).subscribe(() =>
          this.snackBar.open('Saved user settings', null, { duration: 5000 }),
        );
      }
    });
  }
}
