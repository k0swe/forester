import {Component, OnInit} from '@angular/core';
import {QsoService} from '../shared/qso.service';
import {Observable} from 'rxjs';
import {Qso} from '../qso';
import {QsoDetailComponent} from '../qso-detail/qso-detail.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'k0s-qso-list',
  templateUrl: './qso-list.component.html',
  styleUrls: ['./qso-list.component.scss']
})
export class QsoListComponent implements OnInit {
  qsos$: Observable<Qso[]>;

  // TODO: customize per responsive size
  columnsToDisplay = ['date', 'time', 'contactedCall', 'contactedName',
    'band', 'freq', 'mode', 'contactedCity', 'contactedState', 'contactedCountry'];

  constructor(private qsoService: QsoService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.qsos$ = this.qsoService.getQsos();
  }

  openDialog(qso: Qso): void {
    const dialogRef = this.dialog.open(QsoDetailComponent, {
      width: '250px',
      data: {qso: qso}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
