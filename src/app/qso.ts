import {Qso as PbQso, Station} from "../generated/adif_pb";
import {Timestamp} from "google-protobuf/google/protobuf/timestamp_pb";

export class Qso {
  static fromObject(o: PbQso.AsObject): Qso {
    // See https://github.com/improbable-eng/ts-protoc-gen/issues/9
    const pbQso = new PbQso();
    pbQso.setBand(o.band);
    pbQso.setFreq(o.freq);
    pbQso.setMode(o.mode);
    pbQso.setRstReceived(o.rstReceived);
    pbQso.setRstSent(o.rstSent);
    pbQso.setTimeOn(Timestamp.fromDate(new Date(o.timeOn)));
    pbQso.setTimeOff(Timestamp.fromDate(new Date(o.timeOff)));
    const contacted = new Station();
    contacted.setOpCall(o.contactedStation.opCall)
    contacted.setOpName(o.contactedStation.opName)
    contacted.setCity(o.contactedStation.city)
    contacted.setState(o.contactedStation.state)
    contacted.setCountry(o.contactedStation.country)
    pbQso.setContactedStation(contacted)
    return new Qso(pbQso);
  }

  band: string;
  contactedCall: string;
  contactedCity: string;
  contactedCountry: string;
  contactedName: string;
  contactedState: string;
  freq: number;
  mode: string;
  rstReceived: string;
  rstSent: string;
  timeOff: Date;
  timeOn: Date;

  constructor(private qso: PbQso) {
    this.band = qso.getBand();
    this.contactedCall = qso.getContactedStation().getOpCall();
    this.contactedCity = qso.getContactedStation().getCity();
    this.contactedCountry = qso.getContactedStation().getCountry();
    this.contactedName = qso.getContactedStation().getOpName();
    this.contactedState = qso.getContactedStation().getState();
    this.freq = qso.getFreq();
    this.mode = qso.getMode();
    this.rstReceived = qso.getRstReceived();
    this.rstSent = qso.getRstSent();
    this.timeOff = new Date(this.qso.getTimeOff().getSeconds() * 1000);
    this.timeOn = new Date(this.qso.getTimeOn().getSeconds() * 1000);
  }
}
