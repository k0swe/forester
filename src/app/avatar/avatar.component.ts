import {AuthService} from '../shared/auth.service';
import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {UserSettingsComponent} from '../user-settings/user-settings.component';

@Component({
  selector: 'kel-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {

  constructor(public authService: AuthService, private dialog: MatDialog) {
  }

  settings(): void {
    this.dialog.open(UserSettingsComponent, {
      width: '500px',
    });
  }
}
