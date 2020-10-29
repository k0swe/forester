import { Band } from '../band';
import { BehaviorSubject, Subject } from 'rxjs';
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
  wsjtxStatus$ = new Subject<WsjtxStatus>();
  wsjtxQsoLogged$ = new Subject<WsjtxQsoLogged>();

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
    this.wsjtxQsoLogged$.subscribe((qsoLogged) => {
      // Dates come across as strings; convert to objects
      qsoLogged.DateTimeOn = new Date(qsoLogged.DateTimeOn);
      qsoLogged.DateTimeOff = new Date(qsoLogged.DateTimeOff);
      this.saveWsjtxQso(qsoLogged);
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
      if (msg.wsjtx.type === 'StatusMessage') {
        this.wsjtxStatus$.next(msg.wsjtx.payload as WsjtxStatus);
      }
      if (msg.wsjtx.type === 'QsoLoggedMessage') {
        this.wsjtxQsoLogged$.next(msg.wsjtx.payload as WsjtxQsoLogged);
      }
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
    // TODO: do something with "exchanged sent/received"
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

export interface WsjtxQsoLogged {
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

export interface WsjtxStatus {
  configName: string;
  deCall: string;
  deGrid: string;
  decoding: boolean;
  dialFrequency: number;
  dxCall: string;
  dxGrid: string;
  fastMode: boolean;
  frequencyTolerance: number;
  id: string;
  mode: string;
  report: string;
  rxDeltaFreq: number;
  specialMode: number;
  submode: string;
  transmitting: boolean;
  txDeltaFreq: string;
  txEnabled: boolean;
  txMode: string;
  txRxPeriod: number;
  txWatchdog: boolean;
}
