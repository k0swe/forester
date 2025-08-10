import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { AgentService } from 'ngx-kel-agent';
import { forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';

import { UserSettingsService } from '../../services/user-settings.service';

@Component({
  selector: 'kel-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatIcon,
    MatDialogActions,
    MatButton,
    MatDialogClose,
  ],
})
export class UserSettingsComponent implements OnInit {
  agentService = inject(AgentService);
  private dialog = inject<MatDialogRef<any>>(MatDialogRef);
  private fb = inject(FormBuilder);
  settingsService = inject(UserSettingsService);

  userSettingsForm: FormGroup;
  @ViewChild('saveButton') saveButton: MatButton;

  constructor() {
    this.userSettingsForm = this.fb.group({
      callsign: '',
      qrzLogbookApiKey: '',
      agentHost: this.agentService.getHost(),
      agentPort: this.agentService.getPort(),
      lotwUser: '',
      lotwPass: '',
    });
    this.settingsService.settings().subscribe((settings) => {
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
