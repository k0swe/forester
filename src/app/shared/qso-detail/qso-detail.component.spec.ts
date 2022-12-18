import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { QsoDetailComponent } from './qso-detail.component';

describe('QsoDetailComponent', () => {
  let component: QsoDetailComponent;
  let fixture: ComponentFixture<QsoDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [QsoDetailComponent],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MatAutocompleteModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        ReactiveFormsModule,
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            qso: {
              band: '20m',
              freq: 14.074,
              mode: 'FT8',
              timeOn: new Date(),
              timeOff: new Date(),
            },
          },
        },
        { provide: MatDialogRef, useValue: {} },
        {
          provide: AngularFireAuth,
          useValue: {
            signInWithPopup: () => null,
          },
        },
        {
          provide: AngularFirestore,
          useValue: {
            doc: () => null,
          },
        },
      ],
    }).compileComponents();
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
