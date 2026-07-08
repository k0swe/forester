import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import {
  ActivatedRoute,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { Auth } from 'firebase/auth';
import { Observable, from } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { FIREBASE_AUTH } from '../../firebase/firebase-auth.token';
import { ImportExportService } from '../../services/import-export.service';
import { LogbookService } from '../../services/logbook.service';
import { LogbookSettingsComponent } from '../../shared/logbook-settings/logbook-settings.component';

@Component({
  selector: 'kel-logbook',
  templateUrl: './logbook.component.html',
  styleUrls: ['./logbook.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
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
    MatTabNavPanel,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
})
export class LogbookComponent implements OnInit {
  auth = inject(FIREBASE_AUTH);
  private dialog = inject(MatDialog);
  private http = inject(HttpClient);
  private importExportService = inject(ImportExportService);
  private snackBar = inject(MatSnackBar);
  logbookService = inject(LogbookService);
  private route = inject(ActivatedRoute);

  links = [
    { name: 'QSO List', path: 'qsos' },
    { name: 'Map', path: 'map' },
    { name: 'Awards', path: 'awards' },
  ];

  qrzImportUrl = environment.functionsBase + 'ImportQrz';
  lotwImportUrl = environment.functionsBase + 'ImportLotw';
  @ViewChild('download') download: ElementRef<HTMLAnchorElement>;

  /** Emits the active QTH profile name when there are multiple profiles; null otherwise. */
  activeQthProfileName$: Observable<string | null> =
    this.logbookService.settings$.pipe(
      map((settings) => {
        const profiles = settings?.qthProfiles;
        if (!profiles || profiles.length <= 1) {
          return null;
        }
        // Multiple profiles: show the active one, falling back to first (mirrors service logic)
        const active =
          profiles.find((p) => p.id === settings.activeQthProfileId) ??
          profiles[0];
        return active.name;
      }),
    );

  ngOnInit(): void {
    this.route.params.subscribe((params) =>
      this.logbookService.logbookId$.next(params.callsign),
    );
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
    if (!this.auth.currentUser) {
      this.snackBar.open(`Error importing from ${provider}: not signed in`, null, {
        duration: 5000,
      });
      return;
    }
    this.snackBar.open(`Importing from ${provider}...`, null);
    from(this.auth.currentUser.getIdToken(true))
      .pipe(
        mergeMap((token) =>
          this.http.get<ImportResponse>(importUrl, {
            headers: { Authorization: 'Bearer ' + token },
          }),
        ),
      )
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
