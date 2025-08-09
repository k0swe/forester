import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Observable, from, toArray } from 'rxjs';
import { map, mergeAll } from 'rxjs/operators';

import { AppModule } from '../../app.module';
import { DxccRef } from '../../reference/dxcc';
import { ImportExportService } from '../../shared/import-export/import-export.service';
import { QsoDetailComponent } from '../../shared/qso-detail/qso-detail.component';
import { FirebaseQso, QsoService } from '../../shared/qso/qso.service';
import { LogbookService } from '../logbook/logbook.service';

@Component({
  selector: 'kel-qso-list',
  templateUrl: './qso-list.component.html',
  styleUrls: ['./qso-list.component.scss'],
  standalone: true,
  imports: [
    AppModule,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    MatMenuTrigger,
    MatPaginatorModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatChipsModule,
  ],
})
export class QsoListComponent implements OnInit {
  dataSource = new MatTableDataSource<FirebaseQso>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('selectedButton') selectedButton: MatButton;
  @ViewChild('download') download: ElementRef<HTMLAnchorElement>;
  selection = new SelectionModel<FirebaseQso>(true, []);

  columnsToDisplay = [
    'select',
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

  constructor(
    private dialog: MatDialog,
    private logbookService: LogbookService,
    private importExportService: ImportExportService,
    private qsoService: QsoService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.logbookService.init();
    this.logbookService.logbookId$.subscribe((id) => this.qsoService.init(id));
    this.paginator.pageSize = 25;
    this.paginator.pageSizeOptions = [10, 25, 50, 100];
    this.selection.changed.subscribe((sel) => {
      this.selectedButton.disabled = sel.source.isEmpty();
    });
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
        'select',
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
        'select',
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
    const loggingStation = this.logbookService.settings$.getValue().qthProfile;
    this.openDialog({
      qso: { contactedStation: {}, loggingStation: loggingStation },
    });
  }

  flagFor(dxcc: number): string {
    const entity = DxccRef.getById(dxcc);
    if (entity == null) {
      return '';
    }
    return entity.flag;
  }

  getPageData(): FirebaseQso[] {
    return this.dataSource._pageData(
      this.dataSource._orderData(this.dataSource.filteredData),
    );
  }

  isEntirePageSelected(): boolean {
    return this.getPageData().every((row) => this.selection.isSelected(row));
  }

  mainToggle(checkboxChange: MatCheckboxChange): void {
    this.isEntirePageSelected()
      ? this.selection.deselect(...this.getPageData())
      : this.selection.select(...this.getPageData());
  }

  checkboxLabel(row): string {
    if (!row) {
      return `${this.isEntirePageSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.id + 1
    }`;
  }

  exportSelected(): void {
    this.snackBar.open('Exporting ' + this.selection.selected.length + ' QSOs');
    const source = from(this.selection.selected).pipe(toArray());
    this.importExportService.exportAdiFor(source).subscribe({
      next: (blob) => {
        const objectURL = (window.URL || window.webkitURL).createObjectURL(
          blob,
        );
        this.download.nativeElement.setAttribute('href', objectURL);
        this.download.nativeElement.setAttribute('download', 'forester.adi');
        this.download.nativeElement.click();
      },
      error: (error) => {
        this.snackBar.open(
          'There was a problem exporting, see the Javascript console for details',
          null,
          { duration: 5000 },
        );
        console.warn(error);
      },
      complete: () => {
        this.snackBar.open('Done', null, { duration: 2000 });
      },
    });
  }

  deleteSelected(): void {
    this.snackBar.open('Deleting ' + this.selection.selected.length + ' QSOs');
    const source = from(this.selection.selected);
    const deleteObservables = source.pipe(
      map((fbq) => fbq.id),
      map((id) => this.qsoService.delete(id)),
      mergeAll(),
    );
    deleteObservables.subscribe({
      error: (error) => {
        this.snackBar.open(
          'There was a problem deleting, see the Javascript console for details',
          null,
          { duration: 5000 },
        );
        console.warn(error);
      },
      complete: () => {
        this.selection.clear();
        this.snackBar.open('Done', null, { duration: 2000 });
      },
    });
  }
}
