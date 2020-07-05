export interface Qso {
  band: string;
  dxCall: string;
  dxGrid: string;
  frequencyHz: number;
  mode: string;
  myCall: string;
  myGrid: string;
  rstReceived: string;
  rstSent: string;
  timeOff: Date;
  timeOn: Date;
}
