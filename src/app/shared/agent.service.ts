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
  /** Whether we're connected to the agent. */
  public readonly connectedState$ = new BehaviorSubject<boolean>(false);
  /** Whether we're getting any messages from WSJT-X. */
  public readonly wsjtxState$ = new BehaviorSubject<boolean>(false);
  /** Subject for listening to WSJT-X "Heartbeat" messages. */
  public readonly wsjtxHeartbeat$ = new Subject<WsjtxHeartbeat>();
  /** Subject for listening to WSJT-X "Status" messages. */
  public readonly wsjtxStatus$ = new Subject<WsjtxStatus>();
  /** Subject for listening to WSJT-X "Decode" messages. */
  public readonly wsjtxDecode$ = new Subject<WsjtxDecode>();
  /** Subject for listening to WSJT-X "QsoLogged" messages. */
  public readonly wsjtxQsoLogged$ = new Subject<WsjtxQsoLogged>();

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
      if (msg.wsjtx.type === 'HeartbeatMessage') {
        this.wsjtxHeartbeat$.next(msg.wsjtx.payload as WsjtxHeartbeat);
      }
      if (msg.wsjtx.type === 'StatusMessage') {
        this.wsjtxStatus$.next(msg.wsjtx.payload as WsjtxStatus);
      }
      if (msg.wsjtx.type === 'DecodeMessage') {
        this.wsjtxDecode$.next(msg.wsjtx.payload as WsjtxDecode);
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

/**
 * The heartbeat  message shall be  sent on a periodic  basis every
 *    15   seconds.  This
 *    message is intended to be used by servers to detect the presence
 *    of a  client and also  the unexpected disappearance of  a client
 *    and  by clients  to learn  the schema  negotiated by  the server
 *    after it receives  the initial heartbeat message  from a client.
 *
 * See
 * [WSJT-X source](https://sourceforge.net/p/wsjt/wsjtx/ci/8f99fcceffc76c986413e22ed25b93ef3fc66f1e/tree/Network/NetworkMessage.hpp#l110).
 */
export interface WsjtxHeartbeat {
  id: string;
  maxSchemaVersion: number;
  revision: string;
  version: string;
}

/**
 * WSJT-X  sends this  status message  when various  internal state
 * changes to allow the server to  track the relevant state of each
 * client without the need for  polling commands.
 *
 * See
 * [WSJT-X source](https://sourceforge.net/p/wsjt/wsjtx/ci/8f99fcceffc76c986413e22ed25b93ef3fc66f1e/tree/Network/NetworkMessage.hpp#l141).
 */
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

/**
 * The decode message is sent when  a new decode is completed, in
 * this case the 'New' field is true. It is also used in response
 * to  a "Replay"  message where  each  old decode  in the  "Band
 * activity" window, that  has not been erased, is  sent in order
 * as a one of these messages  with the 'New' field set to false.
 *
 * See
 * [WSJT-X source](https://sourceforge.net/p/wsjt/wsjtx/ci/8f99fcceffc76c986413e22ed25b93ef3fc66f1e/tree/Network/NetworkMessage.hpp#l206).
 */
export interface WsjtxDecode {
  deltaFrequency: number;
  deltaTime: number;
  id: string;
  lowConfidence: boolean;
  message: string;
  mode: string;
  new: boolean;
  offAir: boolean;
  snr: number;
  time: number;
}

/**
 * The QSO logged message is sent when the WSJT-X user accepts the "Log  QSO" dialog by clicking
 * the "OK" button.
 *
 * See
 * [WSJT-X source](https://sourceforge.net/p/wsjt/wsjtx/ci/8f99fcceffc76c986413e22ed25b93ef3fc66f1e/tree/Network/NetworkMessage.hpp#l293).
 */
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
