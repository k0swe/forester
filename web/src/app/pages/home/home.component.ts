import { Component, inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { AuthService } from '../../shared/auth/auth.service';
import { NewLogbookDialogComponent } from '../../shared/new-logbook-dialog/new-logbook-dialog.component';
import { UserSettingsService } from '../../shared/user-settings/user-settings.service';
import { LogbookService } from '../logbook/logbook.service';

@Component({
  selector: 'kel-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  auth = inject(Auth);

  constructor(
    public authService: AuthService,
    public dialog: MatDialog,
    private logbookService: LogbookService,
    private router: Router,
    public userSettingsService: UserSettingsService,
  ) {}

  createLogbook(): void {
    const dialogRef = this.dialog.open(NewLogbookDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      this.logbookService.createLogbook(result).subscribe(() => {
        this.router.navigate([result, 'qsos']);
      });
    });
  }

  protected readonly user = user;
}
