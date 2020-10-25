import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';

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
    if (this.started) {
      return;
    }
    this.started = true;
    const uid$ = this.authService.user().pipe(map((user) => user.uid));
    uid$
      .pipe(
        switchMap((userId) => {
          return this.firestore
            .doc<UserSettings>('users/' + userId)
            .valueChanges();
        })
      )
      .subscribe((settings) => this.settings$.next(settings));
  }

  public settings(): Observable<UserSettings> {
    return this.settings$;
  }

  set(values: UserSettings): Observable<void> {
    const uid$ = this.authService.user().pipe(map((user) => user.uid));
    return uid$.pipe(
      switchMap((userId) => {
        return this.firestore
          .doc<UserSettings>('users/' + userId)
          .update(values);
      })
    );
  }
}

interface UserSettings {
  callsign?: string;
  qrzLogbookApiKey?: string;
}
