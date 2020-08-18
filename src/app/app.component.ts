import {AngularFireAuth} from "@angular/fire/auth";
import {Component} from '@angular/core';
import {auth} from 'firebase/app';

@Component({
  selector: 'kel-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public auth: AngularFireAuth) {
  }

  login() {
    this.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logout() {
    this.auth.signOut();
  }
}
