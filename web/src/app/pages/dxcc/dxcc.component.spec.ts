import { FirebaseQso } from '../../services/qso.service';
import { DxccComponent } from './dxcc.component';

describe('DxccComponent', () => {
  it('should prefer earliest LotW-confirmed QSO for each DXCC', () => {
    const selected = DxccComponent.selectQsosByDxcc([
      makeQso({
        dxcc: 291,
        timeOn: '2025-01-01T00:00:00.000Z',
      }),
      makeQso({
        dxcc: 291,
        timeOn: '2025-02-01T00:00:00.000Z',
        lotwConfirmed: true,
      }),
      makeQso({
        dxcc: 291,
        timeOn: '2025-03-01T00:00:00.000Z',
        lotwConfirmed: true,
      }),
    ]);

    expect((selected.get(291).qso.timeOn as Date).toISOString()).toEqual(
      '2025-02-01T00:00:00.000Z',
    );
  });

  it('should fall back to earliest non-LotW QSO when no LotW confirmation exists', () => {
    const selected = DxccComponent.selectQsosByDxcc([
      makeQso({
        dxcc: 6,
        timeOn: '2025-01-01T00:00:00.000Z',
      }),
      makeQso({
        dxcc: 6,
        timeOn: '2025-02-01T00:00:00.000Z',
      }),
    ]);

    expect((selected.get(6).qso.timeOn as Date).toISOString()).toEqual(
      '2025-01-01T00:00:00.000Z',
    );
  });
});

function makeQso({
  dxcc,
  timeOn,
  lotwConfirmed,
}: {
  dxcc: number;
  timeOn: string;
  lotwConfirmed?: boolean;
}): FirebaseQso {
  return {
    qso: {
      timeOn: new Date(timeOn),
      contactedStation: {
        dxcc,
      },
      lotw: {
        receivedStatus: lotwConfirmed ? 'Y' : 'N',
      },
    },
  };
}
