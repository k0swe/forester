import {Component} from '@angular/core';
import {AuthService} from './shared/auth.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'kel-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  qrzImportUrl: string;
  qrzImportUrlBase = 'https://us-central1-k0swe-kellog.cloudfunctions.net/HelloHTTP';

  constructor(public authService: AuthService, private http: HttpClient) {
  }

  importFromQrz(): void {
    this.authService.user().subscribe(
      user => {
        if (user != null) {
          user.getIdToken(false).then(token => {
            this.qrzImportUrl = this.qrzImportUrlBase + '?token=' + token;
            console.log('QRZ import url is', this.qrzImportUrl);
            this.http.get(this.qrzImportUrl).subscribe(response => {
              console.log(response);
            });
          });
        }
      }
    );
  }
}
