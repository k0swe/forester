import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsService {
  settings$ = new BehaviorSubject<UserSettings>({});
  started = false;

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore
  ) {}

  public init(): void {
    if (this.started === true) {
      return;
    }
    this.started = true;
    this.authService.user$
      .pipe(
        switchMap((user) => {
          if (user == null) {
            return of({});
          }
          return this.firestore
            .doc<UserSettings>('users/' + user.uid)
            .valueChanges();
        })
      )
      .subscribe((settings) => this.settings$.next(settings));
  }

  public settings(): Observable<UserSettings> {
    return this.settings$;
  }

  set(values: UserSettings): Observable<void> {
    return this.authService.user$.pipe(
      switchMap((user) => {
        if (user == null) {
          return of(null);
        }
        return this.firestore
          .doc<UserSettings>('users/' + user.uid)
          .update(values);
      })
    );
  }
}

interface UserSettings {
  callsign?: string;
  starredLogbooks?: Array<string>;
}
