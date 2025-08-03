import { Injectable, inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import {
  DocumentReference,
  DocumentSnapshot,
  Firestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable, filter, from, mergeMap, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsService {
  private firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);
  private _settings$ = new BehaviorSubject<UserSettings>({});
  private started = false;

  public readonly settings$ = this._settings$.asObservable();

  public init(): void {
    if (this.started) {
      return;
    }
    this.started = true;
    user(this.auth)
      .pipe(
        filter((v) => !!v),
        switchMap((user) => {
          const docRef = doc(
            this.firestore,
            'users',
            user.uid,
          ) as DocumentReference<UserSettings>;
          return fromPromise(getDoc(docRef));
        }),
      )
      .subscribe((settingsSnap: DocumentSnapshot<UserSettings>) => {
        if (settingsSnap.exists()) {
          this._settings$.next(settingsSnap.data());
        } else {
          this.createUserDocument();
        }
      });
  }

  private createUserDocument(): void {
    user(this.auth)
      .pipe(
        mergeMap((u) => {
          if (!u) {
            return of();
          }
          return from(
            setDoc(doc(this.firestore, 'users', u.uid), <UserSettings>{
              starredLogbooks: [],
            }),
          );
        }),
      )
      .subscribe();
  }

  set(values: UserSettings): Observable<void> {
    return user(this.auth).pipe(
      switchMap((user) => {
        if (user == null) {
          return of();
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
