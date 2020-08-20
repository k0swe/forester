import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService} from './auth.service';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Qso as QsoPb} from '../../generated/adif_pb';
import {Qso} from '../qso';
import {map, switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QsoService {
  qsos$: Observable<Qso[]>;

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore) {
    const uid$ = authService.user().pipe(map(user => user.uid));
    this.qsos$ = uid$.pipe(switchMap(userId => {
      const userDoc = firestore.doc('users/' + userId);
      return userDoc
        .collection<QsoPb.AsObject>('contacts')
        .valueChanges()
        .pipe(map(qsos => this.unpackDocs(qsos)));
    }));
  }

  getQsos(): Observable<Qso[]> {
    return this.qsos$;
  }

  // Find the earliest QSO which meets the given criteria, applying Worked All States rules
  // (e.g. mode 'digital' matches QSOs with FT8, JT65, etc.)
  findWASQso(criteria: WASQsoCriteria): Observable<Qso | undefined> {
    return this.getQsos().pipe(map(qsos =>
      qsos.sort(((a, b) => a.timeOn.getTime() - b.timeOn.getTime()))
        .find(qso => {

          // if band is anything but 'mixed', it should match
          if (criteria.band !== 'mixed'
            && qso.band.toUpperCase() !== criteria.band.toUpperCase()) {
            console.log('Rejecting based on band');
            return false;
          }

          // if mode is anything but 'mixed', it should match (with categories)
          if (criteria.mode !== 'mixed') {
            let simpleMode;
            const mode = qso.mode.toUpperCase();
            if (mode === 'SSB' || mode === 'USB' || mode === 'LSB') {
              simpleMode = 'phone';
            }
            if (mode === 'FT8' || mode === 'JS8' || mode === 'JT65') {
              simpleMode = 'digital';
            }
            if (mode === 'RTTY') {
              simpleMode = 'rtty';
            }
            if (mode === 'CW') {
              simpleMode = 'cw';
            }
            if (simpleMode !== criteria.mode) {
              console.log('Rejecting based on mode');
              return false;
            }
          }

          // if country is set (always should be), it should match
          if (qso.contactedCountry.toUpperCase() !== criteria.country.toUpperCase()) {
            console.log('Rejecting based on country');
            return false;
          }

          // if state is set, it should match
          if (criteria.state != null && qso.contactedState.toUpperCase() !== criteria.state.toUpperCase()) {
            console.log('Rejecting based on state');
            return false;
          }

          // everything matched
          console.log('Matched');
          return true;
        })
    ));
  }

  private unpackDocs(pbQsos: QsoPb.AsObject[]): Qso[] {
    return pbQsos.map(
      pbQso => Qso.fromObject(pbQso));
  }
}

interface WASQsoCriteria {
  country?: string;
  state?: string;
  mode?: string;
  band?: string;
}
