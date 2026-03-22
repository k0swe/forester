import { TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { ZonedDateTime, nativeJs } from 'js-joda';

import { FilterCriteria, FirebaseQso, QsoService } from './qso.service';

function makeQso(timeOn: Date): FirebaseQso {
  return {
    id: 'test-id',
    qso: {
      timeOn,
      contactedStation: { stationCall: 'W1AW' },
      loggingStation: { stationCall: 'K0SWE' },
    } as any,
  };
}

describe('QsoService', () => {
  let service: QsoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Firestore, useValue: {} },
        { provide: Auth, useValue: {} },
      ],
    });
    service = TestBed.inject(QsoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('date filtering', () => {
    it('should include a QSO whose timeOn equals dateBefore', () => {
      const date = new Date('2023-01-01T12:00:00Z');
      const criteria: FilterCriteria = {
        dateBefore: ZonedDateTime.from(nativeJs(date)),
      };
      const result = (service as any).filterQsos([makeQso(date)], criteria);
      expect(result.length).toBe(1);
    });

    it('should exclude a QSO whose timeOn is after dateBefore', () => {
      const date = new Date('2023-01-01T12:00:00Z');
      const laterDate = new Date('2023-01-01T13:00:00Z');
      const criteria: FilterCriteria = {
        dateBefore: ZonedDateTime.from(nativeJs(date)),
      };
      const result = (service as any).filterQsos([makeQso(laterDate)], criteria);
      expect(result.length).toBe(0);
    });

    it('should include a QSO whose timeOn is before dateBefore', () => {
      const date = new Date('2023-01-01T12:00:00Z');
      const earlierDate = new Date('2023-01-01T11:00:00Z');
      const criteria: FilterCriteria = {
        dateBefore: ZonedDateTime.from(nativeJs(date)),
      };
      const result = (service as any).filterQsos([makeQso(earlierDate)], criteria);
      expect(result.length).toBe(1);
    });

    it('should exclude a QSO whose timeOn equals dateAfter', () => {
      const date = new Date('2023-01-01T12:00:00Z');
      const criteria: FilterCriteria = {
        dateAfter: ZonedDateTime.from(nativeJs(date)),
      };
      const result = (service as any).filterQsos([makeQso(date)], criteria);
      expect(result.length).toBe(0);
    });
  });
});
