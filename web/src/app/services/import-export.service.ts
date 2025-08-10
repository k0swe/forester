import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdifFormatter, AdifParser } from 'adif-parser-ts';
import { Observable, forkJoin } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { Qso } from '../qso';
import { Adif2Proto } from '../shared/adif2proto';
import { Proto2Adif } from '../shared/proto2adif';
import { FirebaseQso, QsoService } from './qso.service';

@Injectable({
  providedIn: 'root',
})
export class ImportExportService {
  private qsoService = inject(QsoService);
  private snackBar = inject(MatSnackBar);

  public importAdi(file: File): void {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const content = fileReader.result as string;
      try {
        const adiObj = AdifParser.parseAdi(content);
        const adi = Adif2Proto.translateAdi(adiObj);
        this.addQsos(adi.qsos);
      } catch (e) {
        this.snackBar.open(
          'There was a problem importing the ADIF file',
          null,
          { duration: 10000 },
        );
        console.log('There was a problem importing the ADIF file. ', e);
      }
    };
    fileReader.readAsText(file);
  }

  private addQsos(qsos: Qso[]): void {
    const toSave: Qso[] = this.deduplicate(qsos);
    if (toSave.length === 0) {
      this.snackBar.open(`All QSOs already present; nothing to do`, null, {
        duration: 5000,
      });
    } else {
      this.snackBar.open(`Adding ${toSave.length} QSOs`, null, {
        duration: 10000,
      });
    }
    const upsertObservables = toSave.map((qso) =>
      this.qsoService.addOrUpdate({ qso }).pipe(take(1)),
    );
    forkJoin(upsertObservables).subscribe(() =>
      this.snackBar.open('Finished import', null, { duration: 5000 }),
    );
  }

  private deduplicate(qsos: Qso[]): Qso[] {
    // TODO: merge existing QSO details
    const toSave: Qso[] = [];
    for (const qso of qsos) {
      if (!this.qsoService.findMatch(qso)) {
        toSave.push(qso);
      }
    }
    return toSave;
  }

  public exportAdi(): Observable<Blob> {
    this.snackBar.open('Exporting ADIF...', null, { duration: 5000 });
    const qsos = this.qsoService.getFilteredQsos();
    return this.exportAdiFor(qsos);
  }

  public exportAdiFor(qsos: Observable<FirebaseQso[]>): Observable<Blob> {
    return qsos.pipe(
      take(1),
      map((fbqs) => {
        const qsos = fbqs.map((fbq) => fbq.qso);
        const simpleAdif = Proto2Adif.translateAdi(qsos);
        const fileContent = AdifFormatter.formatAdi(simpleAdif);
        return new Blob([fileContent], { type: 'text/plain' });
      }),
    );
  }
}
