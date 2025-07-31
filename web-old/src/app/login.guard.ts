import { Injectable, inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard {
  private auth: Auth = inject(Auth);

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return user(this.auth).pipe(
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
