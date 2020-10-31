import User = firebase.User;
import firebase from 'firebase';
import {
  AngularFirestore,
  DocumentChangeAction,
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import {
  BehaviorSubject,
  combineLatest,
  from,
  Observable,
  ReplaySubject,
} from 'rxjs';
import { Injectable } from '@angular/core';
import { Qso } from '../qso';
import { map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class QsoService {
  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore
  ) {}

  private started = false;
  private user$ = new ReplaySubject<User>(1);
  private qsos$ = new BehaviorSubject<FirebaseQso[]>([]);
  private filterCriteria$ = new BehaviorSubject<FilterCriteria>({});

  private static unmarshalDates(qso: Qso): void {
    if (qso.timeOn != null) {
      qso.timeOn = new Date(qso.timeOn);
    }
    if (qso.timeOff != null) {
      qso.timeOff = new Date(qso.timeOff);
    }
  }

  private static marshalDates(qso: Qso): void {
    if (qso.timeOn != null) {
      // @ts-ignore
      qso.timeOn = qso.timeOn.toISOString();
    }
    if (qso.timeOff != null) {
      // @ts-ignore
      qso.timeOff = qso.timeOff.toISOString();
    }
  }

  public init(): void {
    if (this.started) {
      return;
    }
    this.started = true;
    this.authService.user().subscribe((user) => this.user$.next(user));
    const contactSnapshots = this.user$.pipe(
      mergeMap((u: User) =>
        this.firestore
          .collection<Qso>('users/' + u.uid + '/contacts')
          .snapshotChanges()
      )
    );
    const contacts = contactSnapshots.pipe(
      map((snapshots) => this.unpackDocs(snapshots))
    );
    contacts.subscribe((qsos) => this.qsos$.next(qsos));
  }

  private unpackDocs(snapshots: DocumentChangeAction<Qso>[]): FirebaseQso[] {
    return snapshots.map((snapshot) => {
      const qso = snapshot.payload.doc.data();
      QsoService.unmarshalDates(qso);
      return { id: snapshot.payload.doc.id, qso };
    });
  }

  getFilteredQsos(): Observable<FirebaseQso[]> {
    return combineLatest([this.qsos$, this.filterCriteria$]).pipe(
      map(([qsos, criteria]) => this.filterQsos(qsos, criteria))
    );
  }

  private filterQsos(
    fbq: FirebaseQso[],
    criteria: FilterCriteria
  ): FirebaseQso[] {
    return fbq.filter((q) => {
      if (
        criteria.call &&
        q.qso.contactedStation.stationCall.indexOf(criteria.call) === -1
      ) {
        return false;
      }
      if (criteria.state) {
        if (
          criteria.stateOperator === CriteriaOperator.equal &&
          q.qso.contactedStation.state.toUpperCase() !==
            criteria.state.toUpperCase()
        ) {
          return false;
        } else if (
          criteria.stateOperator === CriteriaOperator.not_equal &&
          q.qso.contactedStation.state.toUpperCase() ===
            criteria.state.toUpperCase()
        ) {
          return false;
        }
      }
      if (criteria.country) {
        if (
          criteria.countryOperator === CriteriaOperator.equal &&
          q.qso.contactedStation.country.toUpperCase() !==
            criteria.country.toUpperCase()
        ) {
          return false;
        } else if (
          criteria.countryOperator === CriteriaOperator.not_equal &&
          q.qso.contactedStation.country.toUpperCase() ===
            criteria.country.toUpperCase()
        ) {
          return false;
        }
      }
      if (criteria.mode) {
        if (
          criteria.modeOperator === CriteriaOperator.equal &&
          q.qso.mode.toUpperCase() !== criteria.mode.toUpperCase()
        ) {
          return false;
        } else if (
          criteria.modeOperator === CriteriaOperator.not_equal &&
          q.qso.mode.toUpperCase() === criteria.mode.toUpperCase()
        ) {
          return false;
        }
      }
      return true;
    });
  }

  /**
   * Find the earliest QSO which meets the given criteria, applying Worked All States rules
   * (e.g. mode 'digital' matches QSOs with FT8, JT65, etc.)
   */
  findWASQso(criteria: WASQsoCriteria): Observable<FirebaseQso | undefined> {
    return this.qsos$.pipe(
      map((qsos) =>
        Array.from(qsos.values())
          .sort((a, b) => a.qso.timeOn.getTime() - b.qso.timeOn.getTime())
          .find((q) => {
            // if band is anything but 'mixed', it should match
            if (
              criteria.band !== 'mixed' &&
              q.qso.band.toUpperCase() !== criteria.band.toUpperCase()
            ) {
              return false;
            }

            // if mode is anything but 'mixed', it should match (with categories)
            if (criteria.mode !== 'mixed') {
              let simpleMode;
              const mode = q.qso.mode.toUpperCase();
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
            if (
              q.qso.contactedStation.country.toUpperCase() !==
              criteria.country.toUpperCase()
            ) {
              return false;
            }

            // if state is set, it should match
            if (
              criteria.state != null &&
              q.qso.contactedStation.state.toUpperCase() !==
                criteria.state.toUpperCase()
            ) {
              return false;
            }

            // everything matched
            return true;
          })
      )
    );
  }

  setFilter(newCriteria: FilterCriteria): void {
    this.filterCriteria$.next(newCriteria);
  }

  /**
   * Insert or update the given QSO into the datastore. If `fbq.id` is null, insert; otherwise, update.
   */
  public addOrUpdate(fbq: FirebaseQso): Observable<any> {
    QsoService.marshalDates(fbq.qso);
    return this.user$.pipe(
      mergeMap((u) => {
        if (fbq.id == null) {
          const contactsCollection = this.firestore.collection(
            'users/' + u.uid + '/contacts'
          );
          return from(contactsCollection.add(fbq.qso));
        } else {
          const contactDoc = this.firestore.doc(
            'users/' + u.uid + '/contacts/' + fbq.id
          );
          return from(contactDoc.update(fbq.qso));
        }
      })
    );
  }

  /**
   * Attempt to find a QSO in our internal storage that matches the given one.
   */
  public findMatch(qso: Qso): boolean {
    const match = this.qsos$
      .getValue()
      .find(
        (fbq) =>
          fbq.qso.timeOn.getTime() === qso.timeOn.getTime() &&
          fbq.qso.contactedStation.stationCall ===
            qso.contactedStation.stationCall &&
          fbq.qso.loggingStation.stationCall === qso.loggingStation.stationCall
      );
    return match !== undefined;
  }
}

export interface FirebaseQso {
  id?: string;
  qso?: Qso;
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
