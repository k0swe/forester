import { AuthService } from '../auth/auth.service';
import { AvatarComponent } from './avatar.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { of } from 'rxjs';

describe('AvatarComponent', () => {
  let component: AvatarComponent;
  let fixture: ComponentFixture<AvatarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AvatarComponent],
      imports: [MatMenuModule, MatDialogModule, MatSnackBarModule],
      providers: [
        {
          provide: AuthService,
          useValue: {
            user: () =>
              of({
                displayName: 'Joe Schmoe',
                email: 'joe@schmoe.net',
                photoURL: 'http://example.com/image.png',
              }),
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
