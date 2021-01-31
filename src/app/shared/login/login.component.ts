import { AuthService } from '../auth/auth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserSettingsService } from '../user-settings/user-settings.service';

@Component({
  selector: 'kel-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private settingsService: UserSettingsService,
    private router: Router
  ) {}

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
}
