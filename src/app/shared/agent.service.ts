import { Band } from '../band';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { QsoService } from './qso.service';
import { Qso } from '../qso';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  connectedState$ = new BehaviorSubject<boolean>(false);
  wsjtxState$ = new BehaviorSubject<boolean>(false);
  wsjtxMessage$ = new ReplaySubject<any>();

  private readonly defaultAgentHost = 'localhost';
  private readonly defaultAgentPort = 8081;

  private agentHost: string;
  private agentPort: number;

  constructor(private qsoService: QsoService) {}

  public init(): void {
    this.agentHost = this.getHost();
    this.agentPort = this.getPort();
    if (this.agentHost == null) {
      this.setHost(this.defaultAgentHost);
    }
    if (isNaN(this.agentPort)) {
      this.setPort(this.defaultAgentPort);
    }
    this.connect();
    this.wsjtxMessage$.subscribe((msg) => {
      if (msg.type === 'QsoLoggedMessage') {
        const qsoLogged = msg.payload as WsjtxQsoLogged;
        // Dates come across as strings; convert to objects
        qsoLogged.DateTimeOn = new Date(qsoLogged.DateTimeOn);
        qsoLogged.DateTimeOff = new Date(qsoLogged.DateTimeOff);
        this.saveWsjtxQso(qsoLogged);
      }
    });
  }

  private connect(): void {
    this.agentHost = this.getHost();
    this.agentPort = this.getPort();
    const protocol = this.agentHost === 'localhost' ? 'ws://' : 'wss://';
    const myWebSocket = webSocket(
      protocol + this.agentHost + ':' + this.agentPort + '/websocket'
    );
    this.connectedState$.next(true);
    myWebSocket.subscribe(
      (msg) => this.handleMessage(msg),
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

  private saveWsjtxQso(qsoLogged: WsjtxQsoLogged): void {
    const qso: Qso = {
      band: Band.freqToBand(qsoLogged.TxFrequency / 1000000),
      comment: qsoLogged.Comments,
      timeOn: qsoLogged.DateTimeOn,
      timeOff: qsoLogged.DateTimeOff,
      contactedStation: {
        stationCall: qsoLogged.DxCall,
        gridSquare: qsoLogged.DxGrid,
        opCall: qsoLogged.OperatorCall,
        opName: qsoLogged.Name,
      },
      loggingStation: {
        stationCall: qsoLogged.MyCall,
        gridSquare: qsoLogged.MyGrid,
        power: Number(qsoLogged.TxPower),
      },
      freq: qsoLogged.TxFrequency / 1000000,
      mode: qsoLogged.Mode,
      rstReceived: qsoLogged.ReportReceived,
      rstSent: qsoLogged.ReportSent,
    };
    this.qsoService.addOrUpdate({ qso }).subscribe();
  }
}

interface WsjtxQsoLogged {
  Comments: string;
  DateTimeOff: Date;
  DateTimeOn: Date;
  DxCall: string;
  DxGrid: string;
  ExchangeReceived: string;
  ExchangeSent: string;
  Mode: string;
  MyCall: string;
  MyGrid: string;
  Name: string;
  OperatorCall: string;
  ReportReceived: string;
  ReportSent: string;
  TxFrequency: number;
  TxPower: string;
  id: string;
}
