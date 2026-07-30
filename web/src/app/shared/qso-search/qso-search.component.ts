import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import {
  MatFormField,
  MatHint,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import {
  MatSlideToggle,
  MatSlideToggleChange,
} from '@angular/material/slide-toggle';
import { WsjtxService } from 'ngx-kel-agent';
import { Subscription } from 'rxjs';

import { LogbookService } from '../../services/logbook.service';
import { QsoService } from '../../services/qso.service';

@Component({
  selector: 'kel-qso-search',
  templateUrl: './qso-search.component.html',
  styleUrls: ['./qso-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FormsModule,
    MatFormField,
    MatHint,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatSlideToggle,
    MatSuffix,
    NgClass,
  ],
})
export class QsoSearchComponent implements OnInit, OnDestroy {
  wsjtx = inject(WsjtxService);
  private destroyRef = inject(DestroyRef);
  private logbookService = inject(LogbookService);
  private qsoService = inject(QsoService);
  private active: boolean;

  search = '';
  wsjtxConnected = toSignal(this.wsjtx.connected$, {
    initialValue: false,
  });
  private wsjtxSub: Subscription | undefined;
  syncWithWsjtx = false;

  constructor() {
    this.active = true;
  }

  ngOnInit(): void {
    this.logbookService.logbookId$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((id) => this.qsoService.init(id));
    this.wsjtx.connected$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isUp) => {
        if (!isUp) {
          this.syncWithWsjtx = false;
          this.wsjtxSub?.unsubscribe();
          this.wsjtxSub = undefined;
          this.clear();
        }
      });
  }

  ngOnDestroy(): void {
    this.clear();
    this.wsjtxSub?.unsubscribe();
    this.wsjtxSub = undefined;
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
      this.wsjtxSub = this.wsjtx.status$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((status) => {
          this.search = status.dxCall;
          this.changed();
        });
    } else {
      this.wsjtxSub?.unsubscribe();
      this.wsjtxSub = undefined;
      this.search = '';
      this.changed();
    }
  }

  clear(): void {
    this.search = '';
    this.changed();
  }
}
