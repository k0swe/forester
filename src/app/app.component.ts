import {Component, OnInit} from '@angular/core';
import {webSocket} from 'rxjs/webSocket';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'k0s-log';
  connectedState = "Disconnected"
  console = '';

  ngOnInit() {
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
