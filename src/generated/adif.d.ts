import * as $protobuf from "protobufjs";
import * as Long from 'long';
/** Namespace adif. */
export namespace adif {

    /** Properties of an Adif. */
    interface IAdif {

        /** Adif header */
        header?: (adif.IHeader|null);

        /** Adif qsos */
        qsos?: (adif.IQso[]|null);
    }

    /** Represents an Adif. */
    class Adif implements IAdif {

        /**
         * Constructs a new Adif.
         * @param [properties] Properties to set
         */
        constructor(properties?: adif.IAdif);

        /** Adif header. */
        public header?: (adif.IHeader|null);

        /** Adif qsos. */
        public qsos: adif.IQso[];

        /**
         * Creates a new Adif instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Adif instance
         */
        public static create(properties?: adif.IAdif): adif.Adif;

        /**
         * Encodes the specified Adif message. Does not implicitly {@link adif.Adif.verify|verify} messages.
         * @param message Adif message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: adif.IAdif, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Adif message, length delimited. Does not implicitly {@link adif.Adif.verify|verify} messages.
         * @param message Adif message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: adif.IAdif, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Adif message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Adif
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): adif.Adif;

        /**
         * Decodes an Adif message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Adif
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): adif.Adif;

        /**
         * Verifies an Adif message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an Adif message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Adif
         */
        public static fromObject(object: { [k: string]: any }): adif.Adif;

        /**
         * Creates a plain object from an Adif message. Also converts values to other types if specified.
         * @param message Adif
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: adif.Adif, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Adif to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Header. */
    interface IHeader {

        /** Header adifVersion */
        adifVersion?: (string|null);

        /** Header createdTimestamp */
        createdTimestamp?: (google.protobuf.ITimestamp|null);

        /** Header programId */
        programId?: (string|null);

        /** Header programVersion */
        programVersion?: (string|null);
    }

    /** Represents a Header. */
    class Header implements IHeader {

        /**
         * Constructs a new Header.
         * @param [properties] Properties to set
         */
        constructor(properties?: adif.IHeader);

        /** Header adifVersion. */
        public adifVersion: string;

        /** Header createdTimestamp. */
        public createdTimestamp?: (google.protobuf.ITimestamp|null);

        /** Header programId. */
        public programId: string;

        /** Header programVersion. */
        public programVersion: string;

        /**
         * Creates a new Header instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Header instance
         */
        public static create(properties?: adif.IHeader): adif.Header;

        /**
         * Encodes the specified Header message. Does not implicitly {@link adif.Header.verify|verify} messages.
         * @param message Header message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: adif.IHeader, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Header message, length delimited. Does not implicitly {@link adif.Header.verify|verify} messages.
         * @param message Header message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: adif.IHeader, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Header message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Header
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): adif.Header;

        /**
         * Decodes a Header message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Header
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): adif.Header;

        /**
         * Verifies a Header message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Header message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Header
         */
        public static fromObject(object: { [k: string]: any }): adif.Header;

        /**
         * Creates a plain object from a Header message. Also converts values to other types if specified.
         * @param message Header
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: adif.Header, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Header to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Qso. */
    interface IQso {

        /** Qso loggingStation */
        loggingStation?: (adif.IStation|null);

        /** Qso contactedStation */
        contactedStation?: (adif.IStation|null);

        /** Qso propagation */
        propagation?: (adif.IPropagation|null);

        /** Qso band */
        band?: (string|null);

        /** Qso bandRx */
        bandRx?: (string|null);

        /** Qso freq */
        freq?: (number|null);

        /** Qso freqRx */
        freqRx?: (number|null);

        /** Qso mode */
        mode?: (string|null);

        /** Qso submode */
        submode?: (string|null);

        /** Qso distanceKm */
        distanceKm?: (number|null);

        /** Qso timeOn */
        timeOn?: (google.protobuf.ITimestamp|null);

        /** Qso timeOff */
        timeOff?: (google.protobuf.ITimestamp|null);

        /** Qso random */
        random?: (boolean|null);

        /** Qso rstReceived */
        rstReceived?: (string|null);

        /** Qso rstSent */
        rstSent?: (string|null);

        /** Qso swl */
        swl?: (boolean|null);

        /** Qso complete */
        complete?: (string|null);

        /** Qso comment */
        comment?: (string|null);

        /** Qso notes */
        notes?: (string|null);

        /** Qso contest */
        contest?: (adif.IContestData|null);

        /** Qso awardSubmitted */
        awardSubmitted?: (string[]|null);

        /** Qso awardGranted */
        awardGranted?: (string[]|null);

        /** Qso creditSubmitted */
        creditSubmitted?: (adif.ICredit[]|null);

        /** Qso creditGranted */
        creditGranted?: (adif.ICredit[]|null);

        /** Qso publicKey */
        publicKey?: (string|null);

        /** Qso clublog */
        clublog?: (adif.IUpload|null);

        /** Qso hdrlog */
        hdrlog?: (adif.IUpload|null);

        /** Qso qrzcom */
        qrzcom?: (adif.IUpload|null);

        /** Qso eqsl */
        eqsl?: (adif.IQsl|null);

        /** Qso lotw */
        lotw?: (adif.IQsl|null);

        /** Qso card */
        card?: (adif.IQsl|null);
    }

    /** Represents a Qso. */
    class Qso implements IQso {

        /**
         * Constructs a new Qso.
         * @param [properties] Properties to set
         */
        constructor(properties?: adif.IQso);

        /** Qso loggingStation. */
        public loggingStation?: (adif.IStation|null);

        /** Qso contactedStation. */
        public contactedStation?: (adif.IStation|null);

        /** Qso propagation. */
        public propagation?: (adif.IPropagation|null);

        /** Qso band. */
        public band: string;

        /** Qso bandRx. */
        public bandRx: string;

        /** Qso freq. */
        public freq: number;

        /** Qso freqRx. */
        public freqRx: number;

        /** Qso mode. */
        public mode: string;

        /** Qso submode. */
        public submode: string;

        /** Qso distanceKm. */
        public distanceKm: number;

        /** Qso timeOn. */
        public timeOn?: (google.protobuf.ITimestamp|null);

        /** Qso timeOff. */
        public timeOff?: (google.protobuf.ITimestamp|null);

        /** Qso random. */
        public random: boolean;

        /** Qso rstReceived. */
        public rstReceived: string;

        /** Qso rstSent. */
        public rstSent: string;

        /** Qso swl. */
        public swl: boolean;

        /** Qso complete. */
        public complete: string;

        /** Qso comment. */
        public comment: string;

        /** Qso notes. */
        public notes: string;

        /** Qso contest. */
        public contest?: (adif.IContestData|null);

        /** Qso awardSubmitted. */
        public awardSubmitted: string[];

        /** Qso awardGranted. */
        public awardGranted: string[];

        /** Qso creditSubmitted. */
        public creditSubmitted: adif.ICredit[];

        /** Qso creditGranted. */
        public creditGranted: adif.ICredit[];

        /** Qso publicKey. */
        public publicKey: string;

        /** Qso clublog. */
        public clublog?: (adif.IUpload|null);

        /** Qso hdrlog. */
        public hdrlog?: (adif.IUpload|null);

        /** Qso qrzcom. */
        public qrzcom?: (adif.IUpload|null);

        /** Qso eqsl. */
        public eqsl?: (adif.IQsl|null);

        /** Qso lotw. */
        public lotw?: (adif.IQsl|null);

        /** Qso card. */
        public card?: (adif.IQsl|null);

        /**
         * Creates a new Qso instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Qso instance
         */
        public static create(properties?: adif.IQso): adif.Qso;

        /**
         * Encodes the specified Qso message. Does not implicitly {@link adif.Qso.verify|verify} messages.
         * @param message Qso message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: adif.IQso, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Qso message, length delimited. Does not implicitly {@link adif.Qso.verify|verify} messages.
         * @param message Qso message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: adif.IQso, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Qso message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Qso
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): adif.Qso;

        /**
         * Decodes a Qso message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Qso
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): adif.Qso;

        /**
         * Verifies a Qso message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Qso message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Qso
         */
        public static fromObject(object: { [k: string]: any }): adif.Qso;

        /**
         * Creates a plain object from a Qso message. Also converts values to other types if specified.
         * @param message Qso
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: adif.Qso, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Qso to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Station. */
    interface IStation {

        /** Station opCall */
        opCall?: (string|null);

        /** Station opName */
        opName?: (string|null);

        /** Station gridSquare */
        gridSquare?: (string|null);

        /** Station latitude */
        latitude?: (number|null);

        /** Station longitude */
        longitude?: (number|null);

        /** Station power */
        power?: (number|null);

        /** Station rig */
        rig?: (string|null);

        /** Station antenna */
        antenna?: (string|null);

        /** Station antennaAzimuth */
        antennaAzimuth?: (number|null);

        /** Station antennaElevation */
        antennaElevation?: (number|null);

        /** Station ownerCall */
        ownerCall?: (string|null);

        /** Station stationCall */
        stationCall?: (string|null);

        /** Station age */
        age?: (number|null);

        /** Station silentKey */
        silentKey?: (boolean|null);

        /** Station qslVia */
        qslVia?: (string|null);

        /** Station address */
        address?: (string|null);

        /** Station street */
        street?: (string|null);

        /** Station city */
        city?: (string|null);

        /** Station postalCode */
        postalCode?: (string|null);

        /** Station county */
        county?: (string|null);

        /** Station state */
        state?: (string|null);

        /** Station country */
        country?: (string|null);

        /** Station dxcc */
        dxcc?: (number|null);

        /** Station continent */
        continent?: (string|null);

        /** Station email */
        email?: (string|null);

        /** Station web */
        web?: (string|null);

        /** Station cqZone */
        cqZone?: (number|null);

        /** Station ituZone */
        ituZone?: (number|null);

        /** Station darcDok */
        darcDok?: (string|null);

        /** Station fists */
        fists?: (number|null);

        /** Station fistsCc */
        fistsCc?: (number|null);

        /** Station iota */
        iota?: (string|null);

        /** Station iotaIslandId */
        iotaIslandId?: (number|null);

        /** Station pfx */
        pfx?: (string|null);

        /** Station region */
        region?: (string|null);

        /** Station skcc */
        skcc?: (string|null);

        /** Station sig */
        sig?: (string|null);

        /** Station sigInfo */
        sigInfo?: (string|null);

        /** Station sotaRef */
        sotaRef?: (string|null);

        /** Station tenTen */
        tenTen?: (number|null);

        /** Station usacaCounties */
        usacaCounties?: (string|null);

        /** Station uksmg */
        uksmg?: (number|null);

        /** Station vuccGrids */
        vuccGrids?: (string|null);
    }

    /** Represents a Station. */
    class Station implements IStation {

        /**
         * Constructs a new Station.
         * @param [properties] Properties to set
         */
        constructor(properties?: adif.IStation);

        /** Station opCall. */
        public opCall: string;

        /** Station opName. */
        public opName: string;

        /** Station gridSquare. */
        public gridSquare: string;

        /** Station latitude. */
        public latitude: number;

        /** Station longitude. */
        public longitude: number;

        /** Station power. */
        public power: number;

        /** Station rig. */
        public rig: string;

        /** Station antenna. */
        public antenna: string;

        /** Station antennaAzimuth. */
        public antennaAzimuth: number;

        /** Station antennaElevation. */
        public antennaElevation: number;

        /** Station ownerCall. */
        public ownerCall: string;

        /** Station stationCall. */
        public stationCall: string;

        /** Station age. */
        public age: number;

        /** Station silentKey. */
        public silentKey: boolean;

        /** Station qslVia. */
        public qslVia: string;

        /** Station address. */
        public address: string;

        /** Station street. */
        public street: string;

        /** Station city. */
        public city: string;

        /** Station postalCode. */
        public postalCode: string;

        /** Station county. */
        public county: string;

        /** Station state. */
        public state: string;

        /** Station country. */
        public country: string;

        /** Station dxcc. */
        public dxcc: number;

        /** Station continent. */
        public continent: string;

        /** Station email. */
        public email: string;

        /** Station web. */
        public web: string;

        /** Station cqZone. */
        public cqZone: number;

        /** Station ituZone. */
        public ituZone: number;

        /** Station darcDok. */
        public darcDok: string;

        /** Station fists. */
        public fists: number;

        /** Station fistsCc. */
        public fistsCc: number;

        /** Station iota. */
        public iota: string;

        /** Station iotaIslandId. */
        public iotaIslandId: number;

        /** Station pfx. */
        public pfx: string;

        /** Station region. */
        public region: string;

        /** Station skcc. */
        public skcc: string;

        /** Station sig. */
        public sig: string;

        /** Station sigInfo. */
        public sigInfo: string;

        /** Station sotaRef. */
        public sotaRef: string;

        /** Station tenTen. */
        public tenTen: number;

        /** Station usacaCounties. */
        public usacaCounties: string;

        /** Station uksmg. */
        public uksmg: number;

        /** Station vuccGrids. */
        public vuccGrids: string;

        /**
         * Creates a new Station instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Station instance
         */
        public static create(properties?: adif.IStation): adif.Station;

        /**
         * Encodes the specified Station message. Does not implicitly {@link adif.Station.verify|verify} messages.
         * @param message Station message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: adif.IStation, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Station message, length delimited. Does not implicitly {@link adif.Station.verify|verify} messages.
         * @param message Station message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: adif.IStation, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Station message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Station
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): adif.Station;

        /**
         * Decodes a Station message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Station
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): adif.Station;

        /**
         * Verifies a Station message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Station message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Station
         */
        public static fromObject(object: { [k: string]: any }): adif.Station;

        /**
         * Creates a plain object from a Station message. Also converts values to other types if specified.
         * @param message Station
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: adif.Station, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Station to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Propagation. */
    interface IPropagation {

        /** Propagation propagationMode */
        propagationMode?: (string|null);

        /** Propagation aIndex */
        aIndex?: (number|null);

        /** Propagation kIndex */
        kIndex?: (number|null);

        /** Propagation solarFluxIndex */
        solarFluxIndex?: (number|null);

        /** Propagation antPath */
        antPath?: (string|null);

        /** Propagation forceInit */
        forceInit?: (boolean|null);

        /** Propagation maxBursts */
        maxBursts?: (number|null);

        /** Propagation meteorShowerName */
        meteorShowerName?: (string|null);

        /** Propagation nrBursts */
        nrBursts?: (number|null);

        /** Propagation nrPings */
        nrPings?: (number|null);

        /** Propagation satMode */
        satMode?: (string|null);

        /** Propagation satName */
        satName?: (string|null);
    }

    /** Represents a Propagation. */
    class Propagation implements IPropagation {

        /**
         * Constructs a new Propagation.
         * @param [properties] Properties to set
         */
        constructor(properties?: adif.IPropagation);

        /** Propagation propagationMode. */
        public propagationMode: string;

        /** Propagation aIndex. */
        public aIndex: number;

        /** Propagation kIndex. */
        public kIndex: number;

        /** Propagation solarFluxIndex. */
        public solarFluxIndex: number;

        /** Propagation antPath. */
        public antPath: string;

        /** Propagation forceInit. */
        public forceInit: boolean;

        /** Propagation maxBursts. */
        public maxBursts: number;

        /** Propagation meteorShowerName. */
        public meteorShowerName: string;

        /** Propagation nrBursts. */
        public nrBursts: number;

        /** Propagation nrPings. */
        public nrPings: number;

        /** Propagation satMode. */
        public satMode: string;

        /** Propagation satName. */
        public satName: string;

        /**
         * Creates a new Propagation instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Propagation instance
         */
        public static create(properties?: adif.IPropagation): adif.Propagation;

        /**
         * Encodes the specified Propagation message. Does not implicitly {@link adif.Propagation.verify|verify} messages.
         * @param message Propagation message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: adif.IPropagation, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Propagation message, length delimited. Does not implicitly {@link adif.Propagation.verify|verify} messages.
         * @param message Propagation message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: adif.IPropagation, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Propagation message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Propagation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): adif.Propagation;

        /**
         * Decodes a Propagation message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Propagation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): adif.Propagation;

        /**
         * Verifies a Propagation message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Propagation message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Propagation
         */
        public static fromObject(object: { [k: string]: any }): adif.Propagation;

        /**
         * Creates a plain object from a Propagation message. Also converts values to other types if specified.
         * @param message Propagation
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: adif.Propagation, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Propagation to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ContestData. */
    interface IContestData {

        /** ContestData contestId */
        contestId?: (string|null);

        /** ContestData serialSent */
        serialSent?: (string|null);

        /** ContestData serialReceived */
        serialReceived?: (string|null);

        /** ContestData arrlSection */
        arrlSection?: (string|null);

        /** ContestData stationClass */
        stationClass?: (string|null);

        /** ContestData check */
        check?: (string|null);

        /** ContestData precedence */
        precedence?: (string|null);
    }

    /** Represents a ContestData. */
    class ContestData implements IContestData {

        /**
         * Constructs a new ContestData.
         * @param [properties] Properties to set
         */
        constructor(properties?: adif.IContestData);

        /** ContestData contestId. */
        public contestId: string;

        /** ContestData serialSent. */
        public serialSent: string;

        /** ContestData serialReceived. */
        public serialReceived: string;

        /** ContestData arrlSection. */
        public arrlSection: string;

        /** ContestData stationClass. */
        public stationClass: string;

        /** ContestData check. */
        public check: string;

        /** ContestData precedence. */
        public precedence: string;

        /**
         * Creates a new ContestData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ContestData instance
         */
        public static create(properties?: adif.IContestData): adif.ContestData;

        /**
         * Encodes the specified ContestData message. Does not implicitly {@link adif.ContestData.verify|verify} messages.
         * @param message ContestData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: adif.IContestData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ContestData message, length delimited. Does not implicitly {@link adif.ContestData.verify|verify} messages.
         * @param message ContestData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: adif.IContestData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ContestData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ContestData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): adif.ContestData;

        /**
         * Decodes a ContestData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ContestData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): adif.ContestData;

        /**
         * Verifies a ContestData message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ContestData message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ContestData
         */
        public static fromObject(object: { [k: string]: any }): adif.ContestData;

        /**
         * Creates a plain object from a ContestData message. Also converts values to other types if specified.
         * @param message ContestData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: adif.ContestData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ContestData to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Credit. */
    interface ICredit {

        /** Credit credit */
        credit?: (string|null);

        /** Credit qslMedium */
        qslMedium?: (string|null);
    }

    /** Represents a Credit. */
    class Credit implements ICredit {

        /**
         * Constructs a new Credit.
         * @param [properties] Properties to set
         */
        constructor(properties?: adif.ICredit);

        /** Credit credit. */
        public credit: string;

        /** Credit qslMedium. */
        public qslMedium: string;

        /**
         * Creates a new Credit instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Credit instance
         */
        public static create(properties?: adif.ICredit): adif.Credit;

        /**
         * Encodes the specified Credit message. Does not implicitly {@link adif.Credit.verify|verify} messages.
         * @param message Credit message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: adif.ICredit, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Credit message, length delimited. Does not implicitly {@link adif.Credit.verify|verify} messages.
         * @param message Credit message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: adif.ICredit, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Credit message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Credit
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): adif.Credit;

        /**
         * Decodes a Credit message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Credit
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): adif.Credit;

        /**
         * Verifies a Credit message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Credit message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Credit
         */
        public static fromObject(object: { [k: string]: any }): adif.Credit;

        /**
         * Creates a plain object from a Credit message. Also converts values to other types if specified.
         * @param message Credit
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: adif.Credit, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Credit to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an Upload. */
    interface IUpload {

        /** Upload uploadDate */
        uploadDate?: (google.protobuf.ITimestamp|null);

        /** Upload uploadStatus */
        uploadStatus?: (adif.UploadStatus|null);
    }

    /** Represents an Upload. */
    class Upload implements IUpload {

        /**
         * Constructs a new Upload.
         * @param [properties] Properties to set
         */
        constructor(properties?: adif.IUpload);

        /** Upload uploadDate. */
        public uploadDate?: (google.protobuf.ITimestamp|null);

        /** Upload uploadStatus. */
        public uploadStatus: adif.UploadStatus;

        /**
         * Creates a new Upload instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Upload instance
         */
        public static create(properties?: adif.IUpload): adif.Upload;

        /**
         * Encodes the specified Upload message. Does not implicitly {@link adif.Upload.verify|verify} messages.
         * @param message Upload message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: adif.IUpload, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Upload message, length delimited. Does not implicitly {@link adif.Upload.verify|verify} messages.
         * @param message Upload message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: adif.IUpload, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Upload message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Upload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): adif.Upload;

        /**
         * Decodes an Upload message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Upload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): adif.Upload;

        /**
         * Verifies an Upload message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an Upload message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Upload
         */
        public static fromObject(object: { [k: string]: any }): adif.Upload;

        /**
         * Creates a plain object from an Upload message. Also converts values to other types if specified.
         * @param message Upload
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: adif.Upload, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Upload to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** UploadStatus enum. */
    enum UploadStatus {
        UNKNOWN = 0,
        UPLOAD_COMPLETE = 1,
        DO_NOT_UPLOAD = 2,
        MODIFIED_AFTER_UPLOAD = 3
    }

    /** Properties of a Qsl. */
    interface IQsl {

        /** Qsl sentDate */
        sentDate?: (google.protobuf.ITimestamp|null);

        /** Qsl sentStatus */
        sentStatus?: (string|null);

        /** Qsl sentVia */
        sentVia?: (string|null);

        /** Qsl receivedDate */
        receivedDate?: (google.protobuf.ITimestamp|null);

        /** Qsl receivedStatus */
        receivedStatus?: (string|null);

        /** Qsl receivedVia */
        receivedVia?: (string|null);

        /** Qsl receivedMessage */
        receivedMessage?: (string|null);
    }

    /** Represents a Qsl. */
    class Qsl implements IQsl {

        /**
         * Constructs a new Qsl.
         * @param [properties] Properties to set
         */
        constructor(properties?: adif.IQsl);

        /** Qsl sentDate. */
        public sentDate?: (google.protobuf.ITimestamp|null);

        /** Qsl sentStatus. */
        public sentStatus: string;

        /** Qsl sentVia. */
        public sentVia: string;

        /** Qsl receivedDate. */
        public receivedDate?: (google.protobuf.ITimestamp|null);

        /** Qsl receivedStatus. */
        public receivedStatus: string;

        /** Qsl receivedVia. */
        public receivedVia: string;

        /** Qsl receivedMessage. */
        public receivedMessage: string;

        /**
         * Creates a new Qsl instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Qsl instance
         */
        public static create(properties?: adif.IQsl): adif.Qsl;

        /**
         * Encodes the specified Qsl message. Does not implicitly {@link adif.Qsl.verify|verify} messages.
         * @param message Qsl message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: adif.IQsl, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Qsl message, length delimited. Does not implicitly {@link adif.Qsl.verify|verify} messages.
         * @param message Qsl message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: adif.IQsl, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Qsl message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Qsl
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): adif.Qsl;

        /**
         * Decodes a Qsl message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Qsl
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): adif.Qsl;

        /**
         * Verifies a Qsl message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Qsl message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Qsl
         */
        public static fromObject(object: { [k: string]: any }): adif.Qsl;

        /**
         * Creates a plain object from a Qsl message. Also converts values to other types if specified.
         * @param message Qsl
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: adif.Qsl, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Qsl to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}

/** Namespace google. */
export namespace google {

    /** Namespace protobuf. */
    namespace protobuf {

        /** Properties of a Timestamp. */
        interface ITimestamp {

            /** Timestamp seconds */
            seconds?: (number|Long|null);

            /** Timestamp nanos */
            nanos?: (number|null);
        }

        /** Represents a Timestamp. */
        class Timestamp implements ITimestamp {

            /**
             * Constructs a new Timestamp.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.ITimestamp);

            /** Timestamp seconds. */
            public seconds: (number|Long);

            /** Timestamp nanos. */
            public nanos: number;

            /**
             * Creates a new Timestamp instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Timestamp instance
             */
            public static create(properties?: google.protobuf.ITimestamp): google.protobuf.Timestamp;

            /**
             * Encodes the specified Timestamp message. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @param message Timestamp message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.ITimestamp, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Timestamp message, length delimited. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @param message Timestamp message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.ITimestamp, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Timestamp message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Timestamp;

            /**
             * Decodes a Timestamp message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Timestamp;

            /**
             * Verifies a Timestamp message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Timestamp message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Timestamp
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Timestamp;

            /**
             * Creates a plain object from a Timestamp message. Also converts values to other types if specified.
             * @param message Timestamp
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Timestamp, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Timestamp to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }
}
