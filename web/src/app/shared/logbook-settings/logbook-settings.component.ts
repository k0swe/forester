import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
} from '@angular/material/card';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { forkJoin } from 'rxjs';

import { Station } from '../../qso';
import {
  LogbookService,
  LogbookSettings,
} from '../../services/logbook.service';
import { SecretService } from '../../services/secret.service';
import { StationDetailComponent } from '../station-detail/station-detail.component';

@Component({
  selector: 'kel-logbook-settings',
  templateUrl: './logbook-settings.component.html',
  styleUrls: ['./logbook-settings.component.scss'],
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatHint,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    StationDetailComponent,
  ],
})
export class LogbookSettingsComponent implements OnInit {
  logbookSettingsForm: FormGroup;
  @ViewChild('saveButton') saveButton: MatButton;
  qthProfile = {} as Station;

  constructor(
    private dialog: MatDialogRef<any>,
    private fb: FormBuilder,
    private logbookService: LogbookService,
    private secretService: SecretService,
  ) {
    this.logbookSettingsForm = fb.group({
      lotwUser: '',
      lotwPass: '',
      qrzLogbookApiKey: '',
      qrzUser: '',
      qrzPass: '',
    });
    this.logbookSettingsForm.valueChanges.subscribe(() =>
      this.enableSaveButton(),
    );
  }

  ngOnInit(): void {
    this.logbookService.init();
    this.logbookService.settings$.subscribe((settings) => {
      this.qthProfile = settings.qthProfile;
    });
  }

  enableSaveButton(): void {
    if (!this.saveButton) {
      return;
    }
    this.saveButton.disabled = false;
  }

  save(): void {
    const qthObs = this.logbookService.set({
      qthProfile: this.qthProfile,
    } as LogbookSettings);

    const formValue = this.logbookSettingsForm.value;
    const secretsObs = this.secretService.setSecrets(
      new Map([
        ['lotw_username', formValue.lotwUser],
        ['lotw_password', formValue.lotwPass],
        ['qrz_logbook_api_key', formValue.qrzLogbookApiKey],
        ['qrz_username', formValue.qrzUser],
        ['qrz_password', formValue.qrzPass],
      ]),
      this.logbookService.logbookId$.getValue(),
    );

    this.dialog.close(forkJoin([qthObs, secretsObs]));
  }
}
