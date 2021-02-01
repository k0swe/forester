import firebase from 'firebase/app';
import { AuthService } from '../auth/auth.service';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserSettingsComponent } from '../user-settings/user-settings.component';
import { UserSettingsService } from '../user-settings/user-settings.service';
import { take, takeWhile } from 'rxjs/operators';

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
    private userSettingsService: UserSettingsService
  ) {
    this.user$ = this.authService.user$;
  }

  login(): void {
    this.authService
      .login()
      .pipe(take(1))
      .subscribe((user) => {
        if (user == null) {
          return;
        }
        this.userSettingsService.init();
        this.userSettingsService.settings$
          .pipe(takeWhile((settings) => settings.callsign == null, true))
          .subscribe((settings) => {
            if (settings.callsign != null) {
              const url = `/${settings.callsign}/qsos`;
              this.router.navigate([url]);
            }
          });
      });
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
          this.snackBar.open('Saved user settings', null, { duration: 5000 })
        );
      }
    });
  }
}
