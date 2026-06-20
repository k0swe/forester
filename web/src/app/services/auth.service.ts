import { Injectable, inject } from '@angular/core';
import {
  Auth,
  FacebookAuthProvider,
  GoogleAuthProvider,
  UserCredential,
  fetchSignInMethodsForEmail,
  signInWithPopup,
} from 'firebase/auth';
import { Observable, from } from 'rxjs';

import { FIREBASE_AUTH } from '../firebase/firebase-auth.token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(FIREBASE_AUTH);

  public loginGoogle(): Observable<UserCredential> {
    return from(signInWithPopup(this.auth, new GoogleAuthProvider()));
  }

  public loginFacebook(): Observable<UserCredential> {
    return from(signInWithPopup(this.auth, new FacebookAuthProvider()));
  }

  public logout(): Observable<void> {
    return from(this.auth.signOut());
  }

  public getLoginProvidersFor(email: string): Observable<Array<string>> {
    return from(fetchSignInMethodsForEmail(this.auth, email));
  }
}
