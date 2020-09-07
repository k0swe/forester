import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService} from './auth.service';
import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, ReplaySubject} from 'rxjs';
import {Qso as QsoPb} from '../../generated/adif_pb';
import {Qso} from '../qso';
import {map, switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QsoService {
  qsos$ = new ReplaySubject<Qso[]>();
  filterCriteria$ = new BehaviorSubject<FilterCriteria>({});

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore) {
    const uid$ = authService.user().pipe(map(user => user.uid));
    uid$.pipe(
      switchMap(userId => {
        const userDoc = firestore.doc('users/' + userId);
        return userDoc
          .collection<QsoPb.AsObject>('contacts')
          .valueChanges()
          .pipe(map(qsos => this.unpackDocs(qsos)));
      })
    ).subscribe(
      qsos => this.qsos$.next(qsos)
    );
  }

  getFilteredQsos(): Observable<Qso[]> {
    return combineLatest([this.qsos$, this.filterCriteria$])
      .pipe(map(([qsos, criteria]) =>
        qsos.filter(qso => {
            if (criteria.call && qso.contactedCall.indexOf(criteria.call) === -1) {
              return false;
            }
            // TODO: more criteria
            return true;
          }
        )
      ));
  }

  // Find the earliest QSO which meets the given criteria, applying Worked All States rules
  // (e.g. mode 'digital' matches QSOs with FT8, JT65, etc.)
  findWASQso(criteria: WASQsoCriteria): Observable<Qso | undefined> {
    return this.qsos$.pipe(map(qsos =>
      qsos.sort(((a, b) => a.timeOn.getTime() - b.timeOn.getTime()))
        .find(qso => {

          // if band is anything but 'mixed', it should match
          if (criteria.band !== 'mixed'
            && qso.band.toUpperCase() !== criteria.band.toUpperCase()) {
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
              return false;
            }
          }

          // if country is set (always should be), it should match
          if (qso.contactedCountry.toUpperCase() !== criteria.country.toUpperCase()) {
            return false;
          }

          // if state is set, it should match
          if (criteria.state != null && qso.contactedState.toUpperCase() !== criteria.state.toUpperCase()) {
            return false;
          }

          // everything matched
          return true;
        })
    ));
  }

  private unpackDocs(pbQsos: QsoPb.AsObject[]): Qso[] {
    return pbQsos.map(
      pbQso => Qso.fromObject(pbQso));
  }

  setFilter(newCriteria: FilterCriteria): void {
    this.filterCriteria$.next(newCriteria);
  }
}

export interface FilterCriteria {
  call?: string;
}

interface WASQsoCriteria {
  country?: string;
  state?: string;
  mode?: string;
  band?: string;
}
