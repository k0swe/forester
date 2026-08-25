import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
export class QsoSearchComponent implements OnInit {
  wsjtx = inject(WsjtxService);
  private destroyRef = inject(DestroyRef);
  private logbookService = inject(LogbookService);
  private qsoService = inject(QsoService);
  private active: boolean;

  search = '';
  syncWithWsjtx = signal(false);

  constructor() {
    this.active = true;
    effect(() => {
      if (!this.wsjtx.connected()) {
        this.syncWithWsjtx.set(false);
        this.clear();
      }
    });
    effect(() => {
      const status = this.wsjtx.status();
      if (this.syncWithWsjtx() && status) {
        this.search = status.dxCall;
        this.changed();
      }
    });
  }

  ngOnInit(): void {
    this.logbookService.logbookId$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((id) => this.qsoService.init(id));
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
    this.syncWithWsjtx.set($event.checked);
    if (!$event.checked) {
      this.search = '';
      this.changed();
    }
  }

  clear(): void {
    this.search = '';
    this.changed();
  }
}
