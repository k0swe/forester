import { inject, Injectable } from '@angular/core';
import {
  Auth,
  FacebookAuthProvider,
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
} from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

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
