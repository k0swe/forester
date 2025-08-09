import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { LogbookService } from '../../services/logbook.service';
import { UserSettingsService } from '../../services/user-settings.service';
import { LoginComponent } from '../../shared/login/login.component';
import { NewLogbookDialogComponent } from '../../shared/new-logbook-dialog/new-logbook-dialog.component';

@Component({
  selector: 'kel-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    LoginComponent,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    RouterModule,
  ],
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
