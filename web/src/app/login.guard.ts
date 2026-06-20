import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Auth } from 'firebase/auth';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { authUser } from './firebase/auth-user';
import { FIREBASE_AUTH } from './firebase/firebase-auth.token';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard {
  private auth: Auth = inject(FIREBASE_AUTH);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return authUser(this.auth).pipe(
      switchMap((u) => {
        if (u != null) {
          return of(true);
        }
        return of(
          this.router.createUrlTree(['/login'], {
            queryParams: { continue: state.url },
          }),
        );
      }),
    );
  }
}
