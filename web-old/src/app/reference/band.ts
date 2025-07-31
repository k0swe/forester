/**
 * All of the legal amateur radio bands and their frequency ranges as defined in
 * ADIF 3.1.1 section "III.B.4 Band Enumeration".
 */
export class Band {
  // map of amateur band name to frequency range in megahertz
  // (lower freq inclusive, upper freq exclusive)
  private static readonly bandMap: object = {
    '2190m': [0.1357, 0.1378],
    '630m': [0.472, 0.479],
    '560m': [0.501, 0.504],
    '160m': [1.8, 2.0],
    '80m': [3.5, 4.0],
    '60m': [5.06, 5.45],
    '40m': [7.0, 7.3],
    '30m': [10.1, 10.15],
    '20m': [14.0, 14.35],
    '17m': [18.068, 18.168],
    '15m': [21.0, 21.45],
    '12m': [24.89, 24.99],
    '10m': [28.0, 29.7],
    '8m': [40, 45],
    '6m': [50, 54],
    '5m': [54, 69.9],
    '4m': [70, 71],
    '2m': [144, 148],
    '1.25m': [222, 225],
    '70cm': [420, 450],
    '33cm': [902, 928],
    '23cm': [1240, 1300],
    '13cm': [2300, 2450],
    '9cm': [3300, 3500],
    '6cm': [5650, 5925],
    '3cm': [10000, 10500],
    '1.25cm': [24000, 24250],
    '6mm': [47000, 47200],
    '4mm': [75500, 81000],
    '2.5mm': [119980, 120020],
    '2mm': [142000, 149000],
    '1mm': [241000, 250000],
  };

  public static readonly bands = Object.keys(Band.bandMap);

  /**
   * Given a frequency in megahertz, find the name of the amateur radio band
   * that contains that frequency, or null if it's not in an amateur band.
   */
  public static freqToBand(freq: number): string | null {
    let retVal = null;
    this.bands.forEach((band) => {
      const lowerLimit = this.bandMap[band][0];
      const upperLimit = this.bandMap[band][1];
      if (lowerLimit <= freq && upperLimit > freq) {
        retVal = band;
      }
    });
    return retVal;
  }
}
