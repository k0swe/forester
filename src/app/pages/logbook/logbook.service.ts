import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../shared/auth/auth.service';
import { fromPromise } from 'rxjs/internal-compatibility';
import { mergeMap } from 'rxjs/operators';
import { UserSettingsService } from '../../shared/user-settings/user-settings.service';

@Injectable({
  providedIn: 'root',
})
export class LogbookService {
  logbookId$ = new BehaviorSubject<string>(null);

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private userSettingsService: UserSettingsService
  ) {}

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
    return fromPromise(
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
}
