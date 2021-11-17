import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AppComponent } from './app.component';
import { AuthService } from './shared/auth/auth.service';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { UserSettingsService } from './shared/user-settings/user-settings.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AppComponent],
        imports: [
          RouterTestingModule,
          MatSnackBarModule,
          HttpClientTestingModule,
        ],
        providers: [
          {
            provide: AuthService,
            useValue: {
              user: () =>
                of({
                  displayName: 'Joe Schmoe',
                  email: 'joe@schmoe.net',
                  photoURL: 'http://example.com/image.png',
                  getIdToken: () => Promise.resolve('abcd1234'),
                }),
            },
          },
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
          {
            provide: UserSettingsService,
            useValue: {
              init: () => null,
              settings: () =>
                of({ callsign: 'N0CALL', qrzLogbookApiKey: 'ABCD-1234' }),
            },
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
