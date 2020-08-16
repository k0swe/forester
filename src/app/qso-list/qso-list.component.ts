import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {QsoDetailComponent} from '../qso-detail/qso-detail.component';
import {QsoService} from '../shared/qso.service';
import {Qso} from '../qso';

@Component({
  selector: 'kel-qso-list',
  templateUrl: './qso-list.component.html',
  styleUrls: ['./qso-list.component.scss']
})
export class QsoListComponent implements OnInit {
  dataSource = new MatTableDataSource<Qso>();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  // TODO: customize per responsive size
  columnsToDisplay = ['timeOn', 'contactedCall', 'contactedName',
    'band', 'freq', 'mode', 'contactedCity', 'contactedState', 'contactedCountry'];

  constructor(private qsoService: QsoService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.qsoService.getQsos().subscribe(qsos => {
      this.dataSource.data = qsos;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
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
