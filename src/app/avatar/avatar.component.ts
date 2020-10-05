import {AuthService} from '../shared/auth.service';
import {Component} from '@angular/core';

@Component({
  selector: 'kel-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {

  constructor(public authService: AuthService) {
  }
}
