import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnInit,
  effect,
  inject,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import {
  AgentService,
  HamlibService,
  WsjtxQsoLogged,
  WsjtxService,
} from 'ngx-kel-agent';
import { EMPTY } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { Qso } from '../../qso';
import { Band } from '../../reference/band';
import { LogbookService } from '../../services/logbook.service';
import { QsoService } from '../../services/qso.service';

@Component({
  selector: 'kel-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatIcon, MatTooltip, DecimalPipe],
})
export class AgentComponent implements OnInit {
  agent = inject(AgentService);
  hamlib = inject(HamlibService);
  wsjtx = inject(WsjtxService);
  private injector = inject(Injector);
  private logbookService = inject(LogbookService);
  private qsoService = inject(QsoService);

  ngOnInit(): void {
    this.agent.init();
    // When WSJT-X sends a QSO, log it right away
    effect(
      () => {
        const qsoLogged = this.wsjtx.qsoLogged();
        if (qsoLogged) {
          console.log('Received WSJT-X QsoLogged message', qsoLogged);
          // Dates come across as strings; convert to objects
          this.saveWsjtxQso({
            ...qsoLogged,
            dateTimeOn: new Date(qsoLogged.dateTimeOn),
            dateTimeOff: new Date(qsoLogged.dateTimeOff),
          });
        }
      },
      { injector: this.injector },
    );
  }

  reconnect(): void {
    this.agent.connect();
  }

  private saveWsjtxQso(qsoLogged: WsjtxQsoLogged): void {
    // TODO: do something with "exchange sent/received"; contest fields?
    this.logbookService
      .activeQthProfile()
      .pipe(
        take(1),
        switchMap((qthProfile) => {
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
          if (this.qsoService.findMatch(qso)) {
            console.warn(
              'Received duplicate WSJT-X QSO, skipping save',
              qso.timeOn,
              qso.contactedStation.stationCall,
            );
            return EMPTY;
          }
          console.log(
            'Saving new WSJT-X QSO',
            qso.timeOn,
            qso.contactedStation.stationCall,
          );
          return this.qsoService.addOrUpdate({ qso });
        }),
      )
      .subscribe({
        error: (error) => {
          console.error('Failed saving WSJT-X QSO. ' + error);
        },
      });
  }
}
