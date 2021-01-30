import { AgentService } from '../agent/agent.service';
import { Component, OnInit } from '@angular/core';
import { LogbookService } from '../../pages/logbook/logbook.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Observable, Subscription } from 'rxjs';
import { QsoService } from '../qso/qso.service';

@Component({
  selector: 'kel-qso-search',
  templateUrl: './qso-search.component.html',
  styleUrls: ['./qso-search.component.scss'],
})
export class QsoSearchComponent implements OnInit {
  search = '';
  wsjtxConnected$: Observable<boolean>;
  private wsjtxSub: Subscription;

  constructor(
    private agentService: AgentService,
    private logbookService: LogbookService,
    private qsoService: QsoService
  ) {
    this.wsjtxConnected$ = agentService.wsjtxState$;
  }

  ngOnInit(): void {
    this.logbookService.logbookId$.subscribe((id) => this.qsoService.init(id));
  }

  changed(): void {
    const callsign = this.search.toUpperCase();
    this.qsoService.setFilter({
      call: callsign,
    });
  }

  toggleSync($event: MatSlideToggleChange): void {
    if ($event.checked) {
      this.wsjtxSub = this.agentService.wsjtxStatus$.subscribe((status) => {
        this.search = status.dxCall;
        this.changed();
      });
    } else {
      this.wsjtxSub.unsubscribe();
      this.search = '';
      this.changed();
    }
  }
}
