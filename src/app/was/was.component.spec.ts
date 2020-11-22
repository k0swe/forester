import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GoogleMapsModule } from '@angular/google-maps';
import { QsoService } from '../shared/qso.service';
import { WasComponent } from './was.component';
import { of } from 'rxjs';

describe('WasComponent', () => {
  let component: WasComponent;
  let fixture: ComponentFixture<WasComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [WasComponent],
        imports: [GoogleMapsModule],
        providers: [
          {
            provide: QsoService,
            useValue: {
              init: () => null,
              findWASQso: () =>
                of({ qso: { contactedStation: { contactedCall: 'N0CALL' } } }),
            },
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(WasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
