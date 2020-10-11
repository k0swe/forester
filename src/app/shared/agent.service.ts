import {Injectable} from '@angular/core';
import {webSocket} from 'rxjs/webSocket';
import {BehaviorSubject, ReplaySubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  connectedState$ = new BehaviorSubject<boolean>(false);
  wsjtxState$ = new BehaviorSubject<boolean>(false);
  wsjtxMessage$ = new ReplaySubject<any>();

  private readonly defaultAgentHost = 'localhost';
  private readonly defaultAgentPort = 8081;

  private agentHost: string;
  private agentPort: number;

  constructor() {
  }

  public init(): void {
    this.agentHost = this.getHost();
    this.agentPort = this.getPort();
    if (this.agentHost === null) {
      this.setHost(this.defaultAgentHost);
    }
    if (this.agentPort === 0) {
      this.setPort(this.defaultAgentPort);
    }
    this.connect();
  }

  private connect(): void {
    this.agentHost = this.getHost();
    this.agentPort = this.getPort();
    const protocol = this.agentHost === 'localhost' ? 'ws://' : 'wss://';
    const myWebSocket = webSocket(protocol + this.agentHost + ':' + this.agentPort + '/websocket');
    this.connectedState$.next(true);
    myWebSocket.subscribe(
      msg => this.handleMessage(msg),
      () => this.connectedState$.next(false),
      () => this.connectedState$.next(false)
    );
  }

  private handleMessage(msg: any): void {
    if (msg.wsjtx !== null) {
      this.wsjtxState$.next(true);
      this.wsjtxMessage$.next(msg.wsjtx);
    }
  }

  public getHost(): string {
    return localStorage.getItem('agent-host');
  }

  public getPort(): number {
    return parseInt(localStorage.getItem('agent-port'), 10);
  }

  public setHost(host: string): void {
    localStorage.setItem('agent-host', host);
    this.connect();
  }

  public setPort(port: number): void {
    localStorage.setItem('agent-port', String(port));
    this.connect();
  }
}
