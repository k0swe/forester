import {AngularFireAuth} from "@angular/fire/auth";
import {Injectable} from '@angular/core';
import {auth} from "firebase";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth: AngularFireAuth) {
  }

  public login() {
    this.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  public logout() {
    this.auth.signOut();
  }

  public user() {
    return this.auth.user;
  }
}
