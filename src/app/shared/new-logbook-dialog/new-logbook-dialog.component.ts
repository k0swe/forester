import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'kel-new-logbook-dialog',
  templateUrl: './new-logbook-dialog.component.html',
  styleUrls: ['./new-logbook-dialog.component.scss'],
})
export class NewLogbookDialogComponent {
  newLogbookCallsign: string;

  constructor(public dialogRef: MatDialogRef<NewLogbookDialogComponent>) {}

  cancel(): void {
    this.dialogRef.close();
  }
}
