import { Component, OnInit } from '@angular/core';

import { UserSettingsService } from './shared/user-settings/user-settings.service';

@Component({
  selector: 'kel-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(public userSettingsService: UserSettingsService) {}

  ngOnInit(): void {
    this.userSettingsService.init();
  }
}
