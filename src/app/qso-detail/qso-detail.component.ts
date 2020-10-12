import {Band} from '../band';
import {Component, Inject, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {Qso} from '../qso';

export interface QsoDetailData {
  qso: Qso;
}

const googleMapsSearchBase = 'https://www.google.com/maps/search/';

@Component({
  selector: 'kel-qso-detail',
  templateUrl: './qso-detail.component.html',
  styleUrls: ['./qso-detail.component.scss'],
  providers: [DatePipe],
})
export class QsoDetailComponent {
  bands = Band.bands;
  qsoDetailForm: FormGroup;
  mapLink: string;

  @ViewChild('saveButton') saveButton: MatButton;

  constructor(private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: QsoDetailData,
              private datePipe: DatePipe) {
    this.qsoDetailForm = fb.group({
      ...data.qso, ...{
        // Qso uses date objects; format them
        timeOn: this.datePipe.transform(data.qso.timeOn, 'yyyy-MM-dd HH:mm', 'UTC'),
        timeOff: this.datePipe.transform(data.qso.timeOff, 'yyyy-MM-dd HH:mm', 'UTC'),
      }
    });

    this.qsoDetailForm.get('contactedLatitude').valueChanges.subscribe(() => this.updateMapLink());
    this.qsoDetailForm.get('contactedLongitude').valueChanges.subscribe(() => this.updateMapLink());
    this.qsoDetailForm.get('contactedCity').valueChanges.subscribe(() => this.updateMapLink());
    this.qsoDetailForm.get('contactedState').valueChanges.subscribe(() => this.updateMapLink());
    this.qsoDetailForm.get('contactedCountry').valueChanges.subscribe(() => this.updateMapLink());
    this.updateMapLink();
    this.qsoDetailForm.valueChanges.subscribe(() => this.saveButton.disabled = false);
  }

  private updateMapLink(): void {
    const latitude: number = this.qsoDetailForm.get('contactedLatitude').value;
    const longitude: number = this.qsoDetailForm.get('contactedLongitude').value;
    const city: string = this.qsoDetailForm.get('contactedCity').value;
    const state: string = this.qsoDetailForm.get('contactedState').value;
    const country: string = this.qsoDetailForm.get('contactedCountry').value;
    if (latitude && longitude) {
      this.mapLink = googleMapsSearchBase + latitude + ',' + longitude;
    } else if (city || state || country) {
      this.mapLink = googleMapsSearchBase
        + encodeURIComponent(city) + '+'
        + encodeURIComponent(state) + '+'
        + encodeURIComponent(country);
    } else {
      this.mapLink = '';
    }
  }
}
