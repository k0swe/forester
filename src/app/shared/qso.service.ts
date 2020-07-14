import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {K0sQso} from '../k0s-qso'

@Injectable({
  providedIn: 'root'
})
export class QsoService {
  qsos: K0sQso[] = [K0sQso.fromJson({
    "loggingStation": {
      "opName": "Christopher C Keller",
      "gridSquare": "DM79lv",
      "latitude": 39.91025,
      "longitude": -105.05693333333333,
      "power": 100,
      "stationCall": "K0SWE",
      "city": "Westminster",
      "county": "CO, Jefferson",
      "state": "CO",
      "country": "United States",
      "cqZone": 4,
      "ituZone": 7
    },
    "contactedStation": {
      "opCall": "KK9A",
      "opName": "JOHN P BAYNE",
      "gridSquare": "EM95re",
      "latitude": 35.200066666666665,
      "longitude": -80.5244,
      "city": "MIDLAND",
      "county": "NC, Cabarrus",
      "state": "NC",
      "country": "United States",
      "dxcc": 291,
      "continent": "NA",
      "email": "john@kk9a.com",
      "cqZone": 5
    },
    "band": "20m",
    "bandRx": "20m",
    "freq": 14.282,
    "freqRx": 14.282,
    "mode": "SSB",
    "distanceKm": 2217,
    // TODO: ISO-8601 instead of UNIX
    "timeOn": {"seconds": 1585442040},
    "timeOff": {"seconds": 1585442040},
    "rstReceived": "59",
    "rstSent": "59",
    "contest": {
      "contestId": "CQ-WPX-SSB",
      "serialSent": "1",
      "serialReceived": "1592"
    }
  }),
    K0sQso.fromJson({
      "loggingStation": {
        "opCall": "K0SWE",
        "opName": "Christopher C Keller",
        "gridSquare": "DM79",
        "latitude": 39.91025,
        "longitude": -105.05693333333333,
        "power": 10,
        "stationCall": "K0SWE",
        "city": "Westminster",
        "county": "CO, Jefferson",
        "state": "CO",
        "country": "United States",
        "cqZone": 4,
        "ituZone": 7
      },
      "contactedStation": {
        "opCall": "K9IJ",
        "opName": "JOHN F RICE",
        "gridSquare": "EN52",
        "latitude": 42.21125,
        "longitude": -88.10846666666667,
        "city": "LAKE ZURICH",
        "county": "IL, Lake",
        "state": "IL",
        "country": "United States",
        "dxcc": 291,
        "continent": "NA",
        "email": "k9ij@arrl.net",
        "cqZone": 4,
        "ituZone": 8
      },
      "band": "40m",
      "bandRx": "40m",
      "freq": 7.07595,
      "freqRx": 7.07595,
      "mode": "FT8",
      "distanceKm": 1441,
      // TODO: ISO-8601 instead of UNIX
      "timeOn": {"seconds": 1585885080},
      "timeOff": {"seconds": 1585885200},
      "rstReceived": "-21",
      "rstSent": "-03"
    })
  ];

  constructor() {
  }

  getQsos(): Observable<K0sQso[]> {
    return of(this.qsos);
  }
}
