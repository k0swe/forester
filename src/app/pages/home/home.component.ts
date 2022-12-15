import { AuthService } from '../../shared/auth/auth.service';
import { Component } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { NewLogbookDialogComponent } from '../../shared/new-logbook-dialog/new-logbook-dialog.component';
import { UserSettingsService } from '../../shared/user-settings/user-settings.service';
import { LogbookService } from '../logbook/logbook.service';
import { Router } from '@angular/router';

@Component({
  selector: 'kel-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(
    public authService: AuthService,
    public dialog: MatDialog,
    private logbookService: LogbookService,
    private router: Router,
    public userSettingsService: UserSettingsService
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
}
