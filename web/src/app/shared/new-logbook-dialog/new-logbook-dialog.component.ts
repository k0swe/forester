import { Component, inject } from '@angular/core';
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
  standalone: true,
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
  dialogRef = inject<MatDialogRef<NewLogbookDialogComponent>>(MatDialogRef);

  newLogbookCallsign: string;

  create(): void {
    this.dialogRef.close({ data: this.newLogbookCallsign });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
