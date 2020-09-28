import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Qso} from '../qso';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DatePipe} from '@angular/common';

export interface QsoDetailData {
  qso: Qso;
}

@Component({
  selector: 'kel-qso-detail',
  templateUrl: './qso-detail.component.html',
  styleUrls: ['./qso-detail.component.scss'],
  providers: [DatePipe],
})
export class QsoDetailComponent {
  qsoDetailForm: FormGroup;

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
    });
  }
}
