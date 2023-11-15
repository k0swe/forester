import { Injectable, inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import {
  Firestore,
  doc,
  docData,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { mergeMap, switchMap } from 'rxjs/operators';

import { Station } from '../../qso';
import { UserSettingsService } from '../../shared/user-settings/user-settings.service';

@Injectable({
  providedIn: 'root',
})
export class LogbookService {
  private firestore: Firestore = inject(Firestore);
  logbookId$ = new BehaviorSubject<string>(null);
  settings$ = new BehaviorSubject<LogbookSettings>({} as LogbookSettings);
  started = false;

  constructor(
    private auth: Auth,
    private userSettingsService: UserSettingsService,
  ) {}

  public init(): void {
    if (this.started === true) {
      return;
    }
    this.started = true;
    this.logbookId$
      .pipe(
        switchMap((logbookId) => {
          if (logbookId == null) {
            return of({});
          }
          return docData(doc(this.firestore, 'logbooks', logbookId));
        }),
      )
      .subscribe((settings) => {
        this.settings$.next(settings as LogbookSettings);
      });
  }

  public createLogbook(callsign: string): Observable<void> {
    return user(this.auth).pipe(
      mergeMap((u) => {
        if (!u) {
          return;
        }
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
      switchMap((logbookId) => {
        if (logbookId == null) {
          return of(null);
        }
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
