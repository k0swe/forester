import { Component, OnInit, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatLegacyButton as MatButton } from '@angular/material/legacy-button';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { SecretService } from '../secret/secret.service';
import {
  LogbookService,
  LogbookSettings,
} from '../../pages/logbook/logbook.service';
import { Station } from '../../qso';

@Component({
  selector: 'kel-logbook-settings',
  templateUrl: './logbook-settings.component.html',
  styleUrls: ['./logbook-settings.component.scss'],
})
export class LogbookSettingsComponent implements OnInit {
  logbookSettingsForm: FormGroup;
  @ViewChild('saveButton') saveButton: MatButton;
  qthProfile = {} as Station;

  constructor(
    private dialog: MatDialogRef<any>,
    private fb: FormBuilder,
    private logbookService: LogbookService,
    private secretService: SecretService
  ) {
    this.logbookSettingsForm = fb.group({
      lotwUser: '',
      lotwPass: '',
      qrzLogbookApiKey: '',
      qrzUser: '',
      qrzPass: '',
    });
    this.logbookSettingsForm.valueChanges.subscribe(() =>
      this.enableSaveButton()
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
      this.logbookService.logbookId$.getValue()
    );

    this.dialog.close(forkJoin([qthObs, secretsObs]));
  }
}
