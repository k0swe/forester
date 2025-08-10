import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'kel-new-logbook-dialog',
  templateUrl: './new-logbook-dialog.component.html',
  styleUrls: ['./new-logbook-dialog.component.scss'],
  imports: [
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatFormField,
    MatInput,
    MatLabel,
  ],
})
export class NewLogbookDialogComponent {
  newLogbookCallsign: string;

  constructor(public dialogRef: MatDialogRef<NewLogbookDialogComponent>) {}

  create(): void {
    this.dialogRef.close({ data: this.newLogbookCallsign });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
