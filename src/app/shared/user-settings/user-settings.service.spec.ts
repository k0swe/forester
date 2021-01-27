import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UserSettingsService } from './user-settings.service';

describe('UserSettingsService', () => {
  let service: UserSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
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
    });
    service = TestBed.inject(UserSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
