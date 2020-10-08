import {AngularFirestore, DocumentChangeAction} from '@angular/fire/firestore';
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
  started = false;
  qsos$ = new ReplaySubject<Map<string, Qso>>();
  filterCriteria$ = new BehaviorSubject<FilterCriteria>({});

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore) {
  }

  public init(): void {
    if (this.started) {
      return;
    }
    this.started = true;
    const uid$ = this.authService.user().pipe(map(user => user.uid));
    uid$.pipe(
      switchMap(userId => {
        const userDoc = this.firestore.doc('users/' + userId);
        return userDoc
          .collection<QsoPb.AsObject>('contacts')
          .snapshotChanges()
          .pipe(map(snapshots => this.unpackDocs(snapshots)));
      })
    ).subscribe(
      qsos => this.qsos$.next(qsos)
    );
  }

  getFilteredQsos(): Observable<Map<string, Qso>> {
    return combineLatest([this.qsos$, this.filterCriteria$])
      .pipe(map(([qsos, criteria]) => {
          const retMap = new Map<string, Qso>();
          for (const [id, qso] of qsos) {
            if (criteria.call && qso.contactedCall.indexOf(criteria.call) === -1) {
              continue;
            }
            if (criteria.state) {
              if (criteria.stateOperator === CriteriaOperator.equal
                && qso.contactedState.toUpperCase() !== criteria.state.toUpperCase()) {
                continue;
              } else if (criteria.stateOperator === CriteriaOperator.not_equal
                && qso.contactedState.toUpperCase() === criteria.state.toUpperCase()) {
                continue;
              }
            }
            if (criteria.country) {
              if (criteria.countryOperator === CriteriaOperator.equal
                && qso.contactedCountry.toUpperCase() !== criteria.country.toUpperCase()) {
                continue;
              } else if (criteria.countryOperator === CriteriaOperator.not_equal
                && qso.contactedCountry.toUpperCase() === criteria.country.toUpperCase()) {
                continue;
              }
            }
            if (criteria.mode) {
              if (criteria.modeOperator === CriteriaOperator.equal
                && qso.mode.toUpperCase() !== criteria.mode.toUpperCase()) {
                continue;
              } else if (criteria.modeOperator === CriteriaOperator.not_equal
                && qso.mode.toUpperCase() === criteria.mode.toUpperCase()) {
                continue;
              }
            }
            retMap.set(id, qso);
          }
          return retMap;
        }
      ));
  }

  // Find the earliest QSO which meets the given criteria, applying Worked All States rules
  // (e.g. mode 'digital' matches QSOs with FT8, JT65, etc.)
  findWASQso(criteria: WASQsoCriteria): Observable<Qso | undefined> {
    return this.qsos$.pipe(map(qsos =>
      Array.from(qsos.values())
        .sort(((a, b) => a.timeOn.getTime() - b.timeOn.getTime()))
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

  private unpackDocs(snapshots: DocumentChangeAction<QsoPb.AsObject>[]): Map<string, Qso> {
    return new Map(snapshots.map(snapshot =>
      [snapshot.payload.doc.id, Qso.fromObject(snapshot.payload.doc.data())]
    ));
  }

  setFilter(newCriteria: FilterCriteria): void {
    this.filterCriteria$.next(newCriteria);
  }
}

export enum CriteriaOperator {
  equal = 'equal',
  not_equal = 'not_equal',
}

export interface FilterCriteria {
  call?: string;
  state?: string;
  stateOperator?: CriteriaOperator;
  country?: string;
  countryOperator?: CriteriaOperator;
  mode?: string;
  modeOperator?: CriteriaOperator;
}

interface WASQsoCriteria {
  country?: string;
  state?: string;
  mode?: string;
  band?: string;
}
