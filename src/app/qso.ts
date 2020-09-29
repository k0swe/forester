import {Qso as PbQso, Station} from '../generated/adif_pb';
import {Timestamp} from 'google-protobuf/google/protobuf/timestamp_pb';

export class Qso {
  band: string;
  contactedCall: string;
  contactedCity: string;
  contactedCountry: string;
  contactedContinent: string;
  contactedName: string;
  contactedState: string;
  contactedLatitude?: number;
  contactedLongitude?: number;
  loggingCall: string;
  loggingName: string;
  freq: number;
  mode: string;
  rstReceived: string;
  rstSent: string;
  timeOff: Date;
  timeOn: Date;

  static fromObject(o: PbQso.AsObject): Qso {
    // See https://github.com/improbable-eng/ts-protoc-gen/issues/9
    const pbQso = new PbQso();
    pbQso.setBand(o.band.toLowerCase());
    pbQso.setFreq(o.freq);
    pbQso.setMode(o.mode.toUpperCase());
    pbQso.setRstReceived(o.rstReceived);
    pbQso.setRstSent(o.rstSent);
    pbQso.setTimeOn(Timestamp.fromDate(new Date(o.timeOn)));
    pbQso.setTimeOff(Timestamp.fromDate(new Date(o.timeOff)));
    const contacted = new Station();
    contacted.setStationCall(o.contactedStation.stationCall);
    contacted.setOpName(o.contactedStation.opName);
    contacted.setCity(o.contactedStation.city);
    contacted.setState(o.contactedStation.state);
    contacted.setCountry(o.contactedStation.country);
    contacted.setContinent(o.contactedStation.continent);
    contacted.setLatitude(o.contactedStation.latitude);
    contacted.setLongitude(o.contactedStation.longitude);
    pbQso.setContactedStation(contacted);
    const logging = new Station();
    logging.setStationCall(o.loggingStation.stationCall);
    logging.setOpName(o.loggingStation.opName);
    pbQso.setLoggingStation(logging);
    return new Qso(pbQso);
  }

  constructor(private qso: PbQso) {
    this.band = qso.getBand();
    this.contactedCall = qso.getContactedStation().getStationCall();
    this.contactedCity = qso.getContactedStation().getCity();
    this.contactedCountry = qso.getContactedStation().getCountry();
    this.contactedContinent = qso.getContactedStation().getContinent();
    this.contactedName = qso.getContactedStation().getOpName();
    this.contactedState = qso.getContactedStation().getState();
    this.contactedLatitude = qso.getContactedStation().getLatitude();
    this.contactedLongitude = qso.getContactedStation().getLongitude();
    this.loggingCall = qso.getLoggingStation().getStationCall();
    this.loggingName = qso.getLoggingStation().getOpName();
    this.freq = qso.getFreq();
    this.mode = qso.getMode();
    this.rstReceived = qso.getRstReceived();
    this.rstSent = qso.getRstSent();
    this.timeOff = new Date(this.qso.getTimeOff().getSeconds() * 1000);
    this.timeOn = new Date(this.qso.getTimeOn().getSeconds() * 1000);
  }
}
