import firebase from 'firebase/app';
import { AuthService } from '../auth/auth.service';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserSettingsComponent } from '../user-settings/user-settings.component';
import { UserSettingsService } from '../user-settings/user-settings.service';

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
    private settingsService: UserSettingsService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.user$ = this.authService.user$;
  }

  login(): void {
    this.authService.login().subscribe((user) => {
      if (user == null) {
        return;
      }
      this.settingsService.init();
      this.settingsService.settings$.subscribe((settings) => {
        const url = `${settings.callsign}/qsos`;
        this.router.navigate([url]);
      });
    });
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
