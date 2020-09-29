import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Qso} from '../qso';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {Band} from '../band';

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

  constructor(private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: QsoDetailData,
              private datePipe: DatePipe) {
    this.qsoDetailForm = fb.group({
      timeOn: this.datePipe.transform(data.qso.timeOn, 'yyyy-MM-dd HH:mm', 'UTC'),
      timeOff: this.datePipe.transform(data.qso.timeOff, 'yyyy-MM-dd HH:mm', 'UTC'),
      callsign: data.qso.contactedCall,
      band: data.qso.band,
      freq: data.qso.freq,
      mode: data.qso.mode,
      rstSent: data.qso.rstSent,
      rstRcvd: data.qso.rstReceived,
      city: data.qso.contactedCity,
      state: data.qso.contactedState,
      country: data.qso.contactedCountry,
      continent: data.qso.contactedContinent,
      opName: data.qso.contactedName,
      latitude: data.qso.contactedLatitude,
      longitude: data.qso.contactedLongitude,
    });
    this.qsoDetailForm.get('latitude').valueChanges.forEach(() => this.updateMapLink());
    this.qsoDetailForm.get('longitude').valueChanges.forEach(() => this.updateMapLink());
    this.qsoDetailForm.get('city').valueChanges.forEach(() => this.updateMapLink());
    this.qsoDetailForm.get('state').valueChanges.forEach(() => this.updateMapLink());
    this.qsoDetailForm.get('country').valueChanges.forEach(() => this.updateMapLink());
    this.updateMapLink();
  }

  private updateMapLink(): void {
    const latitude: number = this.qsoDetailForm.get('latitude').value;
    const longitude: number = this.qsoDetailForm.get('longitude').value;
    const city: string = this.qsoDetailForm.get('city').value;
    const state: string = this.qsoDetailForm.get('state').value;
    const country: string = this.qsoDetailForm.get('country').value;
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
