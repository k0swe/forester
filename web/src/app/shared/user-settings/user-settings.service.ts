import { Injectable, inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import {
  Firestore,
  doc,
  docData,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable, from, mergeMap, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsService {
  private firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);
  settings$ = new BehaviorSubject<UserSettings>({});
  started = false;

  public init(): void {
    if (this.started === true) {
      return;
    }
    this.started = true;
    user(this.auth)
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
    user(this.auth)
      .pipe(
        mergeMap((u) => {
          return from(
            setDoc(doc(this.firestore, 'users', u.uid), <UserSettings>{
              starredLogbooks: [],
            }),
          );
        }),
      )
      .subscribe();
  }

  public settings(): Observable<UserSettings> {
    return this.settings$;
  }

  set(values: UserSettings): Observable<void> {
    return user(this.auth).pipe(
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
