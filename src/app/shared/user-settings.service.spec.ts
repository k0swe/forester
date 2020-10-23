import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { TestBed } from '@angular/core/testing';
import { UserSettingsService } from './user-settings.service';
import { of } from 'rxjs';

describe('UserSettingsService', () => {
  let service: UserSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
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
        {
          provide: AngularFirestore,
          useValue: {
            doc: () => null,
          },
        },
      ],
    });
    service = TestBed.inject(UserSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
