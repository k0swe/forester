import {Qso as PbQso, Station} from 'adif-pb/adif_pb';
import {Timestamp} from 'google-protobuf/google/protobuf/timestamp_pb';

export class Qso {
  firebaseId: string;
  band: string;
  comment: string;
  contactedCall: string;
  contactedCity: string;
  contactedContinent: string;
  contactedCountry: string;
  contactedLatitude?: number;
  contactedLongitude?: number;
  contactedName: string;
  contactedState: string;
  freq: number;
  loggingCall: string;
  loggingName: string;
  mode: string;
  notes: any;
  rstReceived: string;
  rstSent: string;
  timeOff: Date;
  timeOn: Date;

  static fromProto(p: PbQso, firebaseId?: string): Qso {
    return this.fromObject(p.toObject(), firebaseId);
  }

  static fromObject(o: PbQso.AsObject, firebaseId?: string): Qso {
    // See https://github.com/improbable-eng/ts-protoc-gen/issues/9
    const pbQso = new PbQso();
    pbQso.setBand(o.band.toLowerCase());
    pbQso.setComment(o.comment);
    pbQso.setFreq(o.freq);
    pbQso.setMode(o.mode.toUpperCase());
    pbQso.setNotes(o.notes);
    pbQso.setRstReceived(o.rstReceived);
    pbQso.setRstSent(o.rstSent);
    pbQso.setTimeOff(new Timestamp().setSeconds(
      new Date(o.timeOff as unknown as string).getTime() / 1000));
    pbQso.setTimeOn(new Timestamp().setSeconds(
      new Date(o.timeOn as unknown as string).getTime() / 1000));
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
    return new Qso(pbQso, firebaseId);
  }

  constructor(qso?: PbQso, firebaseId?: string) {
    if (!qso) {
      return;
    }
    this.firebaseId = firebaseId;
    this.band = qso.getBand();
    this.comment = qso.getComment();
    this.contactedCall = qso.getContactedStation().getStationCall();
    this.contactedCity = qso.getContactedStation().getCity();
    this.contactedContinent = qso.getContactedStation().getContinent();
    this.contactedCountry = qso.getContactedStation().getCountry();
    this.contactedLatitude = qso.getContactedStation().getLatitude();
    this.contactedLongitude = qso.getContactedStation().getLongitude();
    this.contactedName = qso.getContactedStation().getOpName();
    this.contactedState = qso.getContactedStation().getState();
    this.freq = qso.getFreq();
    this.loggingCall = qso.getLoggingStation().getStationCall();
    this.loggingName = qso.getLoggingStation().getOpName();
    this.mode = qso.getMode();
    this.notes = qso.getNotes();
    this.rstReceived = qso.getRstReceived();
    this.rstSent = qso.getRstSent();
    this.timeOff = new Date(qso.getTimeOff().getSeconds() * 1000);
    this.timeOn = new Date(qso.getTimeOn().getSeconds() * 1000);
  }

  public toProto(): PbQso {
    const pbQso = new PbQso();
    pbQso.setBand(this.band);
    pbQso.setComment(this.comment);
    pbQso.setFreq(this.freq);
    pbQso.setMode(this.mode);
    pbQso.setNotes(this.notes);
    pbQso.setRstReceived(this.rstReceived);
    pbQso.setRstSent(this.rstSent);
    const timeOn = new Timestamp();
    timeOn.fromDate(this.timeOn);
    pbQso.setTimeOn(timeOn);
    const timeOff = new Timestamp();
    timeOff.fromDate(this.timeOff);
    pbQso.setTimeOff(timeOff);

    const contacted = new Station();
    contacted.setStationCall(this.contactedCall);
    contacted.setCity(this.contactedCity);
    contacted.setContinent(this.contactedContinent);
    contacted.setCountry(this.contactedCountry);
    contacted.setLatitude(this.contactedLatitude);
    contacted.setLongitude(this.contactedLongitude);
    contacted.setOpName(this.contactedName);
    contacted.setState(this.contactedState);
    pbQso.setContactedStation(contacted);

    const logging = new Station();
    logging.setStationCall(this.loggingCall);
    logging.setOpName(this.loggingName);
    pbQso.setLoggingStation(logging);

    return pbQso;
  }
}
