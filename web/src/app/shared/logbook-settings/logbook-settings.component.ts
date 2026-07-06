import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
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
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { forkJoin } from 'rxjs';

import { Station } from '../../qso';
import {
  LogbookService,
  LogbookSettings,
  QthProfile,
} from '../../services/logbook.service';
import { SecretService } from '../../services/secret.service';
import { StationDetailComponent } from '../station-detail/station-detail.component';

@Component({
  selector: 'kel-logbook-settings',
  templateUrl: './logbook-settings.component.html',
  styleUrls: ['./logbook-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
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
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
    StationDetailComponent,
  ],
})
export class LogbookSettingsComponent implements OnInit {
  private dialog = inject<MatDialogRef<any>>(MatDialogRef);
  private fb = inject(FormBuilder);
  private logbookService = inject(LogbookService);
  private secretService = inject(SecretService);

  logbookSettingsForm: FormGroup;
  @ViewChild('saveButton') saveButton: MatButton;

  qthProfiles: QthProfile[] = [];
  activeQthProfileId: string | null = null;
  selectedProfileIndex = 0;

  private static readonly DEFAULT_PROFILE_ID = 'default';

  constructor() {
    this.logbookSettingsForm = this.fb.group({
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
    this.logbookService.settings$.subscribe((settings) => {
      this.qthProfiles = this.migrateProfiles(settings);
      // Prefer saved activeQthProfileId; fall back to first profile
      const savedActive = settings?.activeQthProfileId;
      if (savedActive && this.qthProfiles.some((p) => p.id === savedActive)) {
        this.activeQthProfileId = savedActive;
      } else if (this.qthProfiles.length > 0) {
        this.activeQthProfileId = this.qthProfiles[0].id;
      }
      this.selectedProfileIndex = Math.max(
        0,
        this.qthProfiles.findIndex((p) => p.id === this.activeQthProfileId),
      );
    });
  }

  get selectedProfile(): QthProfile | null {
    return this.qthProfiles[this.selectedProfileIndex] ?? null;
  }

  get selectedStation(): Station {
    return this.selectedProfile?.station ?? {};
  }

  set selectedStation(station: Station) {
    if (this.selectedProfile) {
      this.qthProfiles[this.selectedProfileIndex] = {
        ...this.selectedProfile,
        station,
      };
    }
  }

  get selectedProfileName(): string {
    return this.selectedProfile?.name ?? '';
  }

  set selectedProfileName(name: string) {
    if (this.selectedProfile) {
      this.qthProfiles[this.selectedProfileIndex] = {
        ...this.selectedProfile,
        name,
      };
    }
  }

  enableSaveButton(): void {
    if (!this.saveButton) {
      return;
    }
    this.saveButton.disabled = false;
  }

  onProfileSelectionChange(index: number): void {
    this.selectedProfileIndex = index;
  }

  setActiveProfile(): void {
    if (this.selectedProfile) {
      this.activeQthProfileId = this.selectedProfile.id;
      this.enableSaveButton();
    }
  }

  addProfile(): void {
    const newIndex = this.qthProfiles.length + 1;
    const newProfile: QthProfile = {
      id: this.generateId(),
      name: `New Profile ${newIndex}`,
      station: {},
    };
    this.qthProfiles = [...this.qthProfiles, newProfile];
    this.selectedProfileIndex = this.qthProfiles.length - 1;
    if (!this.activeQthProfileId) {
      this.activeQthProfileId = newProfile.id;
    }
    this.enableSaveButton();
  }

  deleteSelectedProfile(): void {
    if (this.qthProfiles.length <= 1) {
      return;
    }
    const deletedId = this.selectedProfile?.id;
    this.qthProfiles = this.qthProfiles.filter((p) => p.id !== deletedId);
    this.selectedProfileIndex = Math.min(
      this.selectedProfileIndex,
      this.qthProfiles.length - 1,
    );
    if (this.activeQthProfileId === deletedId) {
      this.activeQthProfileId = this.qthProfiles[0]?.id ?? null;
    }
    this.enableSaveButton();
  }

  save(): void {
    const qthObs = this.logbookService.set({
      qthProfiles: this.qthProfiles,
      activeQthProfileId: this.activeQthProfileId,
    });

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

  onProfileNameChange(event: Event): void {
    this.selectedProfileName = (event.target as HTMLInputElement).value;
    this.enableSaveButton();
  }

  private migrateProfiles(settings: LogbookSettings): QthProfile[] {
    if (settings?.qthProfiles?.length > 0) {
      return settings.qthProfiles;
    }
    // Migration: wrap legacy qthProfile
    if (settings?.qthProfile) {
      return [
        {
          id: LogbookSettingsComponent.DEFAULT_PROFILE_ID,
          name: 'Default',
          station: settings.qthProfile,
        },
      ];
    }
    return [
      {
        id: LogbookSettingsComponent.DEFAULT_PROFILE_ID,
        name: 'Default',
        station: {},
      },
    ];
  }

  private generateId(): string {
    return crypto.randomUUID();
  }
}
