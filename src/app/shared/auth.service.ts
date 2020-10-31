import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import User = firebase.User;
import UserCredential = firebase.auth.UserCredential;
import firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(public afa: AngularFireAuth) {}

  public login(): Observable<UserCredential> {
    return from(this.afa.signInWithPopup(new GoogleAuthProvider()));
  }

  public logout(): Observable<void> {
    return from(this.afa.signOut());
  }

  public user(): Observable<User> {
    return this.afa.user;
  }
}
