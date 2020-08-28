import {Component, OnInit} from '@angular/core';
import {AuthService} from './shared/auth.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'kel-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  qrzImportUrl: string;
  qrzImportUrlBase = 'https://us-central1-k0swe-kellog.cloudfunctions.net/HelloHTTP';

  constructor(public authService: AuthService, private http: HttpClient) {
  }

  ngOnInit(): void {
    this.authService.user().subscribe(
      user => {
        if (user != null) {
          user.getIdToken(false).then(token =>
            this.qrzImportUrl = this.qrzImportUrlBase + '?token=' + token
          );
        }
      }
    );
  }

  importFromQrz(): void {
    this.http.get(this.qrzImportUrl).subscribe(response => {
      console.log(response);
    });
  }
}
