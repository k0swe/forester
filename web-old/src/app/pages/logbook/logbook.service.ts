import { Injectable, inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import {
  DocumentReference,
  Firestore,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable, filter, from } from 'rxjs';
import { mergeMap, switchMap } from 'rxjs/operators';

import { Station } from '../../qso';
import { UserSettingsService } from '../../shared/user-settings/user-settings.service';

@Injectable({
  providedIn: 'root',
})
export class LogbookService {
  private firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);
  private userSettingsService: UserSettingsService =
    inject(UserSettingsService);
  logbookId$ = new BehaviorSubject<string>(null);
  settings$ = new BehaviorSubject<LogbookSettings>({} as LogbookSettings);
  started = false;

  public init(): void {
    if (this.started === true) {
      return;
    }
    this.started = true;
    this.logbookId$.subscribe((logbookId) => {
      if (!logbookId) {
        return;
      }
      const docRef = doc(
        this.firestore,
        'logbooks',
        logbookId,
      ) as DocumentReference<LogbookSettings>;
      onSnapshot(docRef, (doc) => {
        this.settings$.next(doc.data());
      });
    });
  }

  public createLogbook(callsign: string): Observable<void> {
    return user(this.auth).pipe(
      filter((v) => !!v),
      mergeMap((u) => {
        const userSettings = this.userSettingsService.settings$.getValue();
        let starredLogbooks = userSettings.starredLogbooks;
        if (!starredLogbooks) {
          starredLogbooks = [];
        }
        starredLogbooks.push(callsign);
        return from(
          // create the logbook
          setDoc(doc(this.firestore, 'logbooks' + callsign), {
            editors: [u.uid],
          }),
          // TODO: handle logbook already exists
        ).pipe(
          mergeMap(
            // add the logbook to the user's starred list
            () => this.userSettingsService.set({ starredLogbooks }),
          ),
        );
      }),
    );
  }

  public settings(): Observable<LogbookSettings> {
    return this.settings$;
  }

  set(values: LogbookSettings): Observable<void> {
    return this.logbookId$.pipe(
      filter((v) => !!v),
      switchMap((logbookId) => {
        return updateDoc(doc(this.firestore, 'logbooks', logbookId), {
          ...values,
        });
      }),
    );
  }
}

export interface LogbookSettings {
  lotwLastFetchedDate: Date;
  qrzLogbookApiKeyLastSet: Date;
  qthProfile: Station;
}
