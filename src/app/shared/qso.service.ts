import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Qso} from "../qso";
import {Qso as QsoPb} from "../../generated/adif_pb";
import {map, switchMap} from "rxjs/operators";
import {AngularFirestore} from "@angular/fire/firestore";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class QsoService {
  qsos$: Observable<Qso[]>;

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore) {
    const uid$ = authService.user().pipe(map(user => user.uid));
    this.qsos$ = uid$.pipe(switchMap(userId =>
      this.firestore
        .collection("contacts", ref => ref.where('owner', '==', userId))
        .valueChanges()
        .pipe(map(docs => this.unpackDocs(docs)))
    ));
  }

  getQsos(): Observable<Qso[]> {
    return this.qsos$;
  }

  private unpackDocs(docs: unknown[]): Qso[] {
    return docs.map(
      doc => Qso.fromObject((doc as FsQso).qso));
  }

  private insert(qso: QsoPb.AsObject) {
    this.authService.user().subscribe(user => {
        if (user == null) {
          return;
        }
        const fsQso: FsQso = {
          qso: qso,
          owner: user.uid
        };
        this.firestore
          .collection("contacts")
          .add(fsQso);
      }
    );
  }
}

// Firestore Qso
interface FsQso {
  qso: QsoPb.AsObject
  // Firebase user UID
  owner: string
}
