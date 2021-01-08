// These types are copied from https://github.com/k0swe/adif-json-protobuf,
// and then the AsObject's are converted to interfaces with nullable fields.
// See https://github.com/k0swe/forester/issues/7 for why this is done.

// Amateur Radio Data Interchange Format
export interface Adif {
  header?: Header;
  qsos?: Array<Qso>;
}

// ADIF header metadata
export interface Header {
  adifVersion?: string;
  createdTimestamp?: Date;
  programId?: string;
  programVersion?: string;
}

// Field representing one radio contact, or QSO.
export interface Qso {
  loggingStation?: Station;
  contactedStation?: Station;
  propagation?: Propagation;
  band?: string;
  bandRx?: string;
  freq?: number;
  freqRx?: number;
  mode?: string;
  submode?: string;
  distanceKm?: number;
  timeOn?: Date;
  timeOff?: Date;
  random?: boolean;
  rstReceived?: string;
  rstSent?: string;
  swl?: boolean;
  complete?: string;
  comment?: string;
  notes?: string;
  contest?: ContestData;
  awardSubmitted?: Array<string>;
  awardGranted?: Array<string>;
  creditSubmitted?: Array<Credit>;
  creditGranted?: Array<Credit>;
  publicKey?: string;
  clublog?: Upload;
  hrdlog?: Upload;
  qrzcom?: Upload;
  eqsl?: Qsl;
  lotw?: Qsl;
  card?: Qsl;
  appDefined?: { [key: string]: string };
}

// Fields pertaining to one of the radio stations in a QSO.
export interface Station {
  opCall?: string;
  opName?: string;
  gridSquare?: string;
  latitude?: number;
  longitude?: number;
  power?: number;
  rig?: string;
  antenna?: string;
  antennaAzimuth?: number;
  antennaElevation?: number;
  ownerCall?: string;
  stationCall?: string;
  age?: number;
  silentKey?: boolean;
  qslVia?: string;
  address?: string;
  street?: string;
  city?: string;
  postalCode?: string;
  county?: string;
  state?: string;
  country?: string;
  dxcc?: number;
  continent?: string;
  email?: string;
  web?: string;
  cqZone?: number;
  ituZone?: number;
  darcDok?: string;
  fists?: number;
  fistsCc?: number;
  iota?: string;
  iotaIslandId?: number;
  pfx?: string;
  region?: string;
  skcc?: string;
  sig?: string;
  sigInfo?: string;
  sotaRef?: string;
  tenTen?: number;
  usacaCounties?: string;
  uksmg?: number;
  vuccGrids?: string;
}

// Propagation details.
export interface Propagation {
  propagationMode?: string;
  aIndex?: number;
  kIndex?: number;
  solarFluxIndex?: number;
  antPath?: string;
  forceInit?: boolean;
  maxBursts?: number;
  meteorShowerName?: string;
  nrBursts?: number;
  nrPings?: number;
  satMode?: string;
  satName?: string;
}

export interface ContestData {
  contestId?: string;
  serialSent?: string;
  serialReceived?: string;
  arrlSection?: string;
  stationClass?: string;
  check?: string;
  precedence?: string;
}

// Credit information for amateur radio awards.
export interface Credit {
  credit?: string;
  qslMedium?: string;
}

// Upload metadata for online logbook services.
export interface Upload {
  uploadDate?: Date;
  uploadStatus?: UploadStatus;
}

export enum UploadStatus {
  UNKNOWN = 0,
  UPLOAD_COMPLETE = 1,
  DO_NOT_UPLOAD = 2,
  MODIFIED_AFTER_UPLOAD = 3,
}

// Information to confirm (QSL) a radio contact.
export interface Qsl {
  sentDate?: Date;
  sentStatus?: string;
  sentVia?: string;
  receivedDate?: Date;
  receivedStatus?: string;
  receivedVia?: string;
  receivedMessage?: string;
}
