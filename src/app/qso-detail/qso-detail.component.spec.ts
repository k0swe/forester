import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {QsoDetailComponent} from './qso-detail.component';
import {Qso} from '../qso';
import {Qso as PbQso} from 'adif-pb/adif_pb';
import {Timestamp} from 'google-protobuf/google/protobuf/timestamp_pb';

describe('QsoDetailComponent', () => {
  let component: QsoDetailComponent;
  let fixture: ComponentFixture<QsoDetailComponent>;

  beforeEach(waitForAsync(() => {
    const pbQso = new PbQso();
    pbQso.setBand('20m');
    pbQso.setFreq(14.074);
    pbQso.setMode('FT8');
    pbQso.setTimeOn(new Timestamp().setSeconds(new Date().getTime() / 1000));
    pbQso.setTimeOff(new Timestamp().setSeconds(new Date().getTime() / 1000));
    TestBed.configureTestingModule({
      declarations: [QsoDetailComponent],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            qso: Qso.fromProto(pbQso)
          },
        },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QsoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
