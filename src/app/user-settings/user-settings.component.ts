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

  // TODO: this belongs in AgentService
  getAgentHost(): string {
    return localStorage.getItem('agent-host');
  }

  // TODO: this belongs in AgentService
  getAgentPort(): string {
    return localStorage.getItem('agent-port');
  }

  // TODO: this belongs in AgentService
  setAgentHost(host: string): void {
    localStorage.setItem('agent-host', host);
  }

  // TODO: this belongs in AgentService
  setAgentPort(port: string): void {
    localStorage.setItem('agent-port', port);
  }
}
