import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from './shared/auth/auth.service';
import { Injectable } from '@angular/core';
import { interval, Observable, of } from 'rxjs';
import { mapTo, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
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
        // Wait 500ms for auth to init, and redirect to login after that
        return interval(500).pipe(mapTo(this.router.createUrlTree(['/login'])));
      })
    );
  }
}
