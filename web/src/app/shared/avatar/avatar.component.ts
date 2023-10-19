import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { UserSettingsComponent } from '../user-settings/user-settings.component';

@Component({
  selector: 'kel-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent {
  user$: Observable<firebase.User>;

  constructor(
    public authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.user$ = this.authService.user$;
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
