import { Adif, ContestData, Qso, Station } from '../qso';
import { AdifParser, ParseResult } from 'adif-parser-ts';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QsoService } from './qso.service';

@Injectable({
  providedIn: 'root',
})
export class ImportExportService {
  /**
   * Translate a log from AdifParser's relatively flat objects to KelLog's internal format.
   */
  private static translateAdi(adiObj: ParseResult): Adif {
    const adif: Adif = { qsosList: [] };
    for (const qsoObj of adiObj.records) {
      const qso = this.translateQso(qsoObj);
      adif.qsosList.push(qso);
    }
    return adif;
  }

  private static translateQso(record: { [p: string]: string }): Qso {
    const qso: Qso = {};
    this.translateTopLevel(qso, record);
    qso.loggingStation = this.translateLoggingStation(record);
    qso.contactedStation = this.translateContactedStation(record);
    qso.contest = this.translateContest(record);

    // clean undefined
    return JSON.parse(JSON.stringify(qso));
  }

  private static translateTopLevel(
    qso: Qso,
    record: { [p: string]: string }
  ): void {
    qso.band = record.band ? record.band.toLowerCase() : undefined;
    qso.bandRx = record.band_rx ? record.band_rx.toLowerCase() : undefined;
    qso.comment = record.comment;
    qso.distanceKm = Number(record.distance);
    qso.freq = Number(record.freq);
    qso.freqRx = Number(record.freq_rx);
    qso.mode = record.mode ? record.mode.toUpperCase() : undefined;
    qso.notes = record.notes;
    qso.publicKey = record.public_key;
    qso.complete = record.qso_complete;
    qso.timeOn = this.getDateTime(record, 'qso_date', 'time_on');
    qso.timeOff = this.getDateTime(record, 'qso_date_off', 'time_off');
    qso.random = this.getBool(record.qso_random);
    qso.rstReceived = record.rst_rcvd;
    qso.rstSent = record.rst_sent;
    qso.submode = record.submode ? record.submode.toUpperCase() : undefined;
    qso.swl = this.getBool(record.swl);
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
    loggingStation.gridSquare = record.my_gridsquare;
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
    loggingStation.state = record.my_state;
    loggingStation.street = record.my_street;
    loggingStation.usacaCounties = record.my_usaca_counties;
    loggingStation.vuccGrids = record.my_vucc_grids;
    loggingStation.opCall = record.operator;
    loggingStation.ownerCall = record.owner_callsign;
    loggingStation.stationCall = record.station_callsign;
    loggingStation.power = this.getNumber(record.tx_pwr);
    return loggingStation;
  }

  private static translateContactedStation(record: {
    [p: string]: string;
  }): Station {
    const contactedStation: Station = {};
    contactedStation.address = record.address;
    contactedStation.age = this.getNumber(record.age);
    contactedStation.stationCall = record.call;
    contactedStation.county = record.cnty;
    contactedStation.continent = record.cont;
    contactedStation.opCall = record.contacted_op;
    contactedStation.country = this.getTitleCase(record.country);
    contactedStation.cqZone = this.getNumber(record.cqz);
    contactedStation.darcDok = record.darc_dok;
    contactedStation.dxcc = this.getNumber(record.dxcc);
    contactedStation.email = record.email;
    contactedStation.ownerCall = record.eq_call;
    contactedStation.fists = this.getNumber(record.fists);
    contactedStation.fistsCc = this.getNumber(record.fists_cc);
    contactedStation.gridSquare = record.gridsquare;
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
    contactedStation.state = record.state;
    contactedStation.tenTen = this.getNumber(record.ten_ten);
    contactedStation.uksmg = this.getNumber(record.uksmg);
    contactedStation.usacaCounties = record.usaca_counties;
    contactedStation.vuccGrids = record.vucc_grids;
    contactedStation.web = record.web;
    return contactedStation;
  }

  private static getTitleCase(str: string): string | undefined {
    if (!str) {
      return undefined;
    }
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  private static getNumber(str: string): number | undefined {
    return str ? Number(str) : undefined;
  }

  private static translateContest(record: {
    [p: string]: string;
  }): ContestData | undefined {
    if (!record.contest_id) {
      return undefined;
    }
    const contest: ContestData = {};
    contest.contestId = record.contest_id.toUpperCase();
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

  private static getBool(boolField: string): boolean | undefined {
    return boolField == null ? undefined : boolField.toUpperCase() === 'Y';
  }

  private static getLatLon(coord: string): number {
    if (!coord) {
      return 0;
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
    timeField: string
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
    if (time) {
      hour = time.substr(0, 2);
      minute = time.substr(2, 2);
    }
    return new Date(`${year}-${month}-${day} ${hour}:${minute}Z`);
  }

  constructor(private qsoService: QsoService, private snackBar: MatSnackBar) {}

  public importAdi(file: File): void {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      console.log('Imported', file.name, file.type, file.size);
      const content = fileReader.result as string;
      try {
        const adiObj = AdifParser.parseAdi(content);
        const adi = ImportExportService.translateAdi(adiObj);
        this.addQsos(adi);
      } catch (e) {
        this.snackBar.open(
          'There was a problem importing the ADIF file',
          null,
          { duration: 10000 }
        );
        console.log('There was a problem importing the ADIF file\n', e);
      }
    };
    fileReader.readAsText(file);
  }

  private addQsos(adi: Adif): void {
    console.log(adi);
  }

  public exportAdi(): void {
    alert('Exporting ADIF files is not yet implemented');
  }
}
