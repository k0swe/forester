import {adif} from "../generated/adif";
import Qso = adif.Qso;

// Wrapper for adif.Qso.
export class K0sQso {

  static fromJson(o: object): K0sQso {
    // TODO: convert date fields to Timestamp objects
    return new K0sQso(Qso.fromObject(o));
  }

  public loggingStation = this.qso.loggingStation;
  public contactedStation = this.qso.contactedStation;
  public band = this.qso.band;
  public freq = this.qso.freq;
  public mode = this.qso.mode;
  public distanceKm = this.qso.distanceKm;
  public rstReceived = this.qso.rstReceived;
  public rstSent = this.qso.rstSent;
  public contest = this.qso.contest;

  constructor(private qso: Qso) {
  }

  getTimeOn(): Date {
    const unixTime: number = this.qso.timeOn.seconds;
    const date = new Date();
    date.setTime(unixTime * 1000)
    return date;
  }

  getTimeOff(): Date {
    const unixTime: number = this.qso.timeOff.seconds;
    const date = new Date();
    date.setTime(unixTime * 1000)
    return date;
  }

}
