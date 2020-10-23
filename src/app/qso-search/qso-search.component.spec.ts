import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { QsoSearchComponent } from './qso-search.component';
import { QsoService } from '../shared/qso.service';
import { of } from 'rxjs';

describe('QsoSearchComponent', () => {
  let component: QsoSearchComponent;
  let fixture: ComponentFixture<QsoSearchComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [QsoSearchComponent],
        providers: [
          {
            provide: QsoService,
            useValue: {
              init: () => null,
              getFilteredQsos: () => of({ contactedCall: 'N0CALL' }),
            },
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(QsoSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
