import { AgentService } from '../agent/agent.service';
import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Observable, Subscription } from 'rxjs';
import { QsoService } from '../qso/qso.service';
import { ActivatedRoute } from '@angular/router';

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
    private qsoService: QsoService,
    private route: ActivatedRoute
  ) {
    this.wsjtxConnected$ = agentService.wsjtxState$;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) =>
      this.qsoService.init(params.callsign)
    );
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
