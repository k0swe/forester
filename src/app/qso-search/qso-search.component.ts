import {Component, OnInit} from '@angular/core';
import {QsoService} from '../shared/qso.service';

@Component({
  selector: 'kel-qso-search',
  templateUrl: './qso-search.component.html',
  styleUrls: ['./qso-search.component.scss']
})
export class QsoSearchComponent implements OnInit {
  search = '';

  constructor(private qsoService: QsoService) {
  }

  ngOnInit(): void {
    this.qsoService.init();
  }

  changed(): void {
    const callsign = this.search.toUpperCase();
    this.qsoService.setFilter({
      call: callsign,
    });
  }

}
