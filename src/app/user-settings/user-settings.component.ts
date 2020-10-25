import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserSettingsService } from '../shared/user-settings.service';
import { AgentService } from '../shared/agent.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { take } from 'rxjs/operators';

@Component({
  selector: 'kel-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
})
export class UserSettingsComponent implements OnInit {
  userSettingsForm: FormGroup;
  @ViewChild('saveButton') saveButton: MatButton;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public agentService: AgentService,
    private dialog: MatDialogRef<any>,
    private fb: FormBuilder,
    public settingsService: UserSettingsService
  ) {
    this.userSettingsForm = fb.group({
      callsign: '',
      qrzLogbookApiKey: '',
      agentHost: agentService.getHost(),
      agentPort: agentService.getPort(),
    });
    settingsService.settings().subscribe((settings) => {
      this.userSettingsForm.get('callsign').setValue(settings.callsign);
      this.userSettingsForm
        .get('qrzLogbookApiKey')
        .setValue(settings.qrzLogbookApiKey);
    });
    this.userSettingsForm.valueChanges.subscribe(
      () => (this.saveButton.disabled = false)
    );
  }

  ngOnInit(): void {
    this.settingsService.init();
  }

  save(): void {
    const formValue = this.userSettingsForm.value;
    this.agentService.setHost(formValue.agentHost);
    this.agentService.setPort(formValue.agentPort);
    const updateObs = this.settingsService
      .set({
        callsign: formValue.callsign,
        qrzLogbookApiKey: formValue.qrzLogbookApiKey,
      })
      .pipe(take(1));
    this.dialog.close(updateObs);
  }
}
