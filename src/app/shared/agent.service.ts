import {Injectable} from '@angular/core';
import {webSocket} from 'rxjs/webSocket';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  private connectedState$ = new BehaviorSubject<boolean>(false);
  private console: string;

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
      msg => this.console += JSON.stringify(msg) + '\n',
      () => this.connectedState$.next(false),
      () => this.connectedState$.next(false)
    );
  }

  public getConnectedState(): Observable<boolean> {
    return this.connectedState$;
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
