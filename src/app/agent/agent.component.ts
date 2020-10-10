import {Component, OnInit} from '@angular/core';
import {webSocket} from 'rxjs/webSocket';

@Component({
  selector: 'kel-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss']
})
export class AgentComponent implements OnInit {
  connectedState = false;
  console = '';

  readonly defaultAgentAddress = 'localhost:8081';
  agentAddress: string;

  ngOnInit(): void {
    // TODO: move this logic into a service
    this.agentAddress = localStorage.getItem('agent-address');
    if (this.agentAddress === null) {
      localStorage.setItem('agent-address', this.defaultAgentAddress);
      this.agentAddress = this.defaultAgentAddress;
    }
    const myWebSocket = webSocket('ws://' + this.agentAddress + '/websocket');
    this.connectedState = true;
    myWebSocket.subscribe(
      msg => this.console += JSON.stringify(msg) + '\n',
      () => this.connectedState = false,
      () => this.connectedState = false
    );
  }
}
