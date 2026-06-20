import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Auth } from 'firebase/auth';
import { Observable, from, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { authUser } from '../firebase/auth-user';
import { FIREBASE_AUTH } from '../firebase/firebase-auth.token';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SecretService {
  private auth: Auth = inject(FIREBASE_AUTH);
  private authService = inject(AuthService);
  private http = inject(HttpClient);

  readonly updateSecretsUrl = environment.functionsBase + 'UpdateSecret';

  public setSecrets(
    secrets: Map<string, string>,
    logbookId: string,
  ): Observable<any> {
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
    const url = this.updateSecretsUrl + '?logbookId=' + logbookId;
    return from(
      authUser(this.auth).pipe(
        mergeMap((u) => u.getIdToken(false)),
        mergeMap((jwt) => {
          return this.http.post(url, formData, {
            headers: { Authorization: 'Bearer ' + jwt },
          });
        }),
      ),
    );
  }
}
