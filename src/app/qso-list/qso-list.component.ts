import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
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

  columnsToDisplay = ['timeOn', 'contactedCall', 'contactedName',
    'band', 'freq', 'mode', 'contactedCity', 'contactedState', 'contactedCountry'];

  constructor(private qsoService: QsoService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.qsoService.init();
    this.paginator.pageSize = 10;
    this.paginator.pageSizeOptions = [10, 25, 50, 100];
    this.qsoService.getFilteredQsos().subscribe(qsos => {
      this.dataSource.data = qsos;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.chooseColumns(document.body.clientWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.chooseColumns(event.target.innerWidth);
  }

  chooseColumns(width: number): void {
    if (width > 768) {
      this.columnsToDisplay = ['timeOn', 'contactedCall', 'contactedName',
        'band', 'freq', 'mode', 'contactedCity', 'contactedState', 'contactedCountry'];
    } else if (width > 576) {
      this.columnsToDisplay = ['timeOn', 'contactedCall', 'band', 'mode', 'contactedState', 'contactedCountry'];
    } else {
      this.columnsToDisplay = ['timeOn', 'contactedCall', 'band', 'mode', 'contactedCountry'];
    }
  }

  openDialog(qso: Qso): void {
    const dialogRef = this.dialog.open(QsoDetailComponent, {
      width: '800px',
      data: {qso},
      panelClass: 'card-dialog-container',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
