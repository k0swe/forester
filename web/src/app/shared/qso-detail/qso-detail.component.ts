import { AsyncPipe, DatePipe, NgForOf } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
} from '@angular/material/card';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { HamlibService } from 'ngx-kel-agent';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Qso, Station } from '../../qso';
import { Band } from '../../reference/band';
import { DxccRef } from '../../reference/dxcc';
import { Modes } from '../../reference/mode';
import { LocationService } from '../location/location.service';
import { FirebaseQso, QsoService } from '../qso/qso.service';
import { StationDetailComponent } from '../station-detail/station-detail.component';

@Component({
  selector: 'kel-qso-detail',
  templateUrl: './qso-detail.component.html',
  styleUrls: ['./qso-detail.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    MatAutocomplete,
    MatAutocompleteTrigger,
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
    MatOption,
    MatSelect,
    NgForOf,
    ReactiveFormsModule,
    StationDetailComponent,
  ],
  providers: [DatePipe],
})
export class QsoDetailComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: FirebaseQso,
    private datePipe: DatePipe,
    private qsoService: QsoService,
    private locationService: LocationService,
    private hamlib: HamlibService,
    private dialog: MatDialogRef<any>,
  ) {
    this.firebaseId = data.id;
    const model: Qso = {
      ...this.template,
      ...data.qso,
    };
    this.contactedStation = data.qso.contactedStation;
    this.loggingStation = data.qso.loggingStation;
    this.formatDates(model);
    this.qsoDetailForm = fb.group({
      ...model,
      ...{ timeOn: [model.timeOn, Validators.required] },
    });
  }

  // empty values for each field in the form to prevent error "Cannot find control with name"
  private readonly template: Qso = {
    timeOn: new Date(),
    timeOff: new Date(),
    band: undefined,
    mode: undefined,
    freq: undefined,
    comment: undefined,
    notes: undefined,
    rstSent: undefined,
    rstReceived: undefined,
  };

  private readonly firebaseId;
  bands = Band.bands;
  qsoDetailForm: FormGroup;
  startDelete = false;
  modeNames = Modes.modeNames;
  filteredModes$: Observable<string[]>;
  contactedStation: Station;
  loggingStation: Station;

  @ViewChild('saveButton') saveButton: MatButton;

  private static parseDates(qso: Qso): void {
    // form uses strings; turn them back into dates
    qso.timeOn = new Date(qso.timeOn + 'Z');
    qso.timeOff = new Date(qso.timeOff + 'Z');
  }

  static saveMode(formValue): void {
    const realMode = Modes.findMode(formValue.mode);
    if (realMode) {
      // Prefer ADIF-specified modes, but fall back on user input for new modes
      formValue.mode = realMode.mode;
      formValue.submode = realMode.submode;
    }
  }

  static saveCountry(formValue): void {
    const country = formValue.contactedStation.country;
    const entity = DxccRef.getByName(country);
    if (entity != null) {
      formValue.contactedStation.dxcc = entity.id;
    }
  }

  ngOnInit(): void {
    this.setupModeAutocomplete();
    this.setupAutoBandFromFreq();
    this.setupAgentFreqMode();
    this.qsoDetailForm.valueChanges.subscribe(() => this.enableSaveButton());
  }

  enableSaveButton() {
    if (!this.saveButton) {
      return;
    }
    this.saveButton.disabled = !(
      this.qsoDetailForm.valid &&
      this.contactedStation != this.data.qso.contactedStation &&
      this.loggingStation != this.data.qso.loggingStation
    );
  }

  private setupModeAutocomplete(): void {
    const displayMode = this.data.qso.submode
      ? this.data.qso.submode
      : this.data.qso.mode;
    const modeField = this.qsoDetailForm.get('mode');
    modeField.setValue(displayMode);
    this.filteredModes$ = modeField.valueChanges.pipe(
      map((modeInput) => this.filterModes(modeInput)),
    );
  }

  private filterModes(modeInput: string): string[] {
    const filterValue = modeInput.toUpperCase();
    return this.modeNames.filter((option) =>
      option.toUpperCase().includes(filterValue),
    );
  }

  private setupAgentFreqMode(): void {
    const freqField = this.qsoDetailForm.get('freq');
    const modeField = this.qsoDetailForm.get('mode');
    if (freqField.value == null) {
      // only enable rig control updates if there's no existing freq
      this.hamlib.rigState$.subscribe((rig) => {
        if (rig == null) {
          return;
        }
        freqField.setValue(rig.frequency / 1000000);
        modeField.setValue(rig.mode);
        freqField.markAsDirty();
        modeField.markAsDirty();
      });
    }
  }

  private setupAutoBandFromFreq(): void {
    const freqField = this.qsoDetailForm.get('freq');
    const bandField = this.qsoDetailForm.get('band');
    freqField.valueChanges.subscribe((freqInput) => {
      const band = Band.freqToBand(freqInput);
      bandField.setValue(band);
    });
  }

  save(): void {
    const formValue = this.qsoDetailForm.value;
    formValue.contactedStation = this.contactedStation;
    formValue.loggingStation = this.loggingStation;
    QsoDetailComponent.parseDates(formValue);
    QsoDetailComponent.saveMode(formValue);
    QsoDetailComponent.saveCountry(formValue);
    const newQso: FirebaseQso = { id: this.firebaseId, qso: formValue as Qso };
    this.dialog.close(this.qsoService.addOrUpdate(newQso));
  }

  private formatDates(qso: Qso): void {
    // Qso uses date objects; format them
    const timeFormat = 'yyyy-MM-dd HH:mm:ss';
    // @ts-ignore
    qso.timeOn = this.datePipe.transform(qso.timeOn, timeFormat, 'UTC');
    // @ts-ignore
    qso.timeOff = this.datePipe.transform(qso.timeOff, timeFormat, 'UTC');
  }

  delete(): void {
    this.dialog.close(this.qsoService.delete(this.firebaseId));
  }
}
