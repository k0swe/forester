import { TestBed } from '@angular/core/testing';

import { LogbookService } from './logbook.service';

describe('LogbookService', () => {
  let service: LogbookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogbookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
