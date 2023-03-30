import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../auth/auth.service';
import { QsoService } from './qso.service';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

describe('QsoService', () => {
  let service: QsoService;

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
    service = TestBed.inject(QsoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
