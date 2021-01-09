import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FirebaseQso, QsoService } from '../shared/qso.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { QsoDetailComponent } from '../qso-detail/qso-detail.component';

@Component({
  selector: 'kel-qso-list',
  templateUrl: './qso-list.component.html',
  styleUrls: ['./qso-list.component.scss'],
})
export class QsoListComponent implements OnInit {
  dataSource = new MatTableDataSource<FirebaseQso>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  columnsToDisplay = [
    'timeOn',
    'contactedCall',
    'contactedName',
    'band',
    'freq',
    'mode',
    'contactedCity',
    'contactedState',
    'contactedCountry',
  ];

  constructor(private qsoService: QsoService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.qsoService.init();
    this.paginator.pageSize = 25;
    this.paginator.pageSizeOptions = [10, 25, 50, 100];
    this.qsoService.getFilteredQsos().subscribe((qsos) => {
      this.dataSource.data = qsos;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.dataSource.sortingDataAccessor = (fbq, property) => {
      switch (property) {
        case 'timeOn':
          return fbq.qso.timeOn.getTime();
        case 'contactedCall':
          return fbq.qso.contactedStation.stationCall;
        case 'contactedName':
          return fbq.qso.contactedStation.opName;
        case 'band':
          return fbq.qso.band;
        case 'freq':
          return fbq.qso.freq;
        case 'mode':
          return fbq.qso.submode ? fbq.qso.submode : fbq.qso.mode;
        case 'contactedCity':
          return fbq.qso.contactedStation.city;
        case 'contactedState':
          return fbq.qso.contactedStation.state;
        case 'contactedCountry':
          return fbq.qso.contactedStation.country;
        default:
          return 0;
      }
    };
    this.chooseColumns(document.body.clientWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.chooseColumns(event.target.innerWidth);
  }

  chooseColumns(width: number): void {
    if (width > 768) {
      this.columnsToDisplay = [
        'timeOn',
        'contactedCall',
        'contactedName',
        'band',
        'freq',
        'mode',
        'contactedCity',
        'contactedState',
        'contactedCountry',
        'qsl',
      ];
    } else if (width > 576) {
      this.columnsToDisplay = [
        'timeOn',
        'contactedCall',
        'band',
        'mode',
        'contactedState',
        'contactedCountry',
        'qsl',
      ];
    } else {
      this.columnsToDisplay = [
        'shortTimeOn',
        'contactedCall',
        'band',
        'mode',
        'contactedState',
        'shortContactedCountry',
      ];
    }
  }

  openDialog(qso: FirebaseQso): void {
    const dialogRef = this.dialog.open(QsoDetailComponent, {
      width: '800px',
      data: qso,
    });

    dialogRef.afterClosed().subscribe((dialogReturn) => {
      if (dialogReturn instanceof Observable) {
        (dialogReturn as Observable<void>).subscribe();
      }
    });
  }

  newQso(): void {
    this.openDialog({ qso: { contactedStation: {}, loggingStation: {} } });
  }

  flagFor(dxcc: number): string {
    // TODO: make a generalized reference for this
    switch (dxcc) {
      case 291:
        return '🇺🇸';
      case 1:
        return '🇨🇦';
      case 70:
        return '🇨🇺';
      case 281:
        return '🇪🇸';
      case 148:
        return '🇻🇪';
      case 50:
        return '🇲🇽';
      case 202:
        return '🇵🇷';
      case 110:
        return '🇺🇸';
      case 97:
        return '🇱🇨';
    }
  }
}
