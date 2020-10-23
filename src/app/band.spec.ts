import { Band } from './band';

describe('Band', () => {
  it('should map amateur frequencies to bands', () => {
    expect(Band.freqToBand(1.84)).toBe('160m');
    expect(Band.freqToBand(3.573)).toBe('80m');
    expect(Band.freqToBand(7.074)).toBe('40m');
    expect(Band.freqToBand(14.074)).toBe('20m');
    expect(Band.freqToBand(18.1)).toBe('17m');
    expect(Band.freqToBand(21.074)).toBe('15m');
    expect(Band.freqToBand(24.915)).toBe('12m');
    expect(Band.freqToBand(28.074)).toBe('10m');
    expect(Band.freqToBand(50.313)).toBe('6m');
    expect(Band.freqToBand(144.174)).toBe('2m');
    expect(Band.freqToBand(224.74)).toBe('1.25m');
    expect(Band.freqToBand(449.45)).toBe('70cm');
    expect(Band.freqToBand(927.837)).toBe('33cm');
  });

  it('should not map frequencies outside amateur bands', () => {
    expect(Band.freqToBand(27.185)).toBeNull(); // CB
    expect(Band.freqToBand(34.25)).toBeNull(); // Military
    expect(Band.freqToBand(151.82)).toBeNull(); // MURS
    expect(Band.freqToBand(462)).toBeNull(); // FRS
    expect(Band.freqToBand(1090)).toBeNull(); // ADS-B
  });
});
