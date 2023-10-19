import { SimpleAdif } from 'adif-parser-ts';

import {
  Adif,
  ContestData,
  Credit,
  Propagation,
  Qsl,
  Qso,
  Station,
  Upload,
  UploadStatus,
} from '../qso';

export class Adif2Proto {
  /**
   * Translate a log from AdifParser's relatively flat objects to Forester's internal format.
   */
  public static translateAdi(adiObj: SimpleAdif): Adif {
    const adif: Adif = { qsos: [] };
    for (const qsoObj of adiObj.records) {
      const qso = this.translateQso(qsoObj);
      adif.qsos.push(qso);
    }
    return adif;
  }

  private static translateQso(record: { [p: string]: string }): Qso {
    const qso: Qso = {};
    this.translateTopLevel(qso, record);
    qso.appDefined = this.translateAppDefined(record);
    qso.loggingStation = this.translateLoggingStation(record);
    qso.contactedStation = this.translateContactedStation(record);
    qso.contest = this.translateContest(record);
    qso.propagation = this.translatePropagation(record);
    this.translateCreditAndAwards(qso, record);
    this.translateUploads(qso, record);
    this.translateQsls(qso, record);
    return qso;
  }

  private static translateTopLevel(
    qso: Qso,
    record: { [p: string]: string },
  ): void {
    qso.band = this.getLowerCase(record.band);
    qso.bandRx = this.getLowerCase(record.band_rx);
    qso.comment = record.comment;
    qso.distanceKm = this.getNumber(record.distance);
    qso.freq = this.getNumber(record.freq);
    qso.freqRx = this.getNumber(record.freq_rx);
    qso.mode = this.getUpperCase(record.mode);
    qso.notes = record.notes;
    qso.publicKey = record.public_key;
    qso.complete = record.qso_complete;
    qso.timeOn = this.getDateTime(record, 'qso_date', 'time_on');
    qso.timeOff = this.getDateTime(record, 'qso_date_off', 'time_off');
    qso.random = this.getBool(record.qso_random);
    qso.rstReceived = record.rst_rcvd;
    qso.rstSent = record.rst_sent;
    qso.submode = this.getUpperCase(record.submode);
    qso.swl = this.getBool(record.swl);
  }

  private static translateAppDefined(record: { [p: string]: string }): {
    [key: string]: string;
  } {
    const retval: { [key: string]: string } = {};
    for (const field in record) {
      if (field.startsWith('app_')) {
        retval[field] = record[field];
      }
    }
    if (Object.keys(retval).length > 0) {
      return retval;
    }
    return undefined;
  }

  private static translateLoggingStation(record: {
    [p: string]: string;
  }): Station {
    const loggingStation: Station = {};
    loggingStation.antennaAzimuth = this.getNumber(record.ant_az);
    loggingStation.antennaElevation = this.getNumber(record.ant_el);
    loggingStation.antenna = record.my_antenna;
    loggingStation.city = this.getTitleCase(record.my_city);
    loggingStation.county = record.my_cnty;
    loggingStation.country = this.getTitleCase(record.my_country);
    loggingStation.cqZone = this.getNumber(record.my_cq_zone);
    loggingStation.dxcc = this.getNumber(record.my_dxcc);
    loggingStation.fists = this.getNumber(record.my_fists);
    loggingStation.gridSquare = this.getUpperCase(record.my_gridsquare);
    loggingStation.iota = record.my_iota;
    loggingStation.iotaIslandId = this.getNumber(record.my_iota_island_id);
    loggingStation.ituZone = this.getNumber(record.my_itu_zone);
    loggingStation.latitude = this.getLatLon(record.my_lat);
    loggingStation.longitude = this.getLatLon(record.my_lon);
    loggingStation.opName = this.getTitleCase(record.my_name);
    loggingStation.postalCode = record.my_postal_code;
    loggingStation.rig = record.my_rig;
    loggingStation.sig = record.my_sig;
    loggingStation.sigInfo = record.my_sig_info;
    loggingStation.sotaRef = record.my_sota_ref;
    loggingStation.state = this.getUpperCase(record.my_state);
    loggingStation.street = record.my_street;
    loggingStation.usacaCounties = record.my_usaca_counties;
    loggingStation.vuccGrids = record.my_vucc_grids;
    loggingStation.opCall = this.getUpperCase(record.operator);
    loggingStation.ownerCall = this.getUpperCase(record.owner_callsign);
    loggingStation.stationCall = this.getUpperCase(record.station_callsign);
    loggingStation.power = this.getNumber(record.tx_pwr);
    return loggingStation;
  }

  private static translateContactedStation(record: {
    [p: string]: string;
  }): Station {
    const contactedStation: Station = {};
    contactedStation.address = record.address;
    contactedStation.age = this.getNumber(record.age);
    contactedStation.stationCall = this.getUpperCase(record.call);
    contactedStation.county = record.cnty;
    contactedStation.continent = this.getUpperCase(record.cont);
    contactedStation.opCall = this.getUpperCase(record.contacted_op);
    contactedStation.country = this.getTitleCase(record.country);
    contactedStation.cqZone = this.getNumber(record.cqz);
    contactedStation.darcDok = record.darc_dok;
    contactedStation.dxcc = this.getNumber(record.dxcc);
    contactedStation.email = record.email;
    contactedStation.ownerCall = this.getUpperCase(record.eq_call);
    contactedStation.fists = this.getNumber(record.fists);
    contactedStation.fistsCc = this.getNumber(record.fists_cc);
    contactedStation.gridSquare = this.getUpperCase(record.gridsquare);
    contactedStation.iota = record.iota;
    contactedStation.iotaIslandId = this.getNumber(record.iota_island_id);
    contactedStation.ituZone = this.getNumber(record.ituz);
    contactedStation.latitude = this.getLatLon(record.lat);
    contactedStation.longitude = this.getLatLon(record.lon);
    contactedStation.opName = this.getTitleCase(record.name);
    contactedStation.pfx = record.pfx;
    contactedStation.qslVia = record.qsl_via;
    contactedStation.city = this.getTitleCase(record.qth);
    contactedStation.region = record.region;
    contactedStation.rig = record.rig;
    contactedStation.power = this.getNumber(record.rx_pwr);
    contactedStation.sig = record.sig;
    contactedStation.sigInfo = record.sig_info;
    contactedStation.silentKey = this.getBool(record.silent_key);
    contactedStation.skcc = record.skcc;
    contactedStation.sotaRef = record.sota_ref;
    contactedStation.state = this.getUpperCase(record.state);
    contactedStation.tenTen = this.getNumber(record.ten_ten);
    contactedStation.uksmg = this.getNumber(record.uksmg);
    contactedStation.usacaCounties = record.usaca_counties;
    contactedStation.vuccGrids = record.vucc_grids;
    contactedStation.web = record.web;
    return contactedStation;
  }

  private static translateContest(record: {
    [p: string]: string;
  }): ContestData | undefined {
    if (!record.contest_id) {
      return undefined;
    }
    const contest: ContestData = {};
    contest.contestId = this.getUpperCase(record.contest_id);
    contest.arrlSection = record.arrl_sect;
    contest.stationClass = record.class;
    contest.check = record.check;
    contest.precedence = record.precedence;
    contest.serialReceived = record.srx;
    if (!record.srx) {
      contest.serialReceived = record.srx_string;
    }
    contest.serialSent = record.stx;
    if (!record.stx) {
      contest.serialSent = record.stx_string;
    }
    return contest;
  }

  private static translatePropagation(record: {
    [p: string]: string;
  }): Propagation {
    const prop: Propagation = {};
    prop.aIndex = this.getNumber(record.a_index);
    prop.antPath = record.ant_path;
    prop.forceInit = this.getBool(record.force_init);
    prop.kIndex = this.getNumber(record.k_index);
    prop.maxBursts = this.getNumber(record.max_bursts);
    prop.meteorShowerName = record.ms_shower;
    prop.nrBursts = this.getNumber(record.nr_bursts);
    prop.nrPings = this.getNumber(record.nr_pings);
    prop.propagationMode = record.prop_mode;
    prop.satMode = record.sat_mode;
    prop.satName = record.sat_name;
    prop.solarFluxIndex = this.getNumber(record.sfi);
    if (Object.keys(prop).length > 0) {
      return prop;
    }
    return undefined;
  }

  private static translateCreditAndAwards(
    qso: Qso,
    record: { [p: string]: string },
  ): void {
    qso.awardSubmitted = this.translateAwards(record.award_submitted);
    qso.awardGranted = this.translateAwards(record.award_granted);
    qso.creditSubmitted = this.translateCredit(record.credit_submitted);
    qso.creditGranted = this.translateCredit(record.credit_granted);
  }

  private static translateAwards(fieldValue: string): string[] {
    if (!fieldValue) {
      return undefined;
    }
    return fieldValue.split(',');
  }

  private static translateCredit(fieldValue: string): Credit[] {
    if (!fieldValue) {
      return undefined;
    }
    const credits = fieldValue.split(',');
    const retval: Credit[] = [];
    for (const c of credits) {
      const credit: Credit = {};
      const split = c.split(':');
      credit.credit = split[0];
      if (split.length > 1) {
        credit.qslMedium = split[1];
      }
      retval.push(credit);
    }
    return retval;
  }

  private static translateUploads(
    qso: Qso,
    record: { [p: string]: string },
  ): void {
    qso.qrzcom = this.translateUpload(record, 'qrzcom');
    qso.hrdlog = this.translateUpload(record, 'hrdlog');
    qso.clublog = this.translateUpload(record, 'clublog');
  }

  private static translateUpload(
    record: { [p: string]: string },
    uploadProvider: string,
  ): Upload {
    if (!record[uploadProvider + '_qso_upload_status']) {
      return undefined;
    }
    return {
      uploadStatus: this.getUploadStatus(
        record[uploadProvider + '_qso_upload_status'],
      ),
      uploadDate: this.getDate(record[uploadProvider + '_qso_upload_date']),
    };
  }

  private static getUploadStatus(statusStr: string): UploadStatus {
    switch (statusStr) {
      case 'Y':
        return UploadStatus.UPLOAD_COMPLETE;
      case 'N':
        return UploadStatus.DO_NOT_UPLOAD;
      case 'M':
        return UploadStatus.MODIFIED_AFTER_UPLOAD;
      default:
        return UploadStatus.UNKNOWN;
    }
  }

  private static translateQsls(
    qso: Qso,
    record: { [p: string]: string },
  ): void {
    qso.card = this.translateCardQsl(record);
    qso.eqsl = this.translateQsl(record, 'eqsl_');
    qso.lotw = this.translateQsl(record, 'lotw_');
  }

  private static translateCardQsl(record: { [p: string]: string }): Qsl {
    const qsl = this.translateQsl(record, '');
    if (qsl == null) {
      return undefined;
    }
    qsl.sentVia = record.qsl_sent_via;
    qsl.receivedVia = record.qsl_rcvd_via;
    qsl.receivedMessage = record.qslmsg;
    return qsl;
  }

  private static translateQsl(
    record: { [p: string]: string },
    qslProvider: string,
  ): Qsl {
    const sent = record[qslProvider + 'qsl_sent'];
    const received = record[qslProvider + 'qsl_rcvd'];
    const noQsl =
      (sent === '' || sent === 'N') && (received === '' || received === 'N');
    if (noQsl) {
      return undefined;
    }
    return {
      sentStatus: sent,
      sentDate: this.getDate(record[qslProvider + 'qslsdate']),
      receivedStatus: received,
      receivedDate: this.getDate(record[qslProvider + 'qslrdate']),
    };
  }

  private static getTitleCase(str: string): string | undefined {
    if (!str) {
      return undefined;
    }
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
    );
  }

  private static getUpperCase(str: string): string | undefined {
    return str ? str.toUpperCase() : undefined;
  }

  private static getLowerCase(str: string): string | undefined {
    return str ? str.toLowerCase() : undefined;
  }

  private static getNumber(str: string): number | undefined {
    return str ? Number(str) : undefined;
  }

  private static getBool(boolField: string): boolean | undefined {
    return boolField == null ? undefined : boolField.toUpperCase() === 'Y';
  }

  private static getLatLon(coord: string): number {
    if (!coord) {
      return undefined;
    }
    const groups = coord.match(/([NESW])(\d+) ([\d.]+)/);
    const cardinal = groups[1];
    const degrees = Number(groups[2]);
    const minutes = Number(groups[3]);
    let retval = degrees + minutes / 60.0;
    if (cardinal === 'S' || cardinal === 'W') {
      retval *= -1;
    }
    // 4 decimal places is enough; https://xkcd.com/2170/
    return Number(retval.toFixed(4));
  }

  private static getDateTime(
    record: { [p: string]: string },
    dateField: string,
    timeField: string,
  ): Date | undefined {
    const date = record[dateField];
    if (!date) {
      return undefined;
    }
    const year = date.substr(0, 4);
    const month = date.substr(4, 2);
    const day = date.substr(6, 2);
    const time = record[timeField];
    let hour = '00';
    let minute = '00';
    let second = '00';
    if (time) {
      hour = time.substr(0, 2);
      minute = time.substr(2, 2);
      if (time.length > 4) {
        second = time.substr(4, 2);
      }
    }
    return new Date(`${year}-${month}-${day} ${hour}:${minute}:${second}Z`);
  }

  private static getDate(date: string): Date {
    if (!date) {
      return undefined;
    }
    const year = date.substr(0, 4);
    const month = date.substr(4, 2);
    const day = date.substr(6, 2);
    return new Date(`${year}-${month}-${day} 00:00Z`);
  }

  private constructor() {}
}
