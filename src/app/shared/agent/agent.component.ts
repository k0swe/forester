import { AgentService } from 'ngx-kel-agent';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'kel-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss'],
})
export class AgentComponent implements OnInit {
  constructor(public agentService: AgentService) {}

  ngOnInit(): void {
    this.agentService.init();
  }

  reconnect(): void {
    this.agentService.connect();
  }
}
