import { AdifParser } from 'adif-parser-ts';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QsoService } from './qso.service';

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
        console.log(AdifParser.parseAdi(content));
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

  public exportAdi(): void {
    alert('Exporting ADIF files is not yet implemented');
  }
}
