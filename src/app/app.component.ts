import { AuthService } from './shared/auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ImportExportService } from './shared/import-export/import-export.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserSettingsService } from './shared/user-settings/user-settings.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'kel-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  qrzImportUrl = environment.functionsBase + 'ImportQrz';
  lotwImportUrl = environment.functionsBase + 'ImportLotw';
  logbookId$ = new BehaviorSubject<string>('N0CALL');
  userJwt$ = new BehaviorSubject<string>('N0CALL');
  @ViewChild('download') download: ElementRef<HTMLAnchorElement>;

  constructor(
    public authService: AuthService,
    private http: HttpClient,
    private importExportService: ImportExportService,
    private userSettingsService: UserSettingsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.authService.user().subscribe((user) => {
      if (user != null) {
        user.getIdToken(false).then((token) => this.userJwt$.next(token));
      }
    });
    this.userSettingsService.init();
    this.userSettingsService
      .settings()
      .subscribe((settings) => this.logbookId$.next(settings.callsign));
  }

  importFromQrz(): void {
    this.importWithCloudFunc('QRZ.com', this.qrzImportUrl);
  }

  importFromLotw(): void {
    this.importWithCloudFunc('LotW', this.lotwImportUrl);
  }

  private importWithCloudFunc(provider: string, importUrl: string): void {
    this.snackBar.open(`Importing from ${provider}...`, null);
    this.http
      .get<ImportResponse>(importUrl, {
        headers: { Authorization: 'Bearer ' + this.userJwt$.getValue() },
      })
      .subscribe(
        (response) => {
          const created = response.created;
          const modified = response.modified;
          const noDiff = response.noDiff;
          this.snackBar.open(
            `Finished ${provider} import: ` +
              `${created} QSOs created, ${modified} modified and ${noDiff} with no difference`,
            null,
            { duration: 5000 }
          );
        },
        (error) => {
          this.snackBar.open(`Error importing from ${provider}`, null, {
            duration: 5000,
          });
          console.warn(`Error importing from ${provider}:`, error);
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
      this.download.nativeElement.setAttribute('download', 'forester.adi');
      this.download.nativeElement.click();
    });
  }
}

interface ImportResponse {
  created: number;
  modified: number;
  noDiff: number;
}
