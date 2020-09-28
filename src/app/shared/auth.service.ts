import UserCredential = firebase.auth.UserCredential;
import {AngularFireAuth} from '@angular/fire/auth';
import {Injectable} from '@angular/core';
import {auth, User} from 'firebase/app';
import {from, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public afa: AngularFireAuth) {
  }

  public login(): Observable<UserCredential> {
    return from(this.afa.signInWithPopup(new auth.GoogleAuthProvider()));
  }

  public logout(): Observable<void> {
    return from(this.afa.signOut());
  }

  public user(): Observable<User> {
    return this.afa.user;
  }
}
