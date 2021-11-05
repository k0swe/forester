import { AuthService } from '../auth/auth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserSettingsService } from '../user-settings/user-settings.service';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat';
import { take, takeWhile } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'kel-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBarService: MatSnackBar,
    private userSettingsService: UserSettingsService
  ) {}

  loginGoogle(): void {
    const loginObs = this.authService.loginGoogle();
    this.postLogin(loginObs);
  }

  loginFacebook(): void {
    const loginObs = this.authService.loginFacebook();
    this.postLogin(loginObs);
  }

  private postLogin(loginObs: Observable<firebase.auth.UserCredential>): void {
    loginObs.pipe(take(1)).subscribe({
      next: (user) => {
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
      },
      error: (err) => {
        switch (err.code) {
          case 'auth/popup-closed-by-user':
          case 'auth/cancelled-popup-request':
            break;
          case 'auth/account-exists-with-different-credential':
            this.authService
              .getLoginProvidersFor(err.email)
              .subscribe((providers) => {
                this.snackBarService.open(
                  'The Forester account for ' +
                    err.email +
                    ' is associated with a different login provider. Please log in with ' +
                    providers[0] +
                    '.',
                  null,
                  { duration: 10000 }
                );
              });
            break;
          default:
            console.warn('Problem logging in', err);
            this.snackBarService.open(
              'There was a problem logging in, see the JavaScript console for details.',
              null,
              { duration: 10000 }
            );
        }
      },
    });
  }
}
