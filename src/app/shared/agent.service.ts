import { Band } from '../band';
import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { QsoService } from './qso.service';
import { Qso } from '../qso';
import { webSocket } from 'rxjs/webSocket';
import { debounceTime } from 'rxjs/operators';

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
  /** Subject for listening to WSJT-X "Clear" messages. */
  public readonly wsjtxClear$ = new Subject<WsjtxClear>();
  /** Subject for listening to WSJT-X "QsoLogged" messages. */
  public readonly wsjtxQsoLogged$ = new Subject<WsjtxQsoLogged>();
  /** Subject for listening to WSJT-X "Close" messages. */
  public readonly wsjtxClose$ = new Subject<WsjtxClose>();
  /** Subject for listening to WSJT-X "WsprDecode" messages. */
  public readonly wsjtxWsprDecode$ = new Subject<WsjtxWsprDecode>();
  /** Subject for listening to WSJT-X "LoggedAdif" messages. */
  public readonly wsjtxLoggedAdif$ = new Subject<WsjtxLoggedAdif>();

  private readonly defaultAgentHost = 'localhost';
  private readonly defaultAgentPort = 8081;

  private agentHost: string;
  private agentPort: number;

  constructor(private qsoService: QsoService) {
    // if we haven't heard from WSJT-X in 15 seconds, consider it down
    this.wsjtxState$
      .pipe(debounceTime(15000))
      .subscribe(() => this.wsjtxState$.next(false));
  }

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
      qsoLogged.dateTimeOn = new Date(qsoLogged.dateTimeOn);
      qsoLogged.dateTimeOff = new Date(qsoLogged.dateTimeOff);
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
      switch (msg.wsjtx.type) {
        case 'HeartbeatMessage':
          this.wsjtxHeartbeat$.next(msg.wsjtx.payload as WsjtxHeartbeat);
          return;
        case 'StatusMessage':
          this.wsjtxStatus$.next(msg.wsjtx.payload as WsjtxStatus);
          return;
        case 'DecodeMessage':
          this.wsjtxDecode$.next(msg.wsjtx.payload as WsjtxDecode);
          return;
        case 'ClearMessage':
          this.wsjtxClear$.next(msg.wsjtx.payload as WsjtxClear);
          return;
        case 'QsoLoggedMessage':
          this.wsjtxQsoLogged$.next(msg.wsjtx.payload as WsjtxQsoLogged);
          return;
        case 'CloseMessage':
          this.wsjtxClose$.next(msg.wsjtx.payload as WsjtxClose);
          return;
        case 'WSPRDecodeMessage':
          this.wsjtxWsprDecode$.next(msg.wsjtx.payload as WsjtxWsprDecode);
          return;
        case 'LoggedAdifMessage':
          this.wsjtxLoggedAdif$.next(msg.wsjtx.payload as WsjtxLoggedAdif);
          return;
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
      band: Band.freqToBand(qsoLogged.txFrequency / 1000000),
      comment: qsoLogged.comments,
      timeOn: qsoLogged.dateTimeOn,
      timeOff: qsoLogged.dateTimeOff,
      contactedStation: {
        stationCall: qsoLogged.dxCall,
        gridSquare: qsoLogged.dxGrid,
        opCall: qsoLogged.operatorCall,
        opName: qsoLogged.name,
      },
      loggingStation: {
        stationCall: qsoLogged.myCall,
        gridSquare: qsoLogged.myGrid,
        power: Number(qsoLogged.txPower),
      },
      freq: qsoLogged.txFrequency / 1000000,
      mode: qsoLogged.mode,
      rstReceived: qsoLogged.reportReceived,
      rstSent: qsoLogged.reportSent,
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
 * This message is  send when all prior "Decode"  messages in the
 * "Band Activity"  window have been discarded  and therefore are
 * no long available for actioning  with a "Reply" message.
 *
 * See
 * [WSJT-X source](https://sourceforge.net/p/wsjt/wsjtx/ci/8f99fcceffc76c986413e22ed25b93ef3fc66f1e/tree/Network/NetworkMessage.hpp#l232).
 */
export interface WsjtxClear {
  id: string;
}

/**
 * The QSO logged message is sent when the WSJT-X user accepts the "Log  QSO" dialog by clicking
 * the "OK" button.
 *
 * See
 * [WSJT-X source](https://sourceforge.net/p/wsjt/wsjtx/ci/8f99fcceffc76c986413e22ed25b93ef3fc66f1e/tree/Network/NetworkMessage.hpp#l293).
 */
export interface WsjtxQsoLogged {
  comments: string;
  dateTimeOff: Date;
  dateTimeOn: Date;
  dxCall: string;
  dxGrid: string;
  exchangeReceived: string;
  exchangeSent: string;
  mode: string;
  myCall: string;
  myGrid: string;
  name: string;
  operatorCall: string;
  reportReceived: string;
  reportSent: string;
  txFrequency: number;
  txPower: string;
  id: string;
}

/**
 * Close is  sent by  a client immediately  prior to  it shutting
 * down gracefully.
 *
 * See
 * [WSJT-X source](https://sourceforge.net/p/wsjt/wsjtx/ci/8f99fcceffc76c986413e22ed25b93ef3fc66f1e/tree/Network/NetworkMessage.hpp#l318).
 */
export interface WsjtxClose {
  id: string;
}

/**
 * The decode message is sent when  a new decode is completed, in
 * this case the 'New' field is true.
 *
 * See
 * [WSJT-X source](https://sourceforge.net/p/wsjt/wsjtx/ci/8f99fcceffc76c986413e22ed25b93ef3fc66f1e/tree/Network/NetworkMessage.hpp#l381).
 */
export interface WsjtxWsprDecode {
  id: string;
  new: boolean;
  time: number;
  snr: number;
  deltaTime: number;
  frequency: number;
  drift: number;
  callsign: string;
  grid: string;
  power: number;
  offAir: boolean;
}

/**
 * The  logged ADIF  message is  sent to  the server(s)  when the
 * WSJT-X user accepts the "Log  QSO" dialog by clicking the "OK"
 * button.
 *
 * See
 * [WSJT-X source](https://sourceforge.net/p/wsjt/wsjtx/ci/8f99fcceffc76c986413e22ed25b93ef3fc66f1e/tree/Network/NetworkMessage.hpp#l421).
 */
export interface WsjtxLoggedAdif {
  id: string;
  adif: string;
}
