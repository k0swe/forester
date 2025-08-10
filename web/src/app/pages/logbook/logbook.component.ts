import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabLink, MatTabNav } from '@angular/material/tabs';
import {
  ActivatedRoute,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ImportExportService } from '../../services/import-export.service';
import { LogbookService } from '../../services/logbook.service';
import { LogbookSettingsComponent } from '../../shared/logbook-settings/logbook-settings.component';

@Component({
  selector: 'kel-logbook',
  templateUrl: './logbook.component.html',
  styleUrls: ['./logbook.component.scss'],
  imports: [
    AsyncPipe,
    MatDivider,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatTabLink,
    MatTabNav,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
})
export class LogbookComponent implements OnInit {
  auth = inject(Auth);
  private dialog = inject(MatDialog);
  private http = inject(HttpClient);
  private importExportService = inject(ImportExportService);
  private snackBar = inject(MatSnackBar);
  logbookService = inject(LogbookService);
  private route = inject(ActivatedRoute);

  links = [
    { name: 'QSO List', path: 'qsos' },
    { name: 'Map', path: 'map' },
    { name: 'Awards', path: 'was' },
  ];

  qrzImportUrl = environment.functionsBase + 'ImportQrz';
  lotwImportUrl = environment.functionsBase + 'ImportLotw';
  userJwt$ = new BehaviorSubject<string>('N0CALL');
  @ViewChild('download') download: ElementRef<HTMLAnchorElement>;

  ngOnInit(): void {
    this.route.params.subscribe((params) =>
      this.logbookService.logbookId$.next(params.callsign),
    );
    user(this.auth).subscribe((user) => {
      if (user != null) {
        user.getIdToken(false).then((token) => this.userJwt$.next(token));
      } else {
        this.userJwt$.next(null);
      }
    });
  }

  logbookSettings(): void {
    const dialogRef = this.dialog.open(LogbookSettingsComponent, {
      width: '800px',
    });
    dialogRef.afterClosed().subscribe((dialogReturn) => {
      if (dialogReturn instanceof Observable) {
        (dialogReturn as Observable<void>).subscribe(() =>
          this.snackBar.open('Saved logbook settings', null, {
            duration: 5000,
          }),
        );
      }
    });
  }

  importFromQrz(): void {
    const url =
      this.qrzImportUrl +
      '?logbookId=' +
      this.logbookService.logbookId$.getValue();
    this.importWithCloudFunc('QRZ.com', url.toString());
  }

  importFromLotw(): void {
    const url =
      this.lotwImportUrl +
      '?logbookId=' +
      this.logbookService.logbookId$.getValue();
    this.importWithCloudFunc('LotW', url);
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
            { duration: 5000 },
          );
        },
        (error) => {
          this.snackBar.open(`Error importing from ${provider}`, null, {
            duration: 5000,
          });
          console.warn(`Error importing from ${provider}:`, error);
        },
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
