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

  findEarliestQso(criteria: { country: string; state?: string }): Observable<Qso | undefined> {
    return this.getQsos().pipe(map(qsos =>
      qsos.sort(((a, b) => a.timeOn.getTime() - b.timeOn.getTime()))
        .find(qso => {
          if (qso.contactedCountry === criteria.country) {
            if (criteria.state == null) {
              // For AK or HI
              return true;
            } else if (qso.contactedState === criteria.state) {
              return true;
            }
            return false;
          }
        })
    ));
  }

  private unpackDocs(pbQsos: QsoPb.AsObject[]): Qso[] {
    return pbQsos.map(
      pbQso => Qso.fromObject(pbQso));
  }
}
