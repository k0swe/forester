import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {QsoListComponent} from './qso-list.component';
import {QsoService} from '../shared/qso.service';
import {of} from 'rxjs';
import {MatDialogModule} from '@angular/material/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatPaginatorModule} from '@angular/material/paginator';

describe('QsosComponent', () => {
  let component: QsoListComponent;
  let fixture: ComponentFixture<QsoListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [QsoListComponent],
      imports: [
        MatDialogModule,
        MatPaginatorModule,
        BrowserAnimationsModule
      ],
      providers: [
        {
          provide: QsoService, useValue: {
            getFilteredQsos: () => of({contactedCall: 'N0CALL'})
          }
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QsoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
