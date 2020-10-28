import { AuthService } from './shared/auth.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ImportExportService } from './shared/import-export.service';
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
  @ViewChild('download') download: ElementRef<HTMLAnchorElement>;

  constructor(
    public authService: AuthService,
    private http: HttpClient,
    private importExportService: ImportExportService,
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
          const created = response.created;
          const modified = response.modified;
          const noDiff = response.noDiff;
          this.snackBar.open(
            `Finished QRZ.com import: ` +
              `${created} QSOs created, ${modified} modified and ${noDiff} with no difference`,
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

  importAdi($event: any): void {
    const file = $event.target.files[0] as File;
    this.importExportService.importAdi(file);
  }

  exportAdi(): void {
    this.importExportService.exportAdi().subscribe((blob) => {
      const objectURL = (window.URL || window.webkitURL).createObjectURL(blob);
      this.download.nativeElement.setAttribute('href', objectURL);
      this.download.nativeElement.setAttribute('download', 'kellog.adif');
      this.download.nativeElement.click();
    });
  }
}

interface ImportResponse {
  created: number;
  modified: number;
  noDiff: number;
}
