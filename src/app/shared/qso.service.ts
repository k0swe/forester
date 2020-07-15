import {HttpClient} from "@angular/common/http";
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Qso} from "../qso";
import {Adif} from "../../generated/adif_pb";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class QsoService {
  constructor(private http: HttpClient) {
  }

  getQsos(): Observable<Qso[]> {
    return this.http.get<Adif.AsObject>("/assets/test.json")
      .pipe(map(adif => {
        const qsos = new Array<Qso>();
        adif.qsos.forEach(
          // parse ADIF JSON into internal DTO
          qso => qsos.push(Qso.fromObject(qso))
        );
        return qsos;
      }));
  }
}
