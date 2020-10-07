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

  ngOnInit(): void {
    // TODO: move this logic into a service
    const myWebSocket = webSocket('ws://localhost:8081/websocket');
    this.connectedState = true;
    myWebSocket.subscribe(
      msg => this.console += JSON.stringify(msg) + '\n',
      () => this.connectedState = false,
      () => this.connectedState = false
    );
  }
}
