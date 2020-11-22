import { AuthService } from '../shared/auth.service';
import { AvatarComponent } from './avatar.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';

describe('AvatarComponent', () => {
  let component: AvatarComponent;
  let fixture: ComponentFixture<AvatarComponent>;

  beforeEach(
    waitForAsync(() => {
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
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
