import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SecretService {
  readonly updateSecretsUrl = environment.functionsBase + 'UpdateSecret';

  constructor(private authService: AuthService, private http: HttpClient) {}

  public setSecrets(
    secrets: Map<string, string>,
    logbookId: string
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
    return from(this.authService.user$.getValue().getIdToken(false)).pipe(
      mergeMap((jwt) => {
        return this.http.post(url, formData, {
          headers: { Authorization: 'Bearer ' + jwt },
        });
      })
    );
  }
}
