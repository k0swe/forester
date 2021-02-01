import { AuthService } from '../auth/auth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserSettingsService } from '../user-settings/user-settings.service';
import { Observable } from 'rxjs';
import firebase from 'firebase';
import { take, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'kel-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private settingsService: UserSettingsService,
    private router: Router,
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
    loginObs.pipe(take(1)).subscribe((user) => {
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
}
