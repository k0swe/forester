import { TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { ZonedDateTime, nativeJs } from 'js-joda';
import { firstValueFrom } from 'rxjs';

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

function makeWasQso(
  timeOn: Date,
  state: string,
  qslReceived = true,
): FirebaseQso {
  return {
    id: `test-${timeOn.toISOString()}-${state}`,
    qso: {
      timeOn,
      band: '20m',
      mode: 'FT8',
      contactedStation: {
        stationCall: 'W1AW',
        country: 'United States',
        state,
      },
      loggingStation: { stationCall: 'K0SWE' },
      lotw: { receivedStatus: qslReceived ? 'Y' : 'N' },
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

  describe('Worked All States time range filtering', () => {
    it('should include QSOs on America 250 UTC boundaries', async () => {
      const start = new Date('2026-01-01T00:00:00.000Z');
      const end = new Date('2026-12-31T23:59:59.999Z');
      (service as any).qsos$.next([makeWasQso(end, 'CO'), makeWasQso(start, 'CO')]);

      const result = await firstValueFrom(
        service.findWASQso({
          country: 'United States',
          state: 'CO',
          mode: 'mixed',
          band: 'mixed',
          startTimeOn: start,
          endTimeOn: end,
        }),
      );

      expect(result).toBeDefined();
      expect((result?.qso.timeOn as Date).toISOString()).toBe(start.toISOString());
    });

    it('should exclude QSOs outside America 250 UTC range', async () => {
      const before = new Date('2025-12-31T23:59:59.999Z');
      const after = new Date('2027-01-01T00:00:00.000Z');
      const start = new Date('2026-01-01T00:00:00.000Z');
      const end = new Date('2026-12-31T23:59:59.999Z');
      (service as any).qsos$.next([makeWasQso(before, 'WA'), makeWasQso(after, 'WA')]);

      const result = await firstValueFrom(
        service.findWASQso({
          country: 'United States',
          state: 'WA',
          mode: 'mixed',
          band: 'mixed',
          startTimeOn: start,
          endTimeOn: end,
        }),
      );

      expect(result).toBeUndefined();
    });
  });
});
