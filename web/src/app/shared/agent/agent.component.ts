import { AsyncPipe, DecimalPipe, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import {
  AgentService,
  HamlibService,
  WsjtxQsoLogged,
  WsjtxService,
} from 'ngx-kel-agent';

import { Qso } from '../../qso';
import { Band } from '../../reference/band';
import { LogbookService } from '../../services/logbook.service';
import { QsoService } from '../../services/qso.service';

@Component({
  selector: 'kel-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss'],
  standalone: true,
  imports: [MatIcon, MatTooltip, DecimalPipe, NgIf, AsyncPipe],
})
export class AgentComponent implements OnInit {
  agent = inject(AgentService);
  hamlib = inject(HamlibService);
  wsjtx = inject(WsjtxService);
  private logbookService = inject(LogbookService);
  private qsoService = inject(QsoService);

  ngOnInit(): void {
    this.agent.init();
    this.logbookService.init();
    // When WSJT-X sends a QSO, log it right away
    this.wsjtx.qsoLogged$.subscribe((qsoLogged) => {
      // Dates come across as strings; convert to objects
      qsoLogged.dateTimeOn = new Date(qsoLogged.dateTimeOn);
      qsoLogged.dateTimeOff = new Date(qsoLogged.dateTimeOff);
      this.saveWsjtxQso(qsoLogged);
    });
  }

  reconnect(): void {
    this.agent.connect();
  }

  private saveWsjtxQso(qsoLogged: WsjtxQsoLogged): void {
    // TODO: do something with "exchange sent/received"; contest fields?
    const qthProfile = this.logbookService.settings$.getValue().qthProfile;
    const freqMhz = qsoLogged.txFrequency / 1000000;
    const qso: Qso = {
      band: Band.freqToBand(freqMhz),
      comment: qsoLogged.comments,
      timeOn: qsoLogged.dateTimeOn,
      timeOff: qsoLogged.dateTimeOff,
      contactedStation: {
        stationCall: qsoLogged.dxCall,
        gridSquare: qsoLogged.dxGrid,
        opCall: qsoLogged.operatorCall,
        opName: qsoLogged.name,
      },
      loggingStation: {
        ...qthProfile,
        stationCall: qsoLogged.myCall,
        gridSquare: qsoLogged.myGrid,
        power: Number(qsoLogged.txPower),
      },
      freq: freqMhz,
      mode: qsoLogged.mode,
      rstReceived: qsoLogged.reportReceived,
      rstSent: qsoLogged.reportSent,
    };
    this.qsoService.addOrUpdate({ qso }).subscribe(
      () => {},
      (error) => {
        console.error('Failed saving WSJT-X QSO. ' + error);
      },
    );
  }
}
