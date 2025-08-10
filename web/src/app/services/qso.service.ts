import { Injectable, inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import {
  CollectionReference,
  Firestore,
  QuerySnapshot,
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from '@angular/fire/firestore';
import { ZonedDateTime, nativeJs } from '@js-joda/core';
import { Unsubscribe } from 'firebase/firestore';
import { BehaviorSubject, Observable, combineLatest, from, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { map, mergeMap } from 'rxjs/operators';

import { Qso } from '../qso';

@Injectable({
  providedIn: 'root',
})
export class QsoService {
  private firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);

  private currentBook = '';
  private qsos$ = new BehaviorSubject<FirebaseQso[]>([]);
  private filterCriteria$ = new BehaviorSubject<FilterCriteria>({});
  private unsubscribe: Unsubscribe;

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

  public init(bookCall: string): void {
    if (this.currentBook === bookCall) {
      return;
    }
    this.currentBook = bookCall;
    user(this.auth).subscribe((_) => {
      if (!!this.unsubscribe) {
        this.unsubscribe();
      }
      const contactsCollection = collection(
        this.firestore,
        this.contactsPath(),
      ) as CollectionReference<Qso>;
      this.unsubscribe = onSnapshot(contactsCollection, (qsosSnapshot) => {
        this.qsos$.next(this.unpackDocs(qsosSnapshot));
      });
    });
  }

  public book(): string {
    return this.currentBook;
  }

  private contactsPath(): string {
    return 'logbooks/' + this.currentBook + '/contacts';
  }

  private unpackDocs(snapshots: QuerySnapshot<Qso>): FirebaseQso[] {
    return snapshots.docs.map((snapshot) => {
      const qso = snapshot.data();
      QsoService.unmarshalDates(qso);
      return { id: snapshot.id, qso };
    });
  }

  getFilteredQsos(): Observable<FirebaseQso[]> {
    return combineLatest([this.qsos$, this.filterCriteria$]).pipe(
      map(([qsos, criteria]) => this.filterQsos(qsos, criteria)),
    );
  }

  private filterQsos(
    fbq: FirebaseQso[],
    criteria: FilterCriteria,
  ): FirebaseQso[] {
    return fbq.filter((q) => {
      if (
        criteria.call &&
        q.qso.contactedStation.stationCall.indexOf(criteria.call) === -1
      ) {
        return false;
      }
      if (criteria.state && q.qso.contactedStation.state != null) {
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
      if (criteria.country && q.qso.contactedStation.country != null) {
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
      if (criteria.mode && q.qso.mode != null) {
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
      if (criteria.dateBefore) {
        const qsoDate = ZonedDateTime.from(nativeJs(q.qso.timeOn));
        if (!qsoDate.isBefore(criteria.dateBefore)) {
          return false;
        }
      }
      if (criteria.dateAfter) {
        const qsoDate = ZonedDateTime.from(nativeJs(q.qso.timeOn));
        if (!qsoDate.isAfter(criteria.dateAfter)) {
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
      map((qsos) => {
        const matches = Array.from(qsos.values())
          .sort((a, b) => a.qso.timeOn.getTime() - b.qso.timeOn.getTime())
          .filter((q) => QsoService.fitsWASCriteria(q, criteria));
        const qslMatch = matches.find((q) => QsoService.isWASQsl(q.qso));
        if (qslMatch !== undefined) {
          return qslMatch;
        }
        // No QSO with QSL (confirmation), so just return a non-QSL one
        if (matches.length > 0) {
          return matches[0];
        }
        // No QSO whatsoever
        return undefined;
      }),
    );
  }

  /**
   * Does the given QSO meet the given criteria, applying Worked All States rules
   * (e.g. mode 'digital' matches QSOs with FT8, JT65, etc.)?
   */
  private static fitsWASCriteria(
    q: FirebaseQso,
    criteria: WASQsoCriteria,
  ): boolean {
    // if band is anything but 'mixed', it should match
    if (criteria.band !== 'mixed') {
      if (
        !q.qso.band ||
        q.qso.band.toUpperCase() !== criteria.band.toUpperCase()
      ) {
        return false;
      }
    }

    // if mode is anything but 'mixed', it should match (with categories)
    if (criteria.mode !== 'mixed') {
      if (!q.qso.mode) {
        return false;
      }
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

    // if criteria country is set (always should be), it should match
    if (criteria.country) {
      if (
        !q.qso.contactedStation.country ||
        q.qso.contactedStation.country.toUpperCase() !==
          criteria.country.toUpperCase()
      ) {
        return false;
      }
    }

    // if criteria state is set, it should match
    if (criteria.state) {
      if (
        !q.qso.contactedStation.state ||
        q.qso.contactedStation.state.toUpperCase() !==
          criteria.state.toUpperCase()
      ) {
        return false;
      }
    }

    // everything matched
    return true;
  }

  /**
   *  Does the given QSO have a QSL recognized by Worked All States?
   */
  static isWASQsl(q: Qso): boolean {
    return (
      (q.lotw && q.lotw.receivedStatus == 'Y') ||
      (q.card && q.card.receivedStatus == 'Y')
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
    return user(this.auth).pipe(
      mergeMap((u) => {
        if (u == null) {
          return of(null);
        }
        if (fbq.id == null) {
          const contactsCollection = collection(
            this.firestore,
            this.contactsPath(),
          );
          return fromPromise(addDoc(contactsCollection, fbq.qso));
        } else {
          const contactDoc = doc(this.firestore, this.contactsPath(), fbq.id);
          return fromPromise(updateDoc(contactDoc, { ...fbq.qso }));
        }
      }),
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
          fbq.qso.loggingStation.stationCall === qso.loggingStation.stationCall,
      );
    return match !== undefined;
  }

  delete(firebaseId: string): Observable<any> {
    return user(this.auth).pipe(
      mergeMap((u) => {
        if (u == null) {
          return of(null);
        }
        const contactDoc = doc(this.firestore, this.contactsPath(), firebaseId);
        return from(deleteDoc(contactDoc));
      }),
    );
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
  dateBefore?: ZonedDateTime;
  dateAfter?: ZonedDateTime;
}

interface WASQsoCriteria {
  country?: string;
  state?: string;
  mode?: string;
  band?: string;
}
