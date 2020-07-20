import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Qso} from '../qso';

export interface QsoDetailData {
  qso: Qso;
}

@Component({
  selector: 'k0s-qso-detail',
  templateUrl: './qso-detail.component.html',
  styleUrls: ['./qso-detail.component.css']
})
export class QsoDetailComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<QsoDetailComponent>,
              @Inject(MAT_DIALOG_DATA) public data: QsoDetailData) {
  }

  ngOnInit(): void {
  }
}
