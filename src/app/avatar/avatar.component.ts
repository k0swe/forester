import {Component} from '@angular/core';
import {AuthService} from "../shared/auth.service";

@Component({
  selector: 'kel-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent {

  constructor(public authService: AuthService) {
  }
}
