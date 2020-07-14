import {Injectable} from '@angular/core';
import {Qso} from '../qso';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QsoService {
  qsos: Qso[] = [
    {
      band: '20m',
      country: 'Corellia',
      dxCall: 'N0CALL',
      dxGrid: 'ZM33',
      frequencyHz: 14074000,
      mode: 'FT8',
      myCall: 'K0SWE',
      myGrid: 'DM79',
      name: 'Han Solo',
      qth: 'Millenium Falcon',
      rstReceived: '-5',
      rstSent: '-7',
      state: 'NA',
      timeOff: new Date(),
      timeOn: new Date(),
    }, {
      band: '40m',
      country: 'Alderaan',
      dxCall: 'T3ST',
      dxGrid: 'YD56',
      frequencyHz: 7074000,
      mode: 'FT8',
      myCall: 'K0SWE',
      myGrid: 'DM79',
      name: 'Leia Organa',
      qth: 'Blue Lake',
      rstReceived: '-2',
      rstSent: '-8',
      state: 'SB',
      timeOff: new Date(),
      timeOn: new Date(),
    }
  ];

  constructor() {
  }

  getQsos(): Observable<Qso[]> {
    return of(this.qsos);
  }
}
