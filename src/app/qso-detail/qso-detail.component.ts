import { Band } from '../band';
import { Component, Inject, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FirebaseQso, QsoService } from '../shared/qso.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { Qso } from '../qso';

const googleMapsSearchBase = 'https://www.google.com/maps/search/';

@Component({
  selector: 'kel-qso-detail',
  templateUrl: './qso-detail.component.html',
  styleUrls: ['./qso-detail.component.scss'],
  providers: [DatePipe],
})
export class QsoDetailComponent {
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
    },
  };
  private readonly firebaseId;
  bands = Band.bands;
  qsoDetailForm: FormGroup;
  mapLink: string;

  @ViewChild('saveButton') saveButton: MatButton;

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
    };
    this.formatDates(model);
    this.qsoDetailForm = fb.group({
      ...model,
      ...{
        contactedStation: fb.group(model.contactedStation),
      },
    });

    this.qsoDetailForm
      .get('contactedStation')
      .valueChanges.subscribe(() => this.updateMapLink());
    this.updateMapLink();
    this.qsoDetailForm.valueChanges.subscribe(
      () => (this.saveButton.disabled = false)
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
    this.parseDates(formValue);
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

  private parseDates(qso: Qso): void {
    // form uses strings; turn them back into dates
    qso.timeOn = new Date(qso.timeOn + 'Z');
    qso.timeOff = new Date(qso.timeOff + 'Z');
  }
}
