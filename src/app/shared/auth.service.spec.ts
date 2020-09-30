import {AngularFireAuth} from '@angular/fire/auth';
import {AuthService} from './auth.service';
import {TestBed} from '@angular/core/testing';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AngularFireAuth, useValue: {
            signInWithPopup: () => null
          }
        },
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
