import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { BehaviorSubject, Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$ = new BehaviorSubject<firebase.User | null>(null);

  constructor(public afa: AngularFireAuth) {
    this.afa.user.subscribe((u) => {
      this.user$.next(u);
    });
  }

  public loginGoogle(): Observable<firebase.auth.UserCredential> {
    return from(
      this.afa.signInWithPopup(new firebase.auth.GoogleAuthProvider()),
    );
  }

  public loginFacebook(): Observable<firebase.auth.UserCredential> {
    return from(
      this.afa.signInWithPopup(new firebase.auth.FacebookAuthProvider()),
    );
  }

  public logout(): Observable<void> {
    return from(this.afa.signOut());
  }

  public getLoginProvidersFor(email: string): Observable<Array<string>> {
    return from(this.afa.fetchSignInMethodsForEmail(email));
  }
}
