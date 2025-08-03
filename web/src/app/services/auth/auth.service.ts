import { Injectable, inject } from '@angular/core';
import {
  Auth,
  FacebookAuthProvider,
  GoogleAuthProvider,
  UserCredential,
  fetchSignInMethodsForEmail,
  signInWithPopup,
} from '@angular/fire/auth';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);

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
