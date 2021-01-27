import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { QsoListComponent } from './qso-list.component';
import { QsoService } from '../../shared/qso/qso.service';
import { of } from 'rxjs';

describe('QsoListComponent', () => {
  let component: QsoListComponent;
  let fixture: ComponentFixture<QsoListComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [QsoListComponent],
        imports: [MatDialogModule, MatPaginatorModule, BrowserAnimationsModule],
        providers: [
          {
            provide: QsoService,
            useValue: {
              init: () => null,
              getFilteredQsos: () =>
                of([
                  { qso: { contactedStation: { contactedCall: 'N0CALL' } } },
                ]),
            },
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(QsoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
