import { Component, OnInit, inject } from '@angular/core';
import { Auth, UserCredential, user } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take, takeWhile } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { UserSettingsService } from '../../services/user-settings.service';

@Component({
  selector: 'kel-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [MatCardModule, MatButtonModule],
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBarService = inject(MatSnackBar);
  private userSettingsService = inject(UserSettingsService);

  private auth: Auth = inject(Auth);

  ngOnInit() {
    user(this.auth).subscribe((user) => {
      if (user != null) {
        this.redirectAfterLogin();
      }
    });
  }

  loginGoogle(): void {
    const loginObs = this.authService.loginGoogle();
    this.handleLogin(loginObs);
  }

  loginFacebook(): void {
    const loginObs = this.authService.loginFacebook();
    this.handleLogin(loginObs);
  }

  private handleLogin(loginObs: Observable<UserCredential>): void {
    loginObs.pipe(take(1)).subscribe({
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
                  { duration: 10000 },
                );
              });
            break;
          default:
            console.warn('Problem logging in', err);
            this.snackBarService.open(
              'There was a problem logging in, see the JavaScript console for details.',
              null,
              { duration: 10000 },
            );
        }
      },
    });
  }

  private redirectAfterLogin(): void {
    this.route.queryParamMap.subscribe((map) => {
      if (map.has('continue')) {
        const continueUrl = new URL(map.get('continue'), 'https://example.com');
        this.router.navigate([continueUrl.pathname], {
          queryParams: continueUrl.searchParams,
        });
      } else {
        this.redirectToLogbook();
      }
    });
  }

  private redirectToLogbook(): void {
    this.userSettingsService.settings$
      .pipe(takeWhile((settings) => settings.callsign == null, true))
      .subscribe((settings) => {
        if (settings.callsign != null) {
          const url = `/${settings.callsign}/qsos`;
          this.router.navigate([url]);
        }
      });
  }
}
