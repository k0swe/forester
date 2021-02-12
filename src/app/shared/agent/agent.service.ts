import { Band } from '../../reference/band';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Qso } from '../../qso';
import { QsoService } from '../qso/qso.service';
import { debounceTime, delay, retryWhen, tap } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  /** Whether we're connected to the agent. */
  public readonly connectedState$ = new BehaviorSubject<boolean>(false);
  /** Whether we're getting any messages from WSJT-X. */
  public readonly wsjtxState$ = new BehaviorSubject<boolean>(false);
  /** Subject for listening to WSJT-X "Heartbeat" messages. */
  public readonly wsjtxHeartbeat$ = new ReplaySubject<WsjtxHeartbeat>(1);
  /** Subject for listening to WSJT-X "Status" messages. */
  public readonly wsjtxStatus$ = new ReplaySubject<WsjtxStatus>(1);
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
  private myWebSocket: WebSocketSubject<Array<object>>;

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
    // if we haven't heard from WSJT-X in 15 seconds, consider it down
    this.wsjtxState$
      .pipe(debounceTime(15000))
      .subscribe(() => this.wsjtxState$.next(false));
    this.wsjtxQsoLogged$.subscribe((qsoLogged) => {
      // Dates come across as strings; convert to objects
      qsoLogged.dateTimeOn = new Date(qsoLogged.dateTimeOn);
      qsoLogged.dateTimeOff = new Date(qsoLogged.dateTimeOff);
      this.saveWsjtxQso(qsoLogged);
    });
    this.wsjtxClose$.subscribe(() => {
      this.wsjtxState$.next(false);
      this.wsjtxHeartbeat$.next(null);
      this.wsjtxStatus$.next(null);
    });
    this.connect();
  }

  public connect(): void {
    if (this.myWebSocket) {
      this.myWebSocket.unsubscribe();
    }
    this.agentHost = this.getHost();
    this.agentPort = this.getPort();
    const protocol = this.agentHost === 'localhost' ? 'ws://' : 'wss://';
    this.myWebSocket = webSocket<Array<object>>({
      url: protocol + this.agentHost + ':' + this.agentPort + '/websocket',
      // For issue #138, support multiple JSON docs per message
      deserializer: (e) => e.data.split('\n').map((m) => JSON.parse(m)),
    });
    this.myWebSocket
      .pipe(
        retryWhen((errors) =>
          // retry the websocket connection after 10 seconds
          errors.pipe(
            tap(() => this.connectedState$.next(false)),
            delay(10000)
          )
        )
      )
      .subscribe({
        next: (msgs) => {
          this.connectedState$.next(true);
          msgs.map((msg) => this.handleMessage(msg));
        },
        error: (error) => this.connectedState$.next(false),
        complete: () => this.connectedState$.next(false),
      });
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
    // TODO: do something with "exchange sent/received"; contest fields?
    const freqMhz = qsoLogged.txFrequency / 1000000;
    const qso: Qso = {
      band: Band.freqToBand(freqMhz),
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
      freq: freqMhz,
      mode: qsoLogged.mode,
      rstReceived: qsoLogged.reportReceived,
      rstSent: qsoLogged.reportSent,
    };
    this.qsoService.addOrUpdate({ qso }).subscribe(
      () => {},
      (error) => {
        console.error('Failed saving WSJT-X QSO. ' + error);
      }
    );
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
  // WSJT-X client name
  id: string;
  // WSJT-X client's supported schema version
  maxSchemaVersion: number;
  // WSJT-X client's commit hash
  revision: string;
  // WSJT-X client's semantic version
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
  // logging station's callsign
  deCall: string;
  // logging station's Maidenhead grid
  deGrid: string;
  // Whether WSJT-X is currently decoding
  decoding: boolean;
  dialFrequency: number;
  // callsign the logging station is attempting to contact
  dxCall: string;
  // Maidenhead grid the logging station is attempting to contact
  dxGrid: string;
  fastMode: boolean;
  frequencyTolerance: number;
  // WSJT-X client name
  id: string;
  mode: string;
  report: string;
  // The listening frequency in hertz above the dial frequency
  rxDeltaFreq: number;
  // If non-zero, WSJT-X is in a special mode like Fox/Hound or Field Day
  specialMode: number;
  submode: string;
  // Whether WSJT-X is transmitting
  transmitting: boolean;
  // The transmit frequency in hertz above the dial frequency
  txDeltaFreq: string;
  // Whether WSJT-X is allowed to transmit during the next window
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
  // the decode's frequency in hertz above the dial frequency
  deltaFrequency: number;
  deltaTime: number;
  // WSJT-X client name
  id: string;
  lowConfidence: boolean;
  message: string;
  mode: string;
  // whether the decode is new or replayed
  new: boolean;
  // whether the decode came from playback of a recording
  offAir: boolean;
  // signal to noise ratio
  snr: number;
  // time in milliseconds since midnight
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
  // WSJT-X client name
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
  // contacted station's callsign
  dxCall: string;
  // contacted station's Maidenhead grid
  dxGrid: string;
  // contest exchange received
  exchangeReceived: string;
  // contest exchange sent
  exchangeSent: string;
  mode: string;
  // logging station's callsign
  myCall: string;
  // logging station's Maidenhead grid
  myGrid: string;
  // contacted station's operator's name
  name: string;
  // contacted station's operator's name (if different from station)
  operatorCall: string;
  // signal report received
  reportReceived: string;
  // signal report sent
  reportSent: string;
  // frequency in hertz
  txFrequency: number;
  // power in watts
  txPower: string;
  // WSJT-X client name
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
  // WSJT-X client name
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
  // WSJT-X client name
  id: string;
  // whether the decode is new or replayed
  new: boolean;
  // time in milliseconds since midnight
  time: number;
  // signal to noise ratio
  snr: number;
  deltaTime: number;
  frequency: number;
  drift: number;
  // remote station's callsign
  callsign: string;
  // remote station's Maidenhead grid
  grid: string;
  // power in dBm
  power: number;
  // whether the decode came from playback of a recording
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
  // WSJT-X client name
  id: string;
  // ADIF encoded QSO data
  adif: string;
}
