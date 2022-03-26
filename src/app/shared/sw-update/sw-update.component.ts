import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'kel-sw-update',
  templateUrl: './sw-update.component.html',
  styleUrls: ['./sw-update.component.scss'],
})
export class SwUpdateComponent implements OnInit {
  constructor(private updates: SwUpdate) {}

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
