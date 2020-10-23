import { Injectable } from '@angular/core';
import { QsoService } from './qso.service';

@Injectable({
  providedIn: 'root',
})
export class ImportExportService {
  constructor(private qsoService: QsoService) {}

  public importAdi(file: File): void {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      console.log('Imported', file.name, file.type, file.size);
      const content = fileReader.result as string;
      console.log(content);
    };
    fileReader.readAsText(file);
  }

  public exportAdi(): void {
    alert('Exporting ADIF files is not yet implemented');
  }
}
