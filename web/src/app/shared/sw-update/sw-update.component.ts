import { NgSwitch, NgSwitchCase } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'kel-sw-update',
  templateUrl: './sw-update.component.html',
  styleUrls: ['./sw-update.component.scss'],
  standalone: true,
  imports: [NgSwitch, MatIcon, NgSwitchCase, MatTooltip, MatIconButton],
})
export class SwUpdateComponent implements OnInit {
  private updates = inject(SwUpdate);

  state: 'none' | 'downloading' | 'ready' | 'failed' = 'none';

  ngOnInit(): void {
    this.updates.versionUpdates.subscribe((evt) => {
      switch (evt.type) {
        case 'VERSION_DETECTED':
          this.state = 'downloading';
          break;
        case 'VERSION_READY':
          this.state = 'ready';
          break;
        case 'VERSION_INSTALLATION_FAILED':
          this.state = 'failed';
          break;
      }
    });
  }

  updateNow() {
    this.updates.activateUpdate().then(() => document.location.reload());
  }
}
