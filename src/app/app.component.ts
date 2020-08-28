import {Component, OnInit} from '@angular/core';
import {AuthService} from './shared/auth.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';

@Component({
  selector: 'kel-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  qrzImportUrl = environment.functionsBase + 'HelloHTTP';
  userToken: string;

  constructor(public authService: AuthService, private http: HttpClient) {
  }

  ngOnInit(): void {
    this.authService.user().subscribe(
      user => {
        if (user != null) {
          user.getIdToken(false).then(token =>
            this.userToken = token
          );
        }
      }
    );
  }

  importFromQrz(): void {
    this.http.get(this.qrzImportUrl, {headers: {Authorization: this.userToken}})
      .subscribe(response => {
        console.log(response);
      });
  }
}
