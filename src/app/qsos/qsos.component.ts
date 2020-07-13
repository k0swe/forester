import {Component, OnInit} from '@angular/core';
import {Qso} from '../qso';

@Component({
  selector: 'k0s-qsos',
  templateUrl: './qsos.component.html',
  styleUrls: ['./qsos.component.css']
})
export class QsosComponent implements OnInit {
  qsos: Qso[] = [
    {
      band: '20m',
      dxCall: 'N0CALL',
      dxGrid: 'ZM33',
      frequencyHz: 14074000,
      mode: 'FT8',
      myCall: 'K0SWE',
      myGrid: 'DM79',
      rstReceived: '',
      rstSent: '',
      timeOff: new Date(),
      timeOn: new Date(),
    }, {
      band: '40m',
      dxCall: 'T3ST',
      dxGrid: 'YD56',
      frequencyHz: 7074000,
      mode: 'FT8',
      myCall: 'K0SWE',
      myGrid: 'DM79',
      rstReceived: '',
      rstSent: '',
      timeOff: new Date(),
      timeOn: new Date(),
    }
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

}
