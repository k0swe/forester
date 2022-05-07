import { Component, OnInit, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { SecretService } from '../secret/secret.service';
import { LogbookService } from '../../pages/logbook/logbook.service';
import { Station } from '../../qso';

@Component({
  selector: 'kel-logbook-settings',
  templateUrl: './logbook-settings.component.html',
  styleUrls: ['./logbook-settings.component.scss'],
})
export class LogbookSettingsComponent implements OnInit {
  logbookSettingsForm: FormGroup;
  @ViewChild('saveButton') saveButton: MatButton;
  qthProfile: Station = {};

  constructor(
    private dialog: MatDialogRef<any>,
    private fb: FormBuilder,
    private logbookService: LogbookService,
    private secretService: SecretService
  ) {
    this.logbookSettingsForm = fb.group({
      qrzLogbookApiKey: '',
      lotwUser: '',
      lotwPass: '',
    });
    this.logbookSettingsForm.valueChanges.subscribe(() =>
      this.enableSaveButton()
    );
  }

  enableSaveButton(): void {
    this.saveButton.disabled = false;
  }

  ngOnInit(): void {}

  save(): void {
    const formValue = this.logbookSettingsForm.value;
    const secretsObs = this.secretService.setSecrets(
      new Map([
        ['lotw_username', formValue.lotwUser],
        ['lotw_password', formValue.lotwPass],
        ['qrz_logbook_api_key', formValue.qrzLogbookApiKey],
      ]),
      this.logbookService.logbookId$.getValue()
    );
    this.dialog.close(forkJoin([secretsObs]));
  }
}
