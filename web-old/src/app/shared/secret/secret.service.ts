import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { Observable, from, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SecretService {
  readonly updateSecretsUrl = environment.functionsBase + 'UpdateSecret';
  private auth: Auth = inject(Auth);

  constructor(
    private authService: AuthService,
    private http: HttpClient,
  ) {}

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
      user(this.auth).pipe(
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
