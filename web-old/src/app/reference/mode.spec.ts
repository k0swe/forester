import { Modes } from './mode';

describe('Modes', () => {
  it('should find amateur modes', () => {
    expect(Modes.findMode('CW')).toEqual({ mode: 'CW' });
    expect(Modes.findMode('SSB')).toEqual({ mode: 'SSB' });
    expect(Modes.findMode('USB')).toEqual({ mode: 'SSB', submode: 'USB' });
    expect(Modes.findMode('LSB')).toEqual({ mode: 'SSB', submode: 'LSB' });
    expect(Modes.findMode('FT8')).toEqual({ mode: 'FT8' });
    expect(Modes.findMode('JS8')).toEqual({ mode: 'MFSK', submode: 'JS8' });
  });

  it('should not find undefined modes', () => {
    expect(Modes.findMode('PACTOR')).toBeNull(); // Should be PAC
    expect(Modes.findMode('GSM')).toBeNull(); // Cell phone
    expect(Modes.findMode('CDMA')).toBeNull(); // Cell phone
    expect(Modes.findMode('LTE')).toBeNull(); // Cell phone
  });
});
