import { AgentService, WsjtxStatus } from '../shared/agent.service';
import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Observable, Subscription } from 'rxjs';
import { QsoService } from '../shared/qso.service';

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
    private qsoService: QsoService
  ) {
    this.wsjtxConnected$ = agentService.wsjtxState$;
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

  toggleSync($event: MatSlideToggleChange): void {
    if ($event.checked) {
      this.wsjtxSub = this.agentService.wsjtxMessage$.subscribe((msg) => {
        // TODO: do this in the service instead of making clients figure this out
        if (msg.type === 'StatusMessage') {
          const status = msg.payload as WsjtxStatus;
          this.search = status.dxCall;
          this.changed();
        }
      });
    } else {
      this.wsjtxSub.unsubscribe();
      this.search = '';
      this.changed();
    }
  }
}
