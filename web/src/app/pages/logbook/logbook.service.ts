import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../shared/auth/auth.service';
import { mergeMap, switchMap } from 'rxjs/operators';
import { UserSettingsService } from '../../shared/user-settings/user-settings.service';
import { Station } from '../../qso';

@Injectable({
  providedIn: 'root',
})
export class LogbookService {
  logbookId$ = new BehaviorSubject<string>(null);
  settings$ = new BehaviorSubject<LogbookSettings>({} as LogbookSettings);
  started = false;

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private userSettingsService: UserSettingsService
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
          return this.firestore
            .doc<LogbookSettings>('logbooks/' + logbookId)
            .valueChanges();
        })
      )
      .subscribe((settings) => {
        this.settings$.next(settings as LogbookSettings);
      });
  }

  public createLogbook(callsign: string): Observable<void> {
    const user = this.authService.user$.getValue();
    if (!user) {
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
      this.firestore.doc('logbooks/' + callsign).set({ editors: [user.uid] })
      // TODO: handle logbook already exists
    ).pipe(
      mergeMap(
        // add the logbook to the user's starred list
        () => this.userSettingsService.set({ starredLogbooks })
      )
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
        return this.firestore
          .doc<LogbookSettings>('logbooks/' + logbookId)
          .update(values);
      })
    );
  }
}

export interface LogbookSettings {
  lotwLastFetchedDate: Date;
  qrzLogbookApiKeyLastSet: Date;
  qthProfile: Station;
}
