import { AsyncPipe, NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import {
  MatSlideToggle,
  MatSlideToggleChange,
} from '@angular/material/slide-toggle';
import { WsjtxService } from 'ngx-kel-agent';
import { Observable, Subscription } from 'rxjs';

import { LogbookService } from '../../services/logbook.service';
import { QsoService } from '../../services/qso.service';

@Component({
  selector: 'kel-qso-search',
  templateUrl: './qso-search.component.html',
  styleUrls: ['./qso-search.component.scss'],
  imports: [
    AsyncPipe,
    FormsModule,
    MatFormField,
    MatHint,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatSlideToggle,
    NgClass,
  ],
})
export class QsoSearchComponent implements OnInit, OnDestroy {
  wsjtx = inject(WsjtxService);
  private logbookService = inject(LogbookService);
  private qsoService = inject(QsoService);
  private active: boolean;

  search = '';
  wsjtxConnected$: Observable<boolean>;
  private wsjtxSub: Subscription;
  syncWithWsjtx: boolean;

  constructor() {
    this.wsjtxConnected$ = this.wsjtx.connected$;
    this.active = true;
  }

  ngOnInit(): void {
    this.logbookService.logbookId$.subscribe((id) => this.qsoService.init(id));
    this.wsjtx.connected$.subscribe((isUp) => {
      if (!isUp) {
        this.syncWithWsjtx = false;
        this.clear();
      }
    });
  }

  ngOnDestroy(): void {
    this.clear();
    if (this.wsjtxSub) {
      this.wsjtxSub.unsubscribe();
    }
    this.active = false;
  }

  changed(): void {
    if (!this.active) {
      return;
    }
    const callsign = this.search.toUpperCase();
    this.qsoService.setFilter({
      call: callsign,
    });
  }

  toggleSync($event: MatSlideToggleChange): void {
    if ($event.checked) {
      this.wsjtxSub = this.wsjtx.status$.subscribe((status) => {
        this.search = status.dxCall;
        this.changed();
      });
    } else {
      this.wsjtxSub.unsubscribe();
      this.search = '';
      this.changed();
    }
  }

  clear(): void {
    this.search = '';
    this.changed();
  }
}
