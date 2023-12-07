import { SimpleAdif } from 'adif-parser-ts';

import {
  ContestData,
  Credit,
  Propagation,
  Qsl,
  Qso,
  Station,
  Upload,
  UploadStatus,
} from '../qso';

export class Proto2Adif {
  /**
   * Translate QSOs from Forester's internal format to AdifParser's SimpleAdif.
   */
  public static translateAdi(qsos: Qso[]): SimpleAdif {
    let myCall = 'N0CALL';
    if (qsos && qsos[0] && qsos[0].loggingStation) {
      myCall = qsos[0].loggingStation.stationCall;
    }
    const adif: SimpleAdif = {
      header: {
        text: `Log for ${myCall}`,
        adif_ver: '3.1.1',
        programid: 'Forester',
        programversion: `${new Date().toISOString()}`,
      },
      records: [],
    };
    qsos = qsos.sort((a, b) => a.timeOn.getTime() - b.timeOn.getTime());
    for (const qsoObj of qsos) {
      const qso = this.translateQso(qsoObj);
      adif.records.push(qso);
    }
    // get rid of `undefined`s
    return JSON.parse(JSON.stringify(adif));
  }

  private static translateQso(qso: Qso): { [p: string]: string } {
    const record: { [p: string]: string } = {};
    this.translateTopLevel(qso, record);
    this.translateAppDefined(qso, record);
    this.translateLoggingStation(qso.loggingStation, record);
    this.translateContactedStation(qso.contactedStation, record);
    this.translateContest(qso.contest, record);
    this.translatePropagation(qso.propagation, record);
    this.translateCreditAndAwards(qso, record);
    this.translateUploads(qso, record);
    this.translateQsls(qso, record);
    return record;
  }

  private static translateTopLevel(
    qso: Qso,
    record: { [p: string]: string },
  ): void {
    record.band = this.getString(qso.band);
    record.band_rx = this.getString(qso.bandRx);
    record.comment = this.getString(qso.comment);
    record.distance = this.getNumber(qso.distanceKm);
    record.freq = this.getNumber(qso.freq);
    record.freq_rx = this.getNumber(qso.freqRx);
    record.mode = this.getString(qso.mode);
    record.notes = this.getString(qso.notes);
    record.public_key = this.getString(qso.publicKey);
    record.qso_complete = this.getString(qso.complete);
    record.qso_date = this.getDate(qso.timeOn);
    record.time_on = this.getTime(qso.timeOn);
    record.qso_date_off = this.getDate(qso.timeOff);
    record.time_off = this.getTime(qso.timeOff);
    record.qso_random = this.getBool(qso.random);
    record.rst_rcvd = this.getString(qso.rstReceived);
    record.rst_sent = this.getString(qso.rstSent);
    record.submode = this.getString(qso.submode);
    record.swl = this.getBool(qso.swl);
  }

  private static translateAppDefined(
    qso: Qso,
    record: { [p: string]: string },
  ): void {
    if (!qso.appDefined) {
      return;
    }
    for (const key of Object.keys(qso.appDefined)) {
      record[key] = qso.appDefined[key];
    }
  }

  private static translateLoggingStation(
    loggingStation: Station,
    record: { [p: string]: string },
  ): void {
    record.ant_az = this.getNumber(loggingStation.antennaAzimuth);
    record.ant_el = this.getNumber(loggingStation.antennaElevation);
    record.my_antenna = this.getString(loggingStation.antenna);
    record.my_city = this.getString(loggingStation.city);
    record.my_cnty = this.getString(loggingStation.county);
    record.my_country = this.getString(loggingStation.country);
    record.my_cq_zone = this.getNumber(loggingStation.cqZone);
    record.my_dxcc = this.getNumber(loggingStation.dxcc);
    record.my_fists = this.getNumber(loggingStation.fists);
    record.my_gridsquare = this.getString(loggingStation.gridSquare);
    record.my_iota = this.getString(loggingStation.iota);
    record.my_iota_island_id = this.getNumber(loggingStation.iotaIslandId);
    record.my_itu_zone = this.getNumber(loggingStation.ituZone);
    record.my_lat = this.getLatLon(loggingStation.latitude, true);
    record.my_lon = this.getLatLon(loggingStation.longitude, false);
    record.my_name = this.getString(loggingStation.opName);
    record.my_postal_code = this.getString(loggingStation.postalCode);
    record.my_rig = this.getString(loggingStation.rig);
    record.my_sig = this.getString(loggingStation.sig);
    record.my_sig_info = this.getString(loggingStation.sigInfo);
    record.my_sota_ref = this.getString(loggingStation.sotaRef);
    record.my_state = this.getString(loggingStation.state);
    record.my_street = this.getString(loggingStation.street);
    record.my_usaca_counties = this.getString(loggingStation.usacaCounties);
    record.my_vucc_grids = this.getString(loggingStation.vuccGrids);
    record.operator = this.getString(loggingStation.opCall);
    record.owner_callsign = this.getString(loggingStation.ownerCall);
    record.station_callsign = this.getString(loggingStation.stationCall);
    record.tx_pwr = this.getNumber(loggingStation.power);
  }

  private static translateContactedStation(
    contactedStation: Station,
    record: { [p: string]: string },
  ): void {
    record.address = contactedStation.address;
    record.age = this.getNumber(contactedStation.age);
    record.call = this.getString(contactedStation.stationCall);
    record.cnty = this.getString(contactedStation.county);
    record.cont = this.getString(contactedStation.continent);
    record.contacted_op = this.getString(contactedStation.opCall);
    record.country = this.getString(contactedStation.country);
    record.cqz = this.getNumber(contactedStation.cqZone);
    record.darc_dok = this.getString(contactedStation.darcDok);
    record.dxcc = this.getNumber(contactedStation.dxcc);
    record.email = this.getString(contactedStation.email);
    record.eq_call = this.getString(contactedStation.ownerCall);
    record.fists = this.getNumber(contactedStation.fists);
    record.fists_cc = this.getNumber(contactedStation.fistsCc);
    record.gridsquare = this.getString(contactedStation.gridSquare);
    record.iota = this.getString(contactedStation.iota);
    record.iota_island_id = this.getNumber(contactedStation.iotaIslandId);
    record.ituz = this.getNumber(contactedStation.ituZone);
    record.lat = this.getLatLon(contactedStation.latitude, true);
    record.lon = this.getLatLon(contactedStation.longitude, false);
    record.name = this.getString(contactedStation.opName);
    record.pfx = this.getString(contactedStation.pfx);
    record.qsl_via = this.getString(contactedStation.qslVia);
    record.qth = this.getString(contactedStation.city);
    record.region = this.getString(contactedStation.region);
    record.rig = this.getString(contactedStation.rig);
    record.rx_pwr = this.getNumber(contactedStation.power);
    record.sig = this.getString(contactedStation.sig);
    record.sig_info = this.getString(contactedStation.sigInfo);
    record.silent_key = this.getBool(contactedStation.silentKey);
    record.skcc = this.getString(contactedStation.skcc);
    record.sota_ref = this.getString(contactedStation.sotaRef);
    record.state = this.getString(contactedStation.state);
    record.ten_ten = this.getNumber(contactedStation.tenTen);
    record.uksmg = this.getNumber(contactedStation.uksmg);
    record.usaca_counties = this.getString(contactedStation.usacaCounties);
    record.vucc_grids = this.getString(contactedStation.vuccGrids);
    record.web = this.getString(contactedStation.web);
  }

  private static translateContest(
    contest: ContestData,
    record: { [p: string]: string },
  ): void {
    if (!contest) {
      return;
    }
    record.contest_id = this.getString(contest.contestId);
    record.arrl_sect = this.getString(contest.arrlSection);
    record.class = this.getString(contest.stationClass);
    record.check = this.getString(contest.check);
    record.precedence = this.getString(contest.precedence);
    record.srx_string = this.getString(contest.serialReceived);
    record.stx_string = this.getString(contest.serialSent);
  }

  private static translatePropagation(
    prop: Propagation,
    record: { [p: string]: string },
  ): void {
    if (!prop) {
      return;
    }
    record.a_index = this.getNumber(prop.aIndex);
    record.ant_path = this.getString(prop.antPath);
    record.force_init = this.getBool(prop.forceInit);
    record.k_index = this.getNumber(prop.kIndex);
    record.max_bursts = this.getNumber(prop.maxBursts);
    record.ms_shower = this.getString(prop.meteorShowerName);
    record.nr_bursts = this.getNumber(prop.nrBursts);
    record.nr_pings = this.getNumber(prop.nrPings);
    record.prop_mode = this.getString(prop.propagationMode);
    record.sat_mode = this.getString(prop.satMode);
    record.sat_name = this.getString(prop.satName);
    record.sfi = this.getNumber(prop.solarFluxIndex);
  }

  private static translateCreditAndAwards(
    qso: Qso,
    record: { [p: string]: string },
  ): void {
    record.award_submitted = this.translateAwards(qso.awardSubmitted);
    record.award_granted = this.translateAwards(qso.awardGranted);
    record.credit_submitted = this.translateCredit(qso.creditSubmitted);
    record.credit_granted = this.translateCredit(qso.creditGranted);
  }

  private static translateAwards(awards: Array<string>): string {
    if (!awards) {
      return undefined;
    }
    return awards.join(',');
  }

  private static translateCredit(credits: Credit[]): string {
    if (!credits) {
      return undefined;
    }

    return Object.keys(credits)
      .map((k) => {
        const c = credits[k];
        if (c.qslMedium) {
          return `${c.credit}:${c.qslMedium}`;
        }
        return c.credit;
      })
      .join(',');
  }

  private static translateUploads(
    qso: Qso,
    record: { [p: string]: string },
  ): void {
    this.translateUpload(qso.qrzcom, 'qrzcom', record);
    this.translateUpload(qso.hrdlog, 'hrdlog', record);
    this.translateUpload(qso.clublog, 'clublog', record);
  }

  private static translateUpload(
    upload: Upload,
    uploadProvider: string,
    record: { [p: string]: string },
  ): void {
    if (!upload) {
      return;
    }
    let status: any = upload.uploadStatus;
    if (typeof status === 'string') {
      // This should probably happen in QsoService.unmarshal somewhere...
      status = UploadStatus[`${status}`];
    }
    switch (status) {
      case UploadStatus.UPLOAD_COMPLETE:
        record[uploadProvider + '_qso_upload_status'] = 'Y';
        break;
      case UploadStatus.DO_NOT_UPLOAD:
        record[uploadProvider + '_qso_upload_status'] = 'N';
        break;
      case UploadStatus.MODIFIED_AFTER_UPLOAD:
        record[uploadProvider + '_qso_upload_status'] = 'M';
        break;
    }
    record[uploadProvider + '_qso_upload_date'] = this.getDate(
      upload.uploadDate,
    );
  }

  private static translateQsls(
    qso: Qso,
    record: { [p: string]: string },
  ): void {
    this.translateCardQsl(qso.card, record);
    this.translateQsl(qso.eqsl, 'eqsl_', record);
    this.translateQsl(qso.lotw, 'lotw_', record);
  }

  private static translateCardQsl(
    qsl: Qsl,
    record: { [p: string]: string },
  ): void {
    if (qsl == null) {
      return undefined;
    }
    this.translateQsl(qsl, '', record);
    record.qsl_sent_via = this.getString(qsl.sentVia);
    record.qsl_rcvd_via = this.getString(qsl.receivedVia);
    record.qslmsg = this.getString(qsl.receivedMessage);
  }

  private static translateQsl(
    qsl: Qsl,
    qslProvider: string,
    record: { [p: string]: string },
  ): void {
    if (!qsl) {
      return;
    }
    record[qslProvider + 'qsl_sent'] = this.getString(qsl.sentStatus);
    record[qslProvider + 'qsl_rcvd'] = this.getString(qsl.receivedStatus);
    record[qslProvider + 'qslsdate'] = this.getDate(qsl.sentDate);
    record[qslProvider + 'qslrdate'] = this.getDate(qsl.receivedDate);
  }

  private static getString(str: string): string | undefined {
    return !!str ? str : undefined;
  }

  private static getNumber(num: number): string | undefined {
    return num ? num.toString(10) : undefined;
  }

  private static getBool(bool: boolean): string | undefined {
    if (bool == null) {
      return undefined;
    }
    return bool ? 'Y' : 'N';
  }

  private static getLatLon(coord: number, isLat: boolean): string {
    if (!coord || coord === 0) {
      return undefined;
    }
    let cardinal;
    if (isLat) {
      if (coord > 0) {
        cardinal = 'N';
      } else {
        cardinal = 'S';
      }
    } else {
      if (coord > 0) {
        cardinal = 'E';
      } else {
        cardinal = 'W';
      }
    }
    const myCoord = Math.abs(coord);
    const degrees = Math.floor(myCoord);
    const degStr = degrees.toString().padStart(3, '0');
    const minutes = ((myCoord - degrees) * 60).toFixed(3).padStart(6, '0');
    return `${cardinal}${degStr} ${minutes}`;
  }

  private static getDate(date: Date): string {
    if (!date) {
      return undefined;
    }
    if (!(date instanceof Date)) {
      // This is kind of a band-aid. Really, dates should be fixed in
      // QsoService.unmarshalDates()
      date = new Date(date);
    }
    if (isNaN(date.getTime())) {
      // Invalid date
      return undefined;
    }
    const year = date.getUTCFullYear().toString();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    return `${year}${month}${day}`;
  }

  private static getTime(date: Date): string {
    if (!date) {
      return undefined;
    }
    const hour = date.getUTCHours().toString().padStart(2, '0');
    const minute = date.getUTCMinutes().toString().padStart(2, '0');
    const second = date.getUTCSeconds().toString().padStart(2, '0');
    return `${hour}${minute}${second}`;
  }

  private constructor() {}
}
