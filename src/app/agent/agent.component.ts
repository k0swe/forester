import { Component, OnInit } from '@angular/core';
import { AgentService } from '../shared/agent.service';

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
}
