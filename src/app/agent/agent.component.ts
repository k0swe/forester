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

  readonly defaultAgentHost = 'localhost';
  readonly defaultAgentPort = 8081;
  agentHost: string;
  agentPort: number;

  ngOnInit(): void {
    // TODO: move this logic into a service
    this.agentHost = localStorage.getItem('agent-host');
    this.agentPort = parseInt(localStorage.getItem('agent-port'), 10);
    if (this.agentHost === null || this.agentPort === 0) {
      localStorage.setItem('agent-host', this.defaultAgentHost);
      localStorage.setItem('agent-port', String(this.defaultAgentPort));
      this.agentHost = this.defaultAgentHost;
      this.agentPort = this.defaultAgentPort;
    }
    const protocol = this.agentHost === 'localhost' ? 'ws://' : 'wss://';
    const myWebSocket = webSocket(protocol + this.agentHost + ':' + this.agentPort + '/websocket');
    this.connectedState = true;
    myWebSocket.subscribe(
      msg => this.console += JSON.stringify(msg) + '\n',
      () => this.connectedState = false,
      () => this.connectedState = false
    );
  }
}
