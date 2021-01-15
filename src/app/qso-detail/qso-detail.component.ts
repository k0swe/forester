import { Band } from '../reference/band';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FirebaseQso, QsoService } from '../shared/qso.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { Modes } from '../reference/mode';
import { Qso } from '../qso';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const googleMapsSearchBase = 'https://www.google.com/maps/search/';

@Component({
  selector: 'kel-qso-detail',
  templateUrl: './qso-detail.component.html',
  styleUrls: ['./qso-detail.component.scss'],
  providers: [DatePipe],
})
export class QsoDetailComponent implements OnInit {
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
    contactedStation: {
      stationCall: undefined,
      opName: undefined,
      latitude: undefined,
      longitude: undefined,
      city: undefined,
      state: undefined,
      country: undefined,
      continent: undefined,
      gridSquare: undefined,
    },
    loggingStation: {
      power: undefined,
    },
  };

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: FirebaseQso,
    private datePipe: DatePipe,
    private qsoService: QsoService,
    private dialog: MatDialogRef<any>
  ) {
    this.firebaseId = data.id;
    const model = {
      ...this.template,
      ...data.qso,
      contactedStation: {
        ...this.template.contactedStation,
        ...data.qso.contactedStation,
      },
      loggingStation: {
        ...this.template.loggingStation,
        ...data.qso.loggingStation,
      },
    };
    this.formatDates(model);
    this.qsoDetailForm = fb.group({
      ...model,
      ...{
        timeOn: [model.timeOn, Validators.required],
        contactedStation: fb.group({
          ...model.contactedStation,
          ...{
            stationCall: [
              model.contactedStation.stationCall,
              Validators.required,
            ],
          },
        }),
        loggingStation: fb.group(model.loggingStation),
      },
    });
  }

  private readonly firebaseId;
  bands = Band.bands;
  qsoDetailForm: FormGroup;
  mapLink: string;
  startDelete = false;
  modeNames = Modes.modeNames;
  filteredModes$: Observable<string[]>;

  @ViewChild('saveButton') saveButton: MatButton;

  private static parseDates(qso: Qso): void {
    // form uses strings; turn them back into dates
    qso.timeOn = new Date(qso.timeOn + 'Z');
    qso.timeOff = new Date(qso.timeOff + 'Z');
  }

  ngOnInit(): void {
    const displayMode = this.data.qso.submode
      ? this.data.qso.submode
      : this.data.qso.mode;
    const modeField = this.qsoDetailForm.get('mode');
    modeField.setValue(displayMode);
    this.filteredModes$ = modeField.valueChanges.pipe(
      map((modeInput) => this.filterModes(modeInput))
    );
    this.qsoDetailForm
      .get('contactedStation')
      .valueChanges.subscribe(() => this.updateMapLink());
    this.updateMapLink();
    this.qsoDetailForm.valueChanges.subscribe(
      () => (this.saveButton.disabled = !this.qsoDetailForm.valid)
    );
  }

  private filterModes(modeInput: string): string[] {
    const filterValue = modeInput.toUpperCase();
    return this.modeNames.filter((option) =>
      option.toUpperCase().includes(filterValue)
    );
  }

  private updateMapLink(): void {
    const latitude: number = this.qsoDetailForm.get('contactedStation').value
      .latitude;
    const longitude: number = this.qsoDetailForm.get('contactedStation').value
      .longitude;
    const city: string = this.qsoDetailForm.get('contactedStation').value.city;
    const state: string = this.qsoDetailForm.get('contactedStation').value
      .state;
    const country: string = this.qsoDetailForm.get('contactedStation').value
      .country;
    if (latitude && longitude) {
      this.mapLink = googleMapsSearchBase + latitude + ',' + longitude;
    } else if (city || state || country) {
      this.mapLink =
        googleMapsSearchBase +
        encodeURIComponent(city) +
        '+' +
        encodeURIComponent(state) +
        '+' +
        encodeURIComponent(country);
    } else {
      this.mapLink = '';
    }
  }

  save(): void {
    const formValue = this.qsoDetailForm.value;
    QsoDetailComponent.parseDates(formValue);
    const realMode = Modes.findMode(formValue.mode);
    if (realMode) {
      // Prefer ADIF-specified modes, but fall back on user input for new modes
      formValue.mode = realMode.mode;
      formValue.submode = realMode.submode;
    }
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
