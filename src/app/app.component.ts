import { AuthService } from './shared/auth.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../environments/environment';

@Component({
  selector: 'kel-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  qrzImportUrl = environment.functionsBase + 'ImportQrz';
  userJwt: string;

  constructor(
    public authService: AuthService,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.authService.user().subscribe((user) => {
      if (user != null) {
        user.getIdToken(false).then((token) => (this.userJwt = token));
      }
    });
  }

  importFromQrz(): void {
    this.snackBar.open('Importing from QRZ.com...', null, { duration: 5000 });
    this.http
      .get<ImportResponse>(this.qrzImportUrl, {
        headers: { Authorization: 'Bearer ' + this.userJwt },
      })
      .subscribe(
        (response) => {
          const created: number = response.created;
          this.snackBar.open(
            `Imported from QRZ.com: ${created} QSOs created`,
            null,
            { duration: 5000 }
          );
        },
        (error) => {
          this.snackBar.open('Error importing from QRZ.com', null, {
            duration: 5000,
          });
          console.warn('Error importing from QRZ.com:', error);
        }
      );
  }
}

interface ImportResponse {
  created: number;
  modified: number;
}
