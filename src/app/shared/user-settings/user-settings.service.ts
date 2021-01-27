import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsService {
  readonly updateSecretsUrl = environment.functionsBase + 'UpdateSecret';
  settings$ = new BehaviorSubject<UserSettings>({});
  started = false;
  private userJwt: string;

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private http: HttpClient
  ) {}

  public init(): void {
    if (this.started) {
      return;
    }
    this.started = true;
    const uid$ = this.authService.user().pipe(
      map((user) => {
        if (user == null) {
          return null;
        }
        user.getIdToken(false).then((token) => (this.userJwt = token));
        return user.uid;
      })
    );
    uid$
      .pipe(
        switchMap((userId) => {
          if (userId == null) {
            return of({});
          }
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
    const uid$ = this.authService.user$.pipe(
      map((user) => {
        if (user == null) {
          return null;
        }
        return user.uid;
      })
    );
    return uid$.pipe(
      switchMap((userId) => {
        if (userId == null) {
          return of(null);
        }
        return this.firestore
          .doc<UserSettings>('users/' + userId)
          .update(values);
      })
    );
  }

  setSecrets(secrets: Map<string, string>): Observable<any> {
    let dataToSend = false;
    const formData = new FormData();
    for (const entry of secrets) {
      if (entry[1]) {
        formData.append(entry[0], entry[1]);
        dataToSend = true;
      }
    }
    if (!dataToSend) {
      return of(null);
    }
    return this.http.post(this.updateSecretsUrl, formData, {
      headers: {
        Authorization: 'Bearer ' + this.userJwt,
      },
    });
  }
}

interface UserSettings {
  callsign?: string;
}
