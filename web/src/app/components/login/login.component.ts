import { Component, OnInit, inject } from '@angular/core';
import { Auth, UserCredential, user } from '@angular/fire/auth';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatButton],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private auth: Auth = inject(Auth);

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBarService: MatSnackBar,
  ) {}

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
                  undefined,
                  { duration: 10000 },
                );
              });
            break;
          default:
            console.warn('Problem logging in', err);
            this.snackBarService.open(
              'There was a problem logging in, see the JavaScript console for details.',
              undefined,
              { duration: 10000 },
            );
        }
      },
    });
  }

  private redirectAfterLogin(): void {
    this.route.queryParamMap.subscribe((map) => {
      const continueParam = map.get('continue');
      if (!!continueParam) {
        const continueUrl = new URL(continueParam, 'https://example.com');
        this.router.navigate([continueUrl.pathname], {
          queryParams: continueUrl.searchParams,
        });
      }
    });
  }
}
