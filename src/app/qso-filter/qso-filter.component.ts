import {Component} from '@angular/core';
import {QsoService} from '../shared/qso.service';

@Component({
  selector: 'kel-qso-filter',
  templateUrl: './qso-filter.component.html',
  styleUrls: ['./qso-filter.component.scss']
})
export class QsoFilterComponent {
  callsign = '';

  constructor(private qsoSerivce: QsoService) {
  }

  changed(): void {
    this.callsign = this.callsign.toUpperCase();
    this.qsoSerivce.setFilter({
      call: this.callsign,
    });
  }
}
