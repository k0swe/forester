import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {UserSettingsService} from '../shared/user-settings.service';

@Component({
  selector: 'kel-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public settingsService: UserSettingsService) {
  }

  ngOnInit(): void {
    this.settingsService.init();
  }
}
