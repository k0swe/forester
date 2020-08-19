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

  private unpackDocs(pbQsos: QsoPb.AsObject[]): Qso[] {
    return pbQsos.map(
      pbQso => Qso.fromObject(pbQso));
  }
}
