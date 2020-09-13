import {Component} from '@angular/core';
import {QsoService} from '../shared/qso.service';

@Component({
  selector: 'kel-qso-search',
  templateUrl: './qso-search.component.html',
  styleUrls: ['./qso-search.component.scss']
})
export class QsoSearchComponent {
  search = '';

  constructor(private qsoService: QsoService) {
  }

  changed(): void {
    const callsign = this.search.toUpperCase();
    this.qsoService.setFilter({
      call: callsign,
    });
  }

}
