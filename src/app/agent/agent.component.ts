import {Component, OnInit} from '@angular/core';
import {webSocket} from "rxjs/webSocket";

@Component({
  selector: 'k0s-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss']
})
export class AgentComponent implements OnInit {
  connectedState = "Disconnected"
  console = '';

  ngOnInit() {
    // TODO: move this logic into a service
    const myWebSocket = webSocket('ws://localhost:8081/websocket');
    this.connectedState = "Connected";
    myWebSocket.subscribe(
      msg => this.console += JSON.stringify(msg) + "\n",
      err => {
        this.connectedState = "Disconnected";
        console.log(err);
      },
      () => this.connectedState = "Disconnected"
    );
  }
}
