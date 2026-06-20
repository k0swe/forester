import { Injectable, inject } from '@angular/core';
import { Auth } from 'firebase/auth';
import {
  DocumentReference,
  DocumentSnapshot,
  Firestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { BehaviorSubject, Observable, filter, from, mergeMap, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { switchMap } from 'rxjs/operators';

import { authUser } from '../firebase/auth-user';
import { FIREBASE_AUTH } from '../firebase/firebase-auth.token';
import { FIREBASE_FIRESTORE } from '../firebase/firebase-firestore.token';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsService {
  private firestore: Firestore = inject(FIREBASE_FIRESTORE);
  private auth: Auth = inject(FIREBASE_AUTH);
  settings$ = new BehaviorSubject<UserSettings>({});

  constructor() {
    authUser(this.auth)
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
          this.settings$.next(settingsSnap.data());
        } else {
          this.createUserDocument();
        }
      });
  }

  private createUserDocument(): void {
    authUser(this.auth)
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
    return authUser(this.auth).pipe(
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
