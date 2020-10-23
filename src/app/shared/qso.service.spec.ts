import { TestBed } from '@angular/core/testing';

import { QsoService } from './qso.service';
import { AuthService } from './auth.service';
import { of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

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
