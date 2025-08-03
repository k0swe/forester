import { TestBed } from '@angular/core/testing';

import { QsoService } from './qso.service';

describe('QsoService', () => {
  let service: QsoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QsoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
