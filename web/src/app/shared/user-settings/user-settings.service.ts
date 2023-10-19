import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  doc,
  docData,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsService {
  private firestore: Firestore = inject(Firestore);
  settings$ = new BehaviorSubject<UserSettings>({});
  started = false;

  constructor(private authService: AuthService) {}

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
          return docData(doc(this.firestore, 'users', user.uid));
        }),
      )
      .subscribe((settings) => {
        if (settings) {
          this.settings$.next(settings);
        } else {
          this.createUserDocument();
        }
      });
  }

  private createUserDocument(): void {
    const u = this.authService.user$.getValue();
    setDoc(doc(this.firestore, 'users', u.uid), <UserSettings>{
      starredLogbooks: [],
    });
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
        return updateDoc(doc(this.firestore, 'users', user.uid), {
          ...values,
        });
      }),
    );
  }
}

interface UserSettings {
  callsign?: string;
  starredLogbooks?: Array<string>;
}
