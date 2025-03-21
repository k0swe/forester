import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { AgentService } from 'ngx-kel-agent';
import { forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';

import { UserSettingsService } from './user-settings.service';

@Component({
  selector: 'kel-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
  standalone: false,
})
export class UserSettingsComponent implements OnInit {
  userSettingsForm: FormGroup;
  @ViewChild('saveButton') saveButton: MatButton;

  constructor(
    public agentService: AgentService,
    private dialog: MatDialogRef<any>,
    private fb: FormBuilder,
    public settingsService: UserSettingsService,
  ) {
    this.userSettingsForm = fb.group({
      callsign: '',
      qrzLogbookApiKey: '',
      agentHost: agentService.getHost(),
      agentPort: agentService.getPort(),
      lotwUser: '',
      lotwPass: '',
    });
    settingsService.settings().subscribe((settings) => {
      this.userSettingsForm.get('callsign').setValue(settings.callsign);
    });
    this.userSettingsForm.valueChanges.subscribe(
      () => (this.saveButton.disabled = false),
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
      })
      .pipe(take(1));
    this.dialog.close(forkJoin([updateObs]));
  }
}
