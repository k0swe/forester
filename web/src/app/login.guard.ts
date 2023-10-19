import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AuthService } from './shared/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.user$.pipe(
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
