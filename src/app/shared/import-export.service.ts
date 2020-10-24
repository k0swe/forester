import { Adif2Proto } from './adif2proto';
import { AdifParser } from 'adif-parser-ts';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QsoService } from './qso.service';
import { Qso } from '../qso';
import { forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ImportExportService {
  constructor(private qsoService: QsoService, private snackBar: MatSnackBar) {}

  public importAdi(file: File): void {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      console.log('Imported', file.name, file.type, file.size);
      const content = fileReader.result as string;
      try {
        const adiObj = AdifParser.parseAdi(content);
        const adi = Adif2Proto.translateAdi(adiObj);
        this.addQsos(adi.qsosList);
      } catch (e) {
        this.snackBar.open(
          'There was a problem importing the ADIF file',
          null,
          { duration: 10000 }
        );
        console.log('There was a problem importing the ADIF file\n', e);
      }
    };
    fileReader.readAsText(file);
  }

  private addQsos(qsos: Qso[]): void {
    // TODO: dedupe/merge
    this.snackBar.open(`Adding ${qsos.length} QSOs`, null, { duration: 10000 });
    const upsertObservables = qsos.map((qso) =>
      this.qsoService.addOrUpdate({ qso }).pipe(take(1))
    );
    forkJoin(upsertObservables).subscribe(() =>
      this.snackBar.open('Done', null, { duration: 5000 })
    );
  }

  public exportAdi(): void {
    alert('Exporting ADIF files is not yet implemented');
  }
}
