import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { QsoDetailComponent } from './qso-detail.component';

describe('QsoDetailComponent', () => {
  let component: QsoDetailComponent;
  let fixture: ComponentFixture<QsoDetailComponent>;

  beforeEach(
    waitForAsync(() => {
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
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(QsoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
