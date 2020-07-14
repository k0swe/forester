/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.adif = (function() {

    /**
     * Namespace adif.
     * @exports adif
     * @namespace
     */
    var adif = {};

    adif.Adif = (function() {

        /**
         * Properties of an Adif.
         * @memberof adif
         * @interface IAdif
         * @property {adif.IHeader|null} [header] Adif header
         * @property {Array.<adif.IQso>|null} [qsos] Adif qsos
         */

        /**
         * Constructs a new Adif.
         * @memberof adif
         * @classdesc Represents an Adif.
         * @implements IAdif
         * @constructor
         * @param {adif.IAdif=} [properties] Properties to set
         */
        function Adif(properties) {
            this.qsos = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Adif header.
         * @member {adif.IHeader|null|undefined} header
         * @memberof adif.Adif
         * @instance
         */
        Adif.prototype.header = null;

        /**
         * Adif qsos.
         * @member {Array.<adif.IQso>} qsos
         * @memberof adif.Adif
         * @instance
         */
        Adif.prototype.qsos = $util.emptyArray;

        /**
         * Creates a new Adif instance using the specified properties.
         * @function create
         * @memberof adif.Adif
         * @static
         * @param {adif.IAdif=} [properties] Properties to set
         * @returns {adif.Adif} Adif instance
         */
        Adif.create = function create(properties) {
            return new Adif(properties);
        };

        /**
         * Encodes the specified Adif message. Does not implicitly {@link adif.Adif.verify|verify} messages.
         * @function encode
         * @memberof adif.Adif
         * @static
         * @param {adif.IAdif} message Adif message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Adif.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.header != null && Object.hasOwnProperty.call(message, "header"))
                $root.adif.Header.encode(message.header, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.qsos != null && message.qsos.length)
                for (var i = 0; i < message.qsos.length; ++i)
                    $root.adif.Qso.encode(message.qsos[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Adif message, length delimited. Does not implicitly {@link adif.Adif.verify|verify} messages.
         * @function encodeDelimited
         * @memberof adif.Adif
         * @static
         * @param {adif.IAdif} message Adif message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Adif.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Adif message from the specified reader or buffer.
         * @function decode
         * @memberof adif.Adif
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {adif.Adif} Adif
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Adif.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.adif.Adif();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.header = $root.adif.Header.decode(reader, reader.uint32());
                    break;
                case 2:
                    if (!(message.qsos && message.qsos.length))
                        message.qsos = [];
                    message.qsos.push($root.adif.Qso.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an Adif message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof adif.Adif
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {adif.Adif} Adif
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Adif.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Adif message.
         * @function verify
         * @memberof adif.Adif
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Adif.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.header != null && message.hasOwnProperty("header")) {
                var error = $root.adif.Header.verify(message.header);
                if (error)
                    return "header." + error;
            }
            if (message.qsos != null && message.hasOwnProperty("qsos")) {
                if (!Array.isArray(message.qsos))
                    return "qsos: array expected";
                for (var i = 0; i < message.qsos.length; ++i) {
                    var error = $root.adif.Qso.verify(message.qsos[i]);
                    if (error)
                        return "qsos." + error;
                }
            }
            return null;
        };

        /**
         * Creates an Adif message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof adif.Adif
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {adif.Adif} Adif
         */
        Adif.fromObject = function fromObject(object) {
            if (object instanceof $root.adif.Adif)
                return object;
            var message = new $root.adif.Adif();
            if (object.header != null) {
                if (typeof object.header !== "object")
                    throw TypeError(".adif.Adif.header: object expected");
                message.header = $root.adif.Header.fromObject(object.header);
            }
            if (object.qsos) {
                if (!Array.isArray(object.qsos))
                    throw TypeError(".adif.Adif.qsos: array expected");
                message.qsos = [];
                for (var i = 0; i < object.qsos.length; ++i) {
                    if (typeof object.qsos[i] !== "object")
                        throw TypeError(".adif.Adif.qsos: object expected");
                    message.qsos[i] = $root.adif.Qso.fromObject(object.qsos[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from an Adif message. Also converts values to other types if specified.
         * @function toObject
         * @memberof adif.Adif
         * @static
         * @param {adif.Adif} message Adif
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Adif.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.qsos = [];
            if (options.defaults)
                object.header = null;
            if (message.header != null && message.hasOwnProperty("header"))
                object.header = $root.adif.Header.toObject(message.header, options);
            if (message.qsos && message.qsos.length) {
                object.qsos = [];
                for (var j = 0; j < message.qsos.length; ++j)
                    object.qsos[j] = $root.adif.Qso.toObject(message.qsos[j], options);
            }
            return object;
        };

        /**
         * Converts this Adif to JSON.
         * @function toJSON
         * @memberof adif.Adif
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Adif.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Adif;
    })();

    adif.Header = (function() {

        /**
         * Properties of a Header.
         * @memberof adif
         * @interface IHeader
         * @property {string|null} [adifVersion] Header adifVersion
         * @property {google.protobuf.ITimestamp|null} [createdTimestamp] Header createdTimestamp
         * @property {string|null} [programId] Header programId
         * @property {string|null} [programVersion] Header programVersion
         */

        /**
         * Constructs a new Header.
         * @memberof adif
         * @classdesc Represents a Header.
         * @implements IHeader
         * @constructor
         * @param {adif.IHeader=} [properties] Properties to set
         */
        function Header(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Header adifVersion.
         * @member {string} adifVersion
         * @memberof adif.Header
         * @instance
         */
        Header.prototype.adifVersion = "";

        /**
         * Header createdTimestamp.
         * @member {google.protobuf.ITimestamp|null|undefined} createdTimestamp
         * @memberof adif.Header
         * @instance
         */
        Header.prototype.createdTimestamp = null;

        /**
         * Header programId.
         * @member {string} programId
         * @memberof adif.Header
         * @instance
         */
        Header.prototype.programId = "";

        /**
         * Header programVersion.
         * @member {string} programVersion
         * @memberof adif.Header
         * @instance
         */
        Header.prototype.programVersion = "";

        /**
         * Creates a new Header instance using the specified properties.
         * @function create
         * @memberof adif.Header
         * @static
         * @param {adif.IHeader=} [properties] Properties to set
         * @returns {adif.Header} Header instance
         */
        Header.create = function create(properties) {
            return new Header(properties);
        };

        /**
         * Encodes the specified Header message. Does not implicitly {@link adif.Header.verify|verify} messages.
         * @function encode
         * @memberof adif.Header
         * @static
         * @param {adif.IHeader} message Header message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Header.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.adifVersion != null && Object.hasOwnProperty.call(message, "adifVersion"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.adifVersion);
            if (message.createdTimestamp != null && Object.hasOwnProperty.call(message, "createdTimestamp"))
                $root.google.protobuf.Timestamp.encode(message.createdTimestamp, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.programId != null && Object.hasOwnProperty.call(message, "programId"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.programId);
            if (message.programVersion != null && Object.hasOwnProperty.call(message, "programVersion"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.programVersion);
            return writer;
        };

        /**
         * Encodes the specified Header message, length delimited. Does not implicitly {@link adif.Header.verify|verify} messages.
         * @function encodeDelimited
         * @memberof adif.Header
         * @static
         * @param {adif.IHeader} message Header message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Header.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Header message from the specified reader or buffer.
         * @function decode
         * @memberof adif.Header
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {adif.Header} Header
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Header.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.adif.Header();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.adifVersion = reader.string();
                    break;
                case 2:
                    message.createdTimestamp = $root.google.protobuf.Timestamp.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.programId = reader.string();
                    break;
                case 4:
                    message.programVersion = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Header message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof adif.Header
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {adif.Header} Header
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Header.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Header message.
         * @function verify
         * @memberof adif.Header
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Header.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.adifVersion != null && message.hasOwnProperty("adifVersion"))
                if (!$util.isString(message.adifVersion))
                    return "adifVersion: string expected";
            if (message.createdTimestamp != null && message.hasOwnProperty("createdTimestamp")) {
                var error = $root.google.protobuf.Timestamp.verify(message.createdTimestamp);
                if (error)
                    return "createdTimestamp." + error;
            }
            if (message.programId != null && message.hasOwnProperty("programId"))
                if (!$util.isString(message.programId))
                    return "programId: string expected";
            if (message.programVersion != null && message.hasOwnProperty("programVersion"))
                if (!$util.isString(message.programVersion))
                    return "programVersion: string expected";
            return null;
        };

        /**
         * Creates a Header message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof adif.Header
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {adif.Header} Header
         */
        Header.fromObject = function fromObject(object) {
            if (object instanceof $root.adif.Header)
                return object;
            var message = new $root.adif.Header();
            if (object.adifVersion != null)
                message.adifVersion = String(object.adifVersion);
            if (object.createdTimestamp != null) {
                if (typeof object.createdTimestamp !== "object")
                    throw TypeError(".adif.Header.createdTimestamp: object expected");
                message.createdTimestamp = $root.google.protobuf.Timestamp.fromObject(object.createdTimestamp);
            }
            if (object.programId != null)
                message.programId = String(object.programId);
            if (object.programVersion != null)
                message.programVersion = String(object.programVersion);
            return message;
        };

        /**
         * Creates a plain object from a Header message. Also converts values to other types if specified.
         * @function toObject
         * @memberof adif.Header
         * @static
         * @param {adif.Header} message Header
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Header.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.adifVersion = "";
                object.createdTimestamp = null;
                object.programId = "";
                object.programVersion = "";
            }
            if (message.adifVersion != null && message.hasOwnProperty("adifVersion"))
                object.adifVersion = message.adifVersion;
            if (message.createdTimestamp != null && message.hasOwnProperty("createdTimestamp"))
                object.createdTimestamp = $root.google.protobuf.Timestamp.toObject(message.createdTimestamp, options);
            if (message.programId != null && message.hasOwnProperty("programId"))
                object.programId = message.programId;
            if (message.programVersion != null && message.hasOwnProperty("programVersion"))
                object.programVersion = message.programVersion;
            return object;
        };

        /**
         * Converts this Header to JSON.
         * @function toJSON
         * @memberof adif.Header
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Header.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Header;
    })();

    adif.Qso = (function() {

        /**
         * Properties of a Qso.
         * @memberof adif
         * @interface IQso
         * @property {adif.IStation|null} [loggingStation] Qso loggingStation
         * @property {adif.IStation|null} [contactedStation] Qso contactedStation
         * @property {adif.IPropagation|null} [propagation] Qso propagation
         * @property {string|null} [band] Qso band
         * @property {string|null} [bandRx] Qso bandRx
         * @property {number|null} [freq] Qso freq
         * @property {number|null} [freqRx] Qso freqRx
         * @property {string|null} [mode] Qso mode
         * @property {string|null} [submode] Qso submode
         * @property {number|null} [distanceKm] Qso distanceKm
         * @property {google.protobuf.ITimestamp|null} [timeOn] Qso timeOn
         * @property {google.protobuf.ITimestamp|null} [timeOff] Qso timeOff
         * @property {boolean|null} [random] Qso random
         * @property {string|null} [rstReceived] Qso rstReceived
         * @property {string|null} [rstSent] Qso rstSent
         * @property {boolean|null} [swl] Qso swl
         * @property {string|null} [complete] Qso complete
         * @property {string|null} [comment] Qso comment
         * @property {string|null} [notes] Qso notes
         * @property {adif.IContestData|null} [contest] Qso contest
         * @property {Array.<string>|null} [awardSubmitted] Qso awardSubmitted
         * @property {Array.<string>|null} [awardGranted] Qso awardGranted
         * @property {Array.<adif.ICredit>|null} [creditSubmitted] Qso creditSubmitted
         * @property {Array.<adif.ICredit>|null} [creditGranted] Qso creditGranted
         * @property {string|null} [publicKey] Qso publicKey
         * @property {adif.IUpload|null} [clublog] Qso clublog
         * @property {adif.IUpload|null} [hdrlog] Qso hdrlog
         * @property {adif.IUpload|null} [qrzcom] Qso qrzcom
         * @property {adif.IQsl|null} [eqsl] Qso eqsl
         * @property {adif.IQsl|null} [lotw] Qso lotw
         * @property {adif.IQsl|null} [card] Qso card
         */

        /**
         * Constructs a new Qso.
         * @memberof adif
         * @classdesc Represents a Qso.
         * @implements IQso
         * @constructor
         * @param {adif.IQso=} [properties] Properties to set
         */
        function Qso(properties) {
            this.awardSubmitted = [];
            this.awardGranted = [];
            this.creditSubmitted = [];
            this.creditGranted = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Qso loggingStation.
         * @member {adif.IStation|null|undefined} loggingStation
         * @memberof adif.Qso
         * @instance
         */
        Qso.prototype.loggingStation = null;

        /**
         * Qso contactedStation.
         * @member {adif.IStation|null|undefined} contactedStation
         * @memberof adif.Qso
         * @instance
         */
        Qso.prototype.contactedStation = null;

        /**
         * Qso propagation.
         * @member {adif.IPropagation|null|undefined} propagation
         * @memberof adif.Qso
         * @instance
         */
        Qso.prototype.propagation = null;

        /**
         * Qso band.
         * @member {string} band
         * @memberof adif.Qso
         * @instance
         */
        Qso.prototype.band = "";

        /**
         * Qso bandRx.
         * @member {string} bandRx
         * @memberof adif.Qso
         * @instance
         */
        Qso.prototype.bandRx = "";

        /**
         * Qso freq.
         * @member {number} freq
         * @memberof adif.Qso
         * @instance
         */
        Qso.prototype.freq = 0;

        /**
         * Qso freqRx.
         * @member {number} freqRx
         * @memberof adif.Qso
         * @instance
         */
        Qso.prototype.freqRx = 0;

        /**
         * Qso mode.
         * @member {string} mode
         * @memberof adif.Qso
         * @instance
         */
        Qso.prototype.mode = "";

        /**
         * Qso submode.
         * @member {string} submode
         * @memberof adif.Qso
         * @instance
         */
        Qso.prototype.submode = "";

        /**
         * Qso distanceKm.
         * @member {number} distanceKm
         * @memberof adif.Qso
         * @instance
         */
        Qso.prototype.distanceKm = 0;

        /**
         * Qso timeOn.
         * @member {google.protobuf.ITimestamp|null|undefined} timeOn
         * @memberof adif.Qso
         * @instance
         */
        Qso.prototype.timeOn = null;

        /**
         * Qso timeOff.
         * @member {google.protobuf.ITimestamp|null|undefined} timeOff
         * @memberof adif.Qso
         * @instance
         */
        Qso.prototype.timeOff = null;

        /**
         * Qso random.
         * @member {boolean} random
         * @memberof adif.Qso
         * @instance
         */
        Qso.prototype.random = false;

        /**
         * Qso rstReceived.
         * @member {string} rstReceived
         * @memberof adif.Qso
         * @instance
         */
        Qso.prototype.rstReceived = "";

        /**
         * Qso rstSent.
         * @member {string} rstSent
         * @memberof adif.Qso
         * @instance
         */
        Qso.prototype.rstSent = "";

        /**
         * Qso swl.
         * @member {boolean} swl
         * @memberof adif.Qso
         * @instance
         */
        Qso.prototype.swl = false;

        /**
         * Qso complete.
         * @member {string} complete
         * @memberof adif.Qso
         * @instance
         */
        Qso.prototype.complete = "";

        /**
         * Qso comment.
         * @member {string} comment
         * @memberof adif.Qso
         * @instance
         */
        Qso.prototype.comment = "";

        /**
         * Qso notes.
         * @member {string} notes
         * @memberof adif.Qso
         * @instance
         */
        Qso.prototype.notes = "";

        /**
         * Qso contest.
         * @member {adif.IContestData|null|undefined} contest
         * @memberof adif.Qso
         * @instance
         */
        Qso.prototype.contest = null;

        /**
         * Qso awardSubmitted.
         * @member {Array.<string>} awardSubmitted
         * @memberof adif.Qso
         * @instance
         */
        Qso.prototype.awardSubmitted = $util.emptyArray;

        /**
         * Qso awardGranted.
         * @member {Array.<string>} awardGranted
         * @memberof adif.Qso
         * @instance
         */
        Qso.prototype.awardGranted = $util.emptyArray;

        /**
         * Qso creditSubmitted.
         * @member {Array.<adif.ICredit>} creditSubmitted
         * @memberof adif.Qso
         * @instance
         */
        Qso.prototype.creditSubmitted = $util.emptyArray;

        /**
         * Qso creditGranted.
         * @member {Array.<adif.ICredit>} creditGranted
         * @memberof adif.Qso
         * @instance
         */
        Qso.prototype.creditGranted = $util.emptyArray;

        /**
         * Qso publicKey.
         * @member {string} publicKey
         * @memberof adif.Qso
         * @instance
         */
        Qso.prototype.publicKey = "";

        /**
         * Qso clublog.
         * @member {adif.IUpload|null|undefined} clublog
         * @memberof adif.Qso
         * @instance
         */
        Qso.prototype.clublog = null;

        /**
         * Qso hdrlog.
         * @member {adif.IUpload|null|undefined} hdrlog
         * @memberof adif.Qso
         * @instance
         */
        Qso.prototype.hdrlog = null;

        /**
         * Qso qrzcom.
         * @member {adif.IUpload|null|undefined} qrzcom
         * @memberof adif.Qso
         * @instance
         */
        Qso.prototype.qrzcom = null;

        /**
         * Qso eqsl.
         * @member {adif.IQsl|null|undefined} eqsl
         * @memberof adif.Qso
         * @instance
         */
        Qso.prototype.eqsl = null;

        /**
         * Qso lotw.
         * @member {adif.IQsl|null|undefined} lotw
         * @memberof adif.Qso
         * @instance
         */
        Qso.prototype.lotw = null;

        /**
         * Qso card.
         * @member {adif.IQsl|null|undefined} card
         * @memberof adif.Qso
         * @instance
         */
        Qso.prototype.card = null;

        /**
         * Creates a new Qso instance using the specified properties.
         * @function create
         * @memberof adif.Qso
         * @static
         * @param {adif.IQso=} [properties] Properties to set
         * @returns {adif.Qso} Qso instance
         */
        Qso.create = function create(properties) {
            return new Qso(properties);
        };

        /**
         * Encodes the specified Qso message. Does not implicitly {@link adif.Qso.verify|verify} messages.
         * @function encode
         * @memberof adif.Qso
         * @static
         * @param {adif.IQso} message Qso message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Qso.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.loggingStation != null && Object.hasOwnProperty.call(message, "loggingStation"))
                $root.adif.Station.encode(message.loggingStation, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.contactedStation != null && Object.hasOwnProperty.call(message, "contactedStation"))
                $root.adif.Station.encode(message.contactedStation, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.propagation != null && Object.hasOwnProperty.call(message, "propagation"))
                $root.adif.Propagation.encode(message.propagation, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.band != null && Object.hasOwnProperty.call(message, "band"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.band);
            if (message.bandRx != null && Object.hasOwnProperty.call(message, "bandRx"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.bandRx);
            if (message.freq != null && Object.hasOwnProperty.call(message, "freq"))
                writer.uint32(/* id 6, wireType 1 =*/49).double(message.freq);
            if (message.freqRx != null && Object.hasOwnProperty.call(message, "freqRx"))
                writer.uint32(/* id 7, wireType 1 =*/57).double(message.freqRx);
            if (message.mode != null && Object.hasOwnProperty.call(message, "mode"))
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.mode);
            if (message.submode != null && Object.hasOwnProperty.call(message, "submode"))
                writer.uint32(/* id 9, wireType 2 =*/74).string(message.submode);
            if (message.distanceKm != null && Object.hasOwnProperty.call(message, "distanceKm"))
                writer.uint32(/* id 10, wireType 0 =*/80).uint32(message.distanceKm);
            if (message.timeOn != null && Object.hasOwnProperty.call(message, "timeOn"))
                $root.google.protobuf.Timestamp.encode(message.timeOn, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
            if (message.timeOff != null && Object.hasOwnProperty.call(message, "timeOff"))
                $root.google.protobuf.Timestamp.encode(message.timeOff, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
            if (message.random != null && Object.hasOwnProperty.call(message, "random"))
                writer.uint32(/* id 13, wireType 0 =*/104).bool(message.random);
            if (message.rstReceived != null && Object.hasOwnProperty.call(message, "rstReceived"))
                writer.uint32(/* id 14, wireType 2 =*/114).string(message.rstReceived);
            if (message.rstSent != null && Object.hasOwnProperty.call(message, "rstSent"))
                writer.uint32(/* id 15, wireType 2 =*/122).string(message.rstSent);
            if (message.swl != null && Object.hasOwnProperty.call(message, "swl"))
                writer.uint32(/* id 16, wireType 0 =*/128).bool(message.swl);
            if (message.complete != null && Object.hasOwnProperty.call(message, "complete"))
                writer.uint32(/* id 17, wireType 2 =*/138).string(message.complete);
            if (message.comment != null && Object.hasOwnProperty.call(message, "comment"))
                writer.uint32(/* id 18, wireType 2 =*/146).string(message.comment);
            if (message.notes != null && Object.hasOwnProperty.call(message, "notes"))
                writer.uint32(/* id 19, wireType 2 =*/154).string(message.notes);
            if (message.contest != null && Object.hasOwnProperty.call(message, "contest"))
                $root.adif.ContestData.encode(message.contest, writer.uint32(/* id 20, wireType 2 =*/162).fork()).ldelim();
            if (message.awardSubmitted != null && message.awardSubmitted.length)
                for (var i = 0; i < message.awardSubmitted.length; ++i)
                    writer.uint32(/* id 21, wireType 2 =*/170).string(message.awardSubmitted[i]);
            if (message.awardGranted != null && message.awardGranted.length)
                for (var i = 0; i < message.awardGranted.length; ++i)
                    writer.uint32(/* id 22, wireType 2 =*/178).string(message.awardGranted[i]);
            if (message.creditSubmitted != null && message.creditSubmitted.length)
                for (var i = 0; i < message.creditSubmitted.length; ++i)
                    $root.adif.Credit.encode(message.creditSubmitted[i], writer.uint32(/* id 23, wireType 2 =*/186).fork()).ldelim();
            if (message.creditGranted != null && message.creditGranted.length)
                for (var i = 0; i < message.creditGranted.length; ++i)
                    $root.adif.Credit.encode(message.creditGranted[i], writer.uint32(/* id 24, wireType 2 =*/194).fork()).ldelim();
            if (message.publicKey != null && Object.hasOwnProperty.call(message, "publicKey"))
                writer.uint32(/* id 25, wireType 2 =*/202).string(message.publicKey);
            if (message.clublog != null && Object.hasOwnProperty.call(message, "clublog"))
                $root.adif.Upload.encode(message.clublog, writer.uint32(/* id 26, wireType 2 =*/210).fork()).ldelim();
            if (message.hdrlog != null && Object.hasOwnProperty.call(message, "hdrlog"))
                $root.adif.Upload.encode(message.hdrlog, writer.uint32(/* id 27, wireType 2 =*/218).fork()).ldelim();
            if (message.qrzcom != null && Object.hasOwnProperty.call(message, "qrzcom"))
                $root.adif.Upload.encode(message.qrzcom, writer.uint32(/* id 28, wireType 2 =*/226).fork()).ldelim();
            if (message.eqsl != null && Object.hasOwnProperty.call(message, "eqsl"))
                $root.adif.Qsl.encode(message.eqsl, writer.uint32(/* id 29, wireType 2 =*/234).fork()).ldelim();
            if (message.lotw != null && Object.hasOwnProperty.call(message, "lotw"))
                $root.adif.Qsl.encode(message.lotw, writer.uint32(/* id 30, wireType 2 =*/242).fork()).ldelim();
            if (message.card != null && Object.hasOwnProperty.call(message, "card"))
                $root.adif.Qsl.encode(message.card, writer.uint32(/* id 31, wireType 2 =*/250).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Qso message, length delimited. Does not implicitly {@link adif.Qso.verify|verify} messages.
         * @function encodeDelimited
         * @memberof adif.Qso
         * @static
         * @param {adif.IQso} message Qso message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Qso.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Qso message from the specified reader or buffer.
         * @function decode
         * @memberof adif.Qso
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {adif.Qso} Qso
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Qso.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.adif.Qso();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.loggingStation = $root.adif.Station.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.contactedStation = $root.adif.Station.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.propagation = $root.adif.Propagation.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.band = reader.string();
                    break;
                case 5:
                    message.bandRx = reader.string();
                    break;
                case 6:
                    message.freq = reader.double();
                    break;
                case 7:
                    message.freqRx = reader.double();
                    break;
                case 8:
                    message.mode = reader.string();
                    break;
                case 9:
                    message.submode = reader.string();
                    break;
                case 10:
                    message.distanceKm = reader.uint32();
                    break;
                case 11:
                    message.timeOn = $root.google.protobuf.Timestamp.decode(reader, reader.uint32());
                    break;
                case 12:
                    message.timeOff = $root.google.protobuf.Timestamp.decode(reader, reader.uint32());
                    break;
                case 13:
                    message.random = reader.bool();
                    break;
                case 14:
                    message.rstReceived = reader.string();
                    break;
                case 15:
                    message.rstSent = reader.string();
                    break;
                case 16:
                    message.swl = reader.bool();
                    break;
                case 17:
                    message.complete = reader.string();
                    break;
                case 18:
                    message.comment = reader.string();
                    break;
                case 19:
                    message.notes = reader.string();
                    break;
                case 20:
                    message.contest = $root.adif.ContestData.decode(reader, reader.uint32());
                    break;
                case 21:
                    if (!(message.awardSubmitted && message.awardSubmitted.length))
                        message.awardSubmitted = [];
                    message.awardSubmitted.push(reader.string());
                    break;
                case 22:
                    if (!(message.awardGranted && message.awardGranted.length))
                        message.awardGranted = [];
                    message.awardGranted.push(reader.string());
                    break;
                case 23:
                    if (!(message.creditSubmitted && message.creditSubmitted.length))
                        message.creditSubmitted = [];
                    message.creditSubmitted.push($root.adif.Credit.decode(reader, reader.uint32()));
                    break;
                case 24:
                    if (!(message.creditGranted && message.creditGranted.length))
                        message.creditGranted = [];
                    message.creditGranted.push($root.adif.Credit.decode(reader, reader.uint32()));
                    break;
                case 25:
                    message.publicKey = reader.string();
                    break;
                case 26:
                    message.clublog = $root.adif.Upload.decode(reader, reader.uint32());
                    break;
                case 27:
                    message.hdrlog = $root.adif.Upload.decode(reader, reader.uint32());
                    break;
                case 28:
                    message.qrzcom = $root.adif.Upload.decode(reader, reader.uint32());
                    break;
                case 29:
                    message.eqsl = $root.adif.Qsl.decode(reader, reader.uint32());
                    break;
                case 30:
                    message.lotw = $root.adif.Qsl.decode(reader, reader.uint32());
                    break;
                case 31:
                    message.card = $root.adif.Qsl.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Qso message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof adif.Qso
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {adif.Qso} Qso
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Qso.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Qso message.
         * @function verify
         * @memberof adif.Qso
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Qso.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.loggingStation != null && message.hasOwnProperty("loggingStation")) {
                var error = $root.adif.Station.verify(message.loggingStation);
                if (error)
                    return "loggingStation." + error;
            }
            if (message.contactedStation != null && message.hasOwnProperty("contactedStation")) {
                var error = $root.adif.Station.verify(message.contactedStation);
                if (error)
                    return "contactedStation." + error;
            }
            if (message.propagation != null && message.hasOwnProperty("propagation")) {
                var error = $root.adif.Propagation.verify(message.propagation);
                if (error)
                    return "propagation." + error;
            }
            if (message.band != null && message.hasOwnProperty("band"))
                if (!$util.isString(message.band))
                    return "band: string expected";
            if (message.bandRx != null && message.hasOwnProperty("bandRx"))
                if (!$util.isString(message.bandRx))
                    return "bandRx: string expected";
            if (message.freq != null && message.hasOwnProperty("freq"))
                if (typeof message.freq !== "number")
                    return "freq: number expected";
            if (message.freqRx != null && message.hasOwnProperty("freqRx"))
                if (typeof message.freqRx !== "number")
                    return "freqRx: number expected";
            if (message.mode != null && message.hasOwnProperty("mode"))
                if (!$util.isString(message.mode))
                    return "mode: string expected";
            if (message.submode != null && message.hasOwnProperty("submode"))
                if (!$util.isString(message.submode))
                    return "submode: string expected";
            if (message.distanceKm != null && message.hasOwnProperty("distanceKm"))
                if (!$util.isInteger(message.distanceKm))
                    return "distanceKm: integer expected";
            if (message.timeOn != null && message.hasOwnProperty("timeOn")) {
                var error = $root.google.protobuf.Timestamp.verify(message.timeOn);
                if (error)
                    return "timeOn." + error;
            }
            if (message.timeOff != null && message.hasOwnProperty("timeOff")) {
                var error = $root.google.protobuf.Timestamp.verify(message.timeOff);
                if (error)
                    return "timeOff." + error;
            }
            if (message.random != null && message.hasOwnProperty("random"))
                if (typeof message.random !== "boolean")
                    return "random: boolean expected";
            if (message.rstReceived != null && message.hasOwnProperty("rstReceived"))
                if (!$util.isString(message.rstReceived))
                    return "rstReceived: string expected";
            if (message.rstSent != null && message.hasOwnProperty("rstSent"))
                if (!$util.isString(message.rstSent))
                    return "rstSent: string expected";
            if (message.swl != null && message.hasOwnProperty("swl"))
                if (typeof message.swl !== "boolean")
                    return "swl: boolean expected";
            if (message.complete != null && message.hasOwnProperty("complete"))
                if (!$util.isString(message.complete))
                    return "complete: string expected";
            if (message.comment != null && message.hasOwnProperty("comment"))
                if (!$util.isString(message.comment))
                    return "comment: string expected";
            if (message.notes != null && message.hasOwnProperty("notes"))
                if (!$util.isString(message.notes))
                    return "notes: string expected";
            if (message.contest != null && message.hasOwnProperty("contest")) {
                var error = $root.adif.ContestData.verify(message.contest);
                if (error)
                    return "contest." + error;
            }
            if (message.awardSubmitted != null && message.hasOwnProperty("awardSubmitted")) {
                if (!Array.isArray(message.awardSubmitted))
                    return "awardSubmitted: array expected";
                for (var i = 0; i < message.awardSubmitted.length; ++i)
                    if (!$util.isString(message.awardSubmitted[i]))
                        return "awardSubmitted: string[] expected";
            }
            if (message.awardGranted != null && message.hasOwnProperty("awardGranted")) {
                if (!Array.isArray(message.awardGranted))
                    return "awardGranted: array expected";
                for (var i = 0; i < message.awardGranted.length; ++i)
                    if (!$util.isString(message.awardGranted[i]))
                        return "awardGranted: string[] expected";
            }
            if (message.creditSubmitted != null && message.hasOwnProperty("creditSubmitted")) {
                if (!Array.isArray(message.creditSubmitted))
                    return "creditSubmitted: array expected";
                for (var i = 0; i < message.creditSubmitted.length; ++i) {
                    var error = $root.adif.Credit.verify(message.creditSubmitted[i]);
                    if (error)
                        return "creditSubmitted." + error;
                }
            }
            if (message.creditGranted != null && message.hasOwnProperty("creditGranted")) {
                if (!Array.isArray(message.creditGranted))
                    return "creditGranted: array expected";
                for (var i = 0; i < message.creditGranted.length; ++i) {
                    var error = $root.adif.Credit.verify(message.creditGranted[i]);
                    if (error)
                        return "creditGranted." + error;
                }
            }
            if (message.publicKey != null && message.hasOwnProperty("publicKey"))
                if (!$util.isString(message.publicKey))
                    return "publicKey: string expected";
            if (message.clublog != null && message.hasOwnProperty("clublog")) {
                var error = $root.adif.Upload.verify(message.clublog);
                if (error)
                    return "clublog." + error;
            }
            if (message.hdrlog != null && message.hasOwnProperty("hdrlog")) {
                var error = $root.adif.Upload.verify(message.hdrlog);
                if (error)
                    return "hdrlog." + error;
            }
            if (message.qrzcom != null && message.hasOwnProperty("qrzcom")) {
                var error = $root.adif.Upload.verify(message.qrzcom);
                if (error)
                    return "qrzcom." + error;
            }
            if (message.eqsl != null && message.hasOwnProperty("eqsl")) {
                var error = $root.adif.Qsl.verify(message.eqsl);
                if (error)
                    return "eqsl." + error;
            }
            if (message.lotw != null && message.hasOwnProperty("lotw")) {
                var error = $root.adif.Qsl.verify(message.lotw);
                if (error)
                    return "lotw." + error;
            }
            if (message.card != null && message.hasOwnProperty("card")) {
                var error = $root.adif.Qsl.verify(message.card);
                if (error)
                    return "card." + error;
            }
            return null;
        };

        /**
         * Creates a Qso message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof adif.Qso
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {adif.Qso} Qso
         */
        Qso.fromObject = function fromObject(object) {
            if (object instanceof $root.adif.Qso)
                return object;
            var message = new $root.adif.Qso();
            if (object.loggingStation != null) {
                if (typeof object.loggingStation !== "object")
                    throw TypeError(".adif.Qso.loggingStation: object expected");
                message.loggingStation = $root.adif.Station.fromObject(object.loggingStation);
            }
            if (object.contactedStation != null) {
                if (typeof object.contactedStation !== "object")
                    throw TypeError(".adif.Qso.contactedStation: object expected");
                message.contactedStation = $root.adif.Station.fromObject(object.contactedStation);
            }
            if (object.propagation != null) {
                if (typeof object.propagation !== "object")
                    throw TypeError(".adif.Qso.propagation: object expected");
                message.propagation = $root.adif.Propagation.fromObject(object.propagation);
            }
            if (object.band != null)
                message.band = String(object.band);
            if (object.bandRx != null)
                message.bandRx = String(object.bandRx);
            if (object.freq != null)
                message.freq = Number(object.freq);
            if (object.freqRx != null)
                message.freqRx = Number(object.freqRx);
            if (object.mode != null)
                message.mode = String(object.mode);
            if (object.submode != null)
                message.submode = String(object.submode);
            if (object.distanceKm != null)
                message.distanceKm = object.distanceKm >>> 0;
            if (object.timeOn != null) {
                if (typeof object.timeOn !== "object")
                    throw TypeError(".adif.Qso.timeOn: object expected");
                message.timeOn = $root.google.protobuf.Timestamp.fromObject(object.timeOn);
            }
            if (object.timeOff != null) {
                if (typeof object.timeOff !== "object")
                    throw TypeError(".adif.Qso.timeOff: object expected");
                message.timeOff = $root.google.protobuf.Timestamp.fromObject(object.timeOff);
            }
            if (object.random != null)
                message.random = Boolean(object.random);
            if (object.rstReceived != null)
                message.rstReceived = String(object.rstReceived);
            if (object.rstSent != null)
                message.rstSent = String(object.rstSent);
            if (object.swl != null)
                message.swl = Boolean(object.swl);
            if (object.complete != null)
                message.complete = String(object.complete);
            if (object.comment != null)
                message.comment = String(object.comment);
            if (object.notes != null)
                message.notes = String(object.notes);
            if (object.contest != null) {
                if (typeof object.contest !== "object")
                    throw TypeError(".adif.Qso.contest: object expected");
                message.contest = $root.adif.ContestData.fromObject(object.contest);
            }
            if (object.awardSubmitted) {
                if (!Array.isArray(object.awardSubmitted))
                    throw TypeError(".adif.Qso.awardSubmitted: array expected");
                message.awardSubmitted = [];
                for (var i = 0; i < object.awardSubmitted.length; ++i)
                    message.awardSubmitted[i] = String(object.awardSubmitted[i]);
            }
            if (object.awardGranted) {
                if (!Array.isArray(object.awardGranted))
                    throw TypeError(".adif.Qso.awardGranted: array expected");
                message.awardGranted = [];
                for (var i = 0; i < object.awardGranted.length; ++i)
                    message.awardGranted[i] = String(object.awardGranted[i]);
            }
            if (object.creditSubmitted) {
                if (!Array.isArray(object.creditSubmitted))
                    throw TypeError(".adif.Qso.creditSubmitted: array expected");
                message.creditSubmitted = [];
                for (var i = 0; i < object.creditSubmitted.length; ++i) {
                    if (typeof object.creditSubmitted[i] !== "object")
                        throw TypeError(".adif.Qso.creditSubmitted: object expected");
                    message.creditSubmitted[i] = $root.adif.Credit.fromObject(object.creditSubmitted[i]);
                }
            }
            if (object.creditGranted) {
                if (!Array.isArray(object.creditGranted))
                    throw TypeError(".adif.Qso.creditGranted: array expected");
                message.creditGranted = [];
                for (var i = 0; i < object.creditGranted.length; ++i) {
                    if (typeof object.creditGranted[i] !== "object")
                        throw TypeError(".adif.Qso.creditGranted: object expected");
                    message.creditGranted[i] = $root.adif.Credit.fromObject(object.creditGranted[i]);
                }
            }
            if (object.publicKey != null)
                message.publicKey = String(object.publicKey);
            if (object.clublog != null) {
                if (typeof object.clublog !== "object")
                    throw TypeError(".adif.Qso.clublog: object expected");
                message.clublog = $root.adif.Upload.fromObject(object.clublog);
            }
            if (object.hdrlog != null) {
                if (typeof object.hdrlog !== "object")
                    throw TypeError(".adif.Qso.hdrlog: object expected");
                message.hdrlog = $root.adif.Upload.fromObject(object.hdrlog);
            }
            if (object.qrzcom != null) {
                if (typeof object.qrzcom !== "object")
                    throw TypeError(".adif.Qso.qrzcom: object expected");
                message.qrzcom = $root.adif.Upload.fromObject(object.qrzcom);
            }
            if (object.eqsl != null) {
                if (typeof object.eqsl !== "object")
                    throw TypeError(".adif.Qso.eqsl: object expected");
                message.eqsl = $root.adif.Qsl.fromObject(object.eqsl);
            }
            if (object.lotw != null) {
                if (typeof object.lotw !== "object")
                    throw TypeError(".adif.Qso.lotw: object expected");
                message.lotw = $root.adif.Qsl.fromObject(object.lotw);
            }
            if (object.card != null) {
                if (typeof object.card !== "object")
                    throw TypeError(".adif.Qso.card: object expected");
                message.card = $root.adif.Qsl.fromObject(object.card);
            }
            return message;
        };

        /**
         * Creates a plain object from a Qso message. Also converts values to other types if specified.
         * @function toObject
         * @memberof adif.Qso
         * @static
         * @param {adif.Qso} message Qso
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Qso.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.awardSubmitted = [];
                object.awardGranted = [];
                object.creditSubmitted = [];
                object.creditGranted = [];
            }
            if (options.defaults) {
                object.loggingStation = null;
                object.contactedStation = null;
                object.propagation = null;
                object.band = "";
                object.bandRx = "";
                object.freq = 0;
                object.freqRx = 0;
                object.mode = "";
                object.submode = "";
                object.distanceKm = 0;
                object.timeOn = null;
                object.timeOff = null;
                object.random = false;
                object.rstReceived = "";
                object.rstSent = "";
                object.swl = false;
                object.complete = "";
                object.comment = "";
                object.notes = "";
                object.contest = null;
                object.publicKey = "";
                object.clublog = null;
                object.hdrlog = null;
                object.qrzcom = null;
                object.eqsl = null;
                object.lotw = null;
                object.card = null;
            }
            if (message.loggingStation != null && message.hasOwnProperty("loggingStation"))
                object.loggingStation = $root.adif.Station.toObject(message.loggingStation, options);
            if (message.contactedStation != null && message.hasOwnProperty("contactedStation"))
                object.contactedStation = $root.adif.Station.toObject(message.contactedStation, options);
            if (message.propagation != null && message.hasOwnProperty("propagation"))
                object.propagation = $root.adif.Propagation.toObject(message.propagation, options);
            if (message.band != null && message.hasOwnProperty("band"))
                object.band = message.band;
            if (message.bandRx != null && message.hasOwnProperty("bandRx"))
                object.bandRx = message.bandRx;
            if (message.freq != null && message.hasOwnProperty("freq"))
                object.freq = options.json && !isFinite(message.freq) ? String(message.freq) : message.freq;
            if (message.freqRx != null && message.hasOwnProperty("freqRx"))
                object.freqRx = options.json && !isFinite(message.freqRx) ? String(message.freqRx) : message.freqRx;
            if (message.mode != null && message.hasOwnProperty("mode"))
                object.mode = message.mode;
            if (message.submode != null && message.hasOwnProperty("submode"))
                object.submode = message.submode;
            if (message.distanceKm != null && message.hasOwnProperty("distanceKm"))
                object.distanceKm = message.distanceKm;
            if (message.timeOn != null && message.hasOwnProperty("timeOn"))
                object.timeOn = $root.google.protobuf.Timestamp.toObject(message.timeOn, options);
            if (message.timeOff != null && message.hasOwnProperty("timeOff"))
                object.timeOff = $root.google.protobuf.Timestamp.toObject(message.timeOff, options);
            if (message.random != null && message.hasOwnProperty("random"))
                object.random = message.random;
            if (message.rstReceived != null && message.hasOwnProperty("rstReceived"))
                object.rstReceived = message.rstReceived;
            if (message.rstSent != null && message.hasOwnProperty("rstSent"))
                object.rstSent = message.rstSent;
            if (message.swl != null && message.hasOwnProperty("swl"))
                object.swl = message.swl;
            if (message.complete != null && message.hasOwnProperty("complete"))
                object.complete = message.complete;
            if (message.comment != null && message.hasOwnProperty("comment"))
                object.comment = message.comment;
            if (message.notes != null && message.hasOwnProperty("notes"))
                object.notes = message.notes;
            if (message.contest != null && message.hasOwnProperty("contest"))
                object.contest = $root.adif.ContestData.toObject(message.contest, options);
            if (message.awardSubmitted && message.awardSubmitted.length) {
                object.awardSubmitted = [];
                for (var j = 0; j < message.awardSubmitted.length; ++j)
                    object.awardSubmitted[j] = message.awardSubmitted[j];
            }
            if (message.awardGranted && message.awardGranted.length) {
                object.awardGranted = [];
                for (var j = 0; j < message.awardGranted.length; ++j)
                    object.awardGranted[j] = message.awardGranted[j];
            }
            if (message.creditSubmitted && message.creditSubmitted.length) {
                object.creditSubmitted = [];
                for (var j = 0; j < message.creditSubmitted.length; ++j)
                    object.creditSubmitted[j] = $root.adif.Credit.toObject(message.creditSubmitted[j], options);
            }
            if (message.creditGranted && message.creditGranted.length) {
                object.creditGranted = [];
                for (var j = 0; j < message.creditGranted.length; ++j)
                    object.creditGranted[j] = $root.adif.Credit.toObject(message.creditGranted[j], options);
            }
            if (message.publicKey != null && message.hasOwnProperty("publicKey"))
                object.publicKey = message.publicKey;
            if (message.clublog != null && message.hasOwnProperty("clublog"))
                object.clublog = $root.adif.Upload.toObject(message.clublog, options);
            if (message.hdrlog != null && message.hasOwnProperty("hdrlog"))
                object.hdrlog = $root.adif.Upload.toObject(message.hdrlog, options);
            if (message.qrzcom != null && message.hasOwnProperty("qrzcom"))
                object.qrzcom = $root.adif.Upload.toObject(message.qrzcom, options);
            if (message.eqsl != null && message.hasOwnProperty("eqsl"))
                object.eqsl = $root.adif.Qsl.toObject(message.eqsl, options);
            if (message.lotw != null && message.hasOwnProperty("lotw"))
                object.lotw = $root.adif.Qsl.toObject(message.lotw, options);
            if (message.card != null && message.hasOwnProperty("card"))
                object.card = $root.adif.Qsl.toObject(message.card, options);
            return object;
        };

        /**
         * Converts this Qso to JSON.
         * @function toJSON
         * @memberof adif.Qso
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Qso.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Qso;
    })();

    adif.Station = (function() {

        /**
         * Properties of a Station.
         * @memberof adif
         * @interface IStation
         * @property {string|null} [opCall] Station opCall
         * @property {string|null} [opName] Station opName
         * @property {string|null} [gridSquare] Station gridSquare
         * @property {number|null} [latitude] Station latitude
         * @property {number|null} [longitude] Station longitude
         * @property {number|null} [power] Station power
         * @property {string|null} [rig] Station rig
         * @property {string|null} [antenna] Station antenna
         * @property {number|null} [antennaAzimuth] Station antennaAzimuth
         * @property {number|null} [antennaElevation] Station antennaElevation
         * @property {string|null} [ownerCall] Station ownerCall
         * @property {string|null} [stationCall] Station stationCall
         * @property {number|null} [age] Station age
         * @property {boolean|null} [silentKey] Station silentKey
         * @property {string|null} [qslVia] Station qslVia
         * @property {string|null} [address] Station address
         * @property {string|null} [street] Station street
         * @property {string|null} [city] Station city
         * @property {string|null} [postalCode] Station postalCode
         * @property {string|null} [county] Station county
         * @property {string|null} [state] Station state
         * @property {string|null} [country] Station country
         * @property {number|null} [dxcc] Station dxcc
         * @property {string|null} [continent] Station continent
         * @property {string|null} [email] Station email
         * @property {string|null} [web] Station web
         * @property {number|null} [cqZone] Station cqZone
         * @property {number|null} [ituZone] Station ituZone
         * @property {string|null} [darcDok] Station darcDok
         * @property {number|null} [fists] Station fists
         * @property {number|null} [fistsCc] Station fistsCc
         * @property {string|null} [iota] Station iota
         * @property {number|null} [iotaIslandId] Station iotaIslandId
         * @property {string|null} [pfx] Station pfx
         * @property {string|null} [region] Station region
         * @property {string|null} [skcc] Station skcc
         * @property {string|null} [sig] Station sig
         * @property {string|null} [sigInfo] Station sigInfo
         * @property {string|null} [sotaRef] Station sotaRef
         * @property {number|null} [tenTen] Station tenTen
         * @property {string|null} [usacaCounties] Station usacaCounties
         * @property {number|null} [uksmg] Station uksmg
         * @property {string|null} [vuccGrids] Station vuccGrids
         */

        /**
         * Constructs a new Station.
         * @memberof adif
         * @classdesc Represents a Station.
         * @implements IStation
         * @constructor
         * @param {adif.IStation=} [properties] Properties to set
         */
        function Station(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Station opCall.
         * @member {string} opCall
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.opCall = "";

        /**
         * Station opName.
         * @member {string} opName
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.opName = "";

        /**
         * Station gridSquare.
         * @member {string} gridSquare
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.gridSquare = "";

        /**
         * Station latitude.
         * @member {number} latitude
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.latitude = 0;

        /**
         * Station longitude.
         * @member {number} longitude
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.longitude = 0;

        /**
         * Station power.
         * @member {number} power
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.power = 0;

        /**
         * Station rig.
         * @member {string} rig
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.rig = "";

        /**
         * Station antenna.
         * @member {string} antenna
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.antenna = "";

        /**
         * Station antennaAzimuth.
         * @member {number} antennaAzimuth
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.antennaAzimuth = 0;

        /**
         * Station antennaElevation.
         * @member {number} antennaElevation
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.antennaElevation = 0;

        /**
         * Station ownerCall.
         * @member {string} ownerCall
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.ownerCall = "";

        /**
         * Station stationCall.
         * @member {string} stationCall
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.stationCall = "";

        /**
         * Station age.
         * @member {number} age
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.age = 0;

        /**
         * Station silentKey.
         * @member {boolean} silentKey
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.silentKey = false;

        /**
         * Station qslVia.
         * @member {string} qslVia
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.qslVia = "";

        /**
         * Station address.
         * @member {string} address
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.address = "";

        /**
         * Station street.
         * @member {string} street
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.street = "";

        /**
         * Station city.
         * @member {string} city
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.city = "";

        /**
         * Station postalCode.
         * @member {string} postalCode
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.postalCode = "";

        /**
         * Station county.
         * @member {string} county
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.county = "";

        /**
         * Station state.
         * @member {string} state
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.state = "";

        /**
         * Station country.
         * @member {string} country
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.country = "";

        /**
         * Station dxcc.
         * @member {number} dxcc
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.dxcc = 0;

        /**
         * Station continent.
         * @member {string} continent
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.continent = "";

        /**
         * Station email.
         * @member {string} email
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.email = "";

        /**
         * Station web.
         * @member {string} web
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.web = "";

        /**
         * Station cqZone.
         * @member {number} cqZone
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.cqZone = 0;

        /**
         * Station ituZone.
         * @member {number} ituZone
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.ituZone = 0;

        /**
         * Station darcDok.
         * @member {string} darcDok
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.darcDok = "";

        /**
         * Station fists.
         * @member {number} fists
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.fists = 0;

        /**
         * Station fistsCc.
         * @member {number} fistsCc
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.fistsCc = 0;

        /**
         * Station iota.
         * @member {string} iota
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.iota = "";

        /**
         * Station iotaIslandId.
         * @member {number} iotaIslandId
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.iotaIslandId = 0;

        /**
         * Station pfx.
         * @member {string} pfx
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.pfx = "";

        /**
         * Station region.
         * @member {string} region
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.region = "";

        /**
         * Station skcc.
         * @member {string} skcc
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.skcc = "";

        /**
         * Station sig.
         * @member {string} sig
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.sig = "";

        /**
         * Station sigInfo.
         * @member {string} sigInfo
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.sigInfo = "";

        /**
         * Station sotaRef.
         * @member {string} sotaRef
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.sotaRef = "";

        /**
         * Station tenTen.
         * @member {number} tenTen
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.tenTen = 0;

        /**
         * Station usacaCounties.
         * @member {string} usacaCounties
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.usacaCounties = "";

        /**
         * Station uksmg.
         * @member {number} uksmg
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.uksmg = 0;

        /**
         * Station vuccGrids.
         * @member {string} vuccGrids
         * @memberof adif.Station
         * @instance
         */
        Station.prototype.vuccGrids = "";

        /**
         * Creates a new Station instance using the specified properties.
         * @function create
         * @memberof adif.Station
         * @static
         * @param {adif.IStation=} [properties] Properties to set
         * @returns {adif.Station} Station instance
         */
        Station.create = function create(properties) {
            return new Station(properties);
        };

        /**
         * Encodes the specified Station message. Does not implicitly {@link adif.Station.verify|verify} messages.
         * @function encode
         * @memberof adif.Station
         * @static
         * @param {adif.IStation} message Station message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Station.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.opCall != null && Object.hasOwnProperty.call(message, "opCall"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.opCall);
            if (message.opName != null && Object.hasOwnProperty.call(message, "opName"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.opName);
            if (message.gridSquare != null && Object.hasOwnProperty.call(message, "gridSquare"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.gridSquare);
            if (message.latitude != null && Object.hasOwnProperty.call(message, "latitude"))
                writer.uint32(/* id 4, wireType 1 =*/33).double(message.latitude);
            if (message.longitude != null && Object.hasOwnProperty.call(message, "longitude"))
                writer.uint32(/* id 5, wireType 1 =*/41).double(message.longitude);
            if (message.power != null && Object.hasOwnProperty.call(message, "power"))
                writer.uint32(/* id 6, wireType 1 =*/49).double(message.power);
            if (message.rig != null && Object.hasOwnProperty.call(message, "rig"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.rig);
            if (message.antenna != null && Object.hasOwnProperty.call(message, "antenna"))
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.antenna);
            if (message.antennaAzimuth != null && Object.hasOwnProperty.call(message, "antennaAzimuth"))
                writer.uint32(/* id 9, wireType 0 =*/72).int32(message.antennaAzimuth);
            if (message.antennaElevation != null && Object.hasOwnProperty.call(message, "antennaElevation"))
                writer.uint32(/* id 10, wireType 0 =*/80).int32(message.antennaElevation);
            if (message.ownerCall != null && Object.hasOwnProperty.call(message, "ownerCall"))
                writer.uint32(/* id 11, wireType 2 =*/90).string(message.ownerCall);
            if (message.stationCall != null && Object.hasOwnProperty.call(message, "stationCall"))
                writer.uint32(/* id 12, wireType 2 =*/98).string(message.stationCall);
            if (message.age != null && Object.hasOwnProperty.call(message, "age"))
                writer.uint32(/* id 13, wireType 0 =*/104).uint32(message.age);
            if (message.silentKey != null && Object.hasOwnProperty.call(message, "silentKey"))
                writer.uint32(/* id 14, wireType 0 =*/112).bool(message.silentKey);
            if (message.qslVia != null && Object.hasOwnProperty.call(message, "qslVia"))
                writer.uint32(/* id 15, wireType 2 =*/122).string(message.qslVia);
            if (message.address != null && Object.hasOwnProperty.call(message, "address"))
                writer.uint32(/* id 16, wireType 2 =*/130).string(message.address);
            if (message.street != null && Object.hasOwnProperty.call(message, "street"))
                writer.uint32(/* id 17, wireType 2 =*/138).string(message.street);
            if (message.city != null && Object.hasOwnProperty.call(message, "city"))
                writer.uint32(/* id 18, wireType 2 =*/146).string(message.city);
            if (message.postalCode != null && Object.hasOwnProperty.call(message, "postalCode"))
                writer.uint32(/* id 19, wireType 2 =*/154).string(message.postalCode);
            if (message.county != null && Object.hasOwnProperty.call(message, "county"))
                writer.uint32(/* id 20, wireType 2 =*/162).string(message.county);
            if (message.state != null && Object.hasOwnProperty.call(message, "state"))
                writer.uint32(/* id 21, wireType 2 =*/170).string(message.state);
            if (message.country != null && Object.hasOwnProperty.call(message, "country"))
                writer.uint32(/* id 22, wireType 2 =*/178).string(message.country);
            if (message.dxcc != null && Object.hasOwnProperty.call(message, "dxcc"))
                writer.uint32(/* id 23, wireType 0 =*/184).uint32(message.dxcc);
            if (message.continent != null && Object.hasOwnProperty.call(message, "continent"))
                writer.uint32(/* id 24, wireType 2 =*/194).string(message.continent);
            if (message.email != null && Object.hasOwnProperty.call(message, "email"))
                writer.uint32(/* id 25, wireType 2 =*/202).string(message.email);
            if (message.web != null && Object.hasOwnProperty.call(message, "web"))
                writer.uint32(/* id 26, wireType 2 =*/210).string(message.web);
            if (message.cqZone != null && Object.hasOwnProperty.call(message, "cqZone"))
                writer.uint32(/* id 27, wireType 0 =*/216).uint32(message.cqZone);
            if (message.ituZone != null && Object.hasOwnProperty.call(message, "ituZone"))
                writer.uint32(/* id 28, wireType 0 =*/224).uint32(message.ituZone);
            if (message.darcDok != null && Object.hasOwnProperty.call(message, "darcDok"))
                writer.uint32(/* id 29, wireType 2 =*/234).string(message.darcDok);
            if (message.fists != null && Object.hasOwnProperty.call(message, "fists"))
                writer.uint32(/* id 30, wireType 0 =*/240).uint32(message.fists);
            if (message.fistsCc != null && Object.hasOwnProperty.call(message, "fistsCc"))
                writer.uint32(/* id 31, wireType 0 =*/248).uint32(message.fistsCc);
            if (message.iota != null && Object.hasOwnProperty.call(message, "iota"))
                writer.uint32(/* id 32, wireType 2 =*/258).string(message.iota);
            if (message.iotaIslandId != null && Object.hasOwnProperty.call(message, "iotaIslandId"))
                writer.uint32(/* id 33, wireType 0 =*/264).uint32(message.iotaIslandId);
            if (message.pfx != null && Object.hasOwnProperty.call(message, "pfx"))
                writer.uint32(/* id 34, wireType 2 =*/274).string(message.pfx);
            if (message.region != null && Object.hasOwnProperty.call(message, "region"))
                writer.uint32(/* id 35, wireType 2 =*/282).string(message.region);
            if (message.skcc != null && Object.hasOwnProperty.call(message, "skcc"))
                writer.uint32(/* id 36, wireType 2 =*/290).string(message.skcc);
            if (message.sig != null && Object.hasOwnProperty.call(message, "sig"))
                writer.uint32(/* id 37, wireType 2 =*/298).string(message.sig);
            if (message.sigInfo != null && Object.hasOwnProperty.call(message, "sigInfo"))
                writer.uint32(/* id 38, wireType 2 =*/306).string(message.sigInfo);
            if (message.sotaRef != null && Object.hasOwnProperty.call(message, "sotaRef"))
                writer.uint32(/* id 39, wireType 2 =*/314).string(message.sotaRef);
            if (message.tenTen != null && Object.hasOwnProperty.call(message, "tenTen"))
                writer.uint32(/* id 40, wireType 0 =*/320).uint32(message.tenTen);
            if (message.usacaCounties != null && Object.hasOwnProperty.call(message, "usacaCounties"))
                writer.uint32(/* id 41, wireType 2 =*/330).string(message.usacaCounties);
            if (message.uksmg != null && Object.hasOwnProperty.call(message, "uksmg"))
                writer.uint32(/* id 42, wireType 0 =*/336).uint32(message.uksmg);
            if (message.vuccGrids != null && Object.hasOwnProperty.call(message, "vuccGrids"))
                writer.uint32(/* id 43, wireType 2 =*/346).string(message.vuccGrids);
            return writer;
        };

        /**
         * Encodes the specified Station message, length delimited. Does not implicitly {@link adif.Station.verify|verify} messages.
         * @function encodeDelimited
         * @memberof adif.Station
         * @static
         * @param {adif.IStation} message Station message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Station.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Station message from the specified reader or buffer.
         * @function decode
         * @memberof adif.Station
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {adif.Station} Station
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Station.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.adif.Station();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.opCall = reader.string();
                    break;
                case 2:
                    message.opName = reader.string();
                    break;
                case 3:
                    message.gridSquare = reader.string();
                    break;
                case 4:
                    message.latitude = reader.double();
                    break;
                case 5:
                    message.longitude = reader.double();
                    break;
                case 6:
                    message.power = reader.double();
                    break;
                case 7:
                    message.rig = reader.string();
                    break;
                case 8:
                    message.antenna = reader.string();
                    break;
                case 9:
                    message.antennaAzimuth = reader.int32();
                    break;
                case 10:
                    message.antennaElevation = reader.int32();
                    break;
                case 11:
                    message.ownerCall = reader.string();
                    break;
                case 12:
                    message.stationCall = reader.string();
                    break;
                case 13:
                    message.age = reader.uint32();
                    break;
                case 14:
                    message.silentKey = reader.bool();
                    break;
                case 15:
                    message.qslVia = reader.string();
                    break;
                case 16:
                    message.address = reader.string();
                    break;
                case 17:
                    message.street = reader.string();
                    break;
                case 18:
                    message.city = reader.string();
                    break;
                case 19:
                    message.postalCode = reader.string();
                    break;
                case 20:
                    message.county = reader.string();
                    break;
                case 21:
                    message.state = reader.string();
                    break;
                case 22:
                    message.country = reader.string();
                    break;
                case 23:
                    message.dxcc = reader.uint32();
                    break;
                case 24:
                    message.continent = reader.string();
                    break;
                case 25:
                    message.email = reader.string();
                    break;
                case 26:
                    message.web = reader.string();
                    break;
                case 27:
                    message.cqZone = reader.uint32();
                    break;
                case 28:
                    message.ituZone = reader.uint32();
                    break;
                case 29:
                    message.darcDok = reader.string();
                    break;
                case 30:
                    message.fists = reader.uint32();
                    break;
                case 31:
                    message.fistsCc = reader.uint32();
                    break;
                case 32:
                    message.iota = reader.string();
                    break;
                case 33:
                    message.iotaIslandId = reader.uint32();
                    break;
                case 34:
                    message.pfx = reader.string();
                    break;
                case 35:
                    message.region = reader.string();
                    break;
                case 36:
                    message.skcc = reader.string();
                    break;
                case 37:
                    message.sig = reader.string();
                    break;
                case 38:
                    message.sigInfo = reader.string();
                    break;
                case 39:
                    message.sotaRef = reader.string();
                    break;
                case 40:
                    message.tenTen = reader.uint32();
                    break;
                case 41:
                    message.usacaCounties = reader.string();
                    break;
                case 42:
                    message.uksmg = reader.uint32();
                    break;
                case 43:
                    message.vuccGrids = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Station message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof adif.Station
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {adif.Station} Station
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Station.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Station message.
         * @function verify
         * @memberof adif.Station
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Station.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.opCall != null && message.hasOwnProperty("opCall"))
                if (!$util.isString(message.opCall))
                    return "opCall: string expected";
            if (message.opName != null && message.hasOwnProperty("opName"))
                if (!$util.isString(message.opName))
                    return "opName: string expected";
            if (message.gridSquare != null && message.hasOwnProperty("gridSquare"))
                if (!$util.isString(message.gridSquare))
                    return "gridSquare: string expected";
            if (message.latitude != null && message.hasOwnProperty("latitude"))
                if (typeof message.latitude !== "number")
                    return "latitude: number expected";
            if (message.longitude != null && message.hasOwnProperty("longitude"))
                if (typeof message.longitude !== "number")
                    return "longitude: number expected";
            if (message.power != null && message.hasOwnProperty("power"))
                if (typeof message.power !== "number")
                    return "power: number expected";
            if (message.rig != null && message.hasOwnProperty("rig"))
                if (!$util.isString(message.rig))
                    return "rig: string expected";
            if (message.antenna != null && message.hasOwnProperty("antenna"))
                if (!$util.isString(message.antenna))
                    return "antenna: string expected";
            if (message.antennaAzimuth != null && message.hasOwnProperty("antennaAzimuth"))
                if (!$util.isInteger(message.antennaAzimuth))
                    return "antennaAzimuth: integer expected";
            if (message.antennaElevation != null && message.hasOwnProperty("antennaElevation"))
                if (!$util.isInteger(message.antennaElevation))
                    return "antennaElevation: integer expected";
            if (message.ownerCall != null && message.hasOwnProperty("ownerCall"))
                if (!$util.isString(message.ownerCall))
                    return "ownerCall: string expected";
            if (message.stationCall != null && message.hasOwnProperty("stationCall"))
                if (!$util.isString(message.stationCall))
                    return "stationCall: string expected";
            if (message.age != null && message.hasOwnProperty("age"))
                if (!$util.isInteger(message.age))
                    return "age: integer expected";
            if (message.silentKey != null && message.hasOwnProperty("silentKey"))
                if (typeof message.silentKey !== "boolean")
                    return "silentKey: boolean expected";
            if (message.qslVia != null && message.hasOwnProperty("qslVia"))
                if (!$util.isString(message.qslVia))
                    return "qslVia: string expected";
            if (message.address != null && message.hasOwnProperty("address"))
                if (!$util.isString(message.address))
                    return "address: string expected";
            if (message.street != null && message.hasOwnProperty("street"))
                if (!$util.isString(message.street))
                    return "street: string expected";
            if (message.city != null && message.hasOwnProperty("city"))
                if (!$util.isString(message.city))
                    return "city: string expected";
            if (message.postalCode != null && message.hasOwnProperty("postalCode"))
                if (!$util.isString(message.postalCode))
                    return "postalCode: string expected";
            if (message.county != null && message.hasOwnProperty("county"))
                if (!$util.isString(message.county))
                    return "county: string expected";
            if (message.state != null && message.hasOwnProperty("state"))
                if (!$util.isString(message.state))
                    return "state: string expected";
            if (message.country != null && message.hasOwnProperty("country"))
                if (!$util.isString(message.country))
                    return "country: string expected";
            if (message.dxcc != null && message.hasOwnProperty("dxcc"))
                if (!$util.isInteger(message.dxcc))
                    return "dxcc: integer expected";
            if (message.continent != null && message.hasOwnProperty("continent"))
                if (!$util.isString(message.continent))
                    return "continent: string expected";
            if (message.email != null && message.hasOwnProperty("email"))
                if (!$util.isString(message.email))
                    return "email: string expected";
            if (message.web != null && message.hasOwnProperty("web"))
                if (!$util.isString(message.web))
                    return "web: string expected";
            if (message.cqZone != null && message.hasOwnProperty("cqZone"))
                if (!$util.isInteger(message.cqZone))
                    return "cqZone: integer expected";
            if (message.ituZone != null && message.hasOwnProperty("ituZone"))
                if (!$util.isInteger(message.ituZone))
                    return "ituZone: integer expected";
            if (message.darcDok != null && message.hasOwnProperty("darcDok"))
                if (!$util.isString(message.darcDok))
                    return "darcDok: string expected";
            if (message.fists != null && message.hasOwnProperty("fists"))
                if (!$util.isInteger(message.fists))
                    return "fists: integer expected";
            if (message.fistsCc != null && message.hasOwnProperty("fistsCc"))
                if (!$util.isInteger(message.fistsCc))
                    return "fistsCc: integer expected";
            if (message.iota != null && message.hasOwnProperty("iota"))
                if (!$util.isString(message.iota))
                    return "iota: string expected";
            if (message.iotaIslandId != null && message.hasOwnProperty("iotaIslandId"))
                if (!$util.isInteger(message.iotaIslandId))
                    return "iotaIslandId: integer expected";
            if (message.pfx != null && message.hasOwnProperty("pfx"))
                if (!$util.isString(message.pfx))
                    return "pfx: string expected";
            if (message.region != null && message.hasOwnProperty("region"))
                if (!$util.isString(message.region))
                    return "region: string expected";
            if (message.skcc != null && message.hasOwnProperty("skcc"))
                if (!$util.isString(message.skcc))
                    return "skcc: string expected";
            if (message.sig != null && message.hasOwnProperty("sig"))
                if (!$util.isString(message.sig))
                    return "sig: string expected";
            if (message.sigInfo != null && message.hasOwnProperty("sigInfo"))
                if (!$util.isString(message.sigInfo))
                    return "sigInfo: string expected";
            if (message.sotaRef != null && message.hasOwnProperty("sotaRef"))
                if (!$util.isString(message.sotaRef))
                    return "sotaRef: string expected";
            if (message.tenTen != null && message.hasOwnProperty("tenTen"))
                if (!$util.isInteger(message.tenTen))
                    return "tenTen: integer expected";
            if (message.usacaCounties != null && message.hasOwnProperty("usacaCounties"))
                if (!$util.isString(message.usacaCounties))
                    return "usacaCounties: string expected";
            if (message.uksmg != null && message.hasOwnProperty("uksmg"))
                if (!$util.isInteger(message.uksmg))
                    return "uksmg: integer expected";
            if (message.vuccGrids != null && message.hasOwnProperty("vuccGrids"))
                if (!$util.isString(message.vuccGrids))
                    return "vuccGrids: string expected";
            return null;
        };

        /**
         * Creates a Station message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof adif.Station
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {adif.Station} Station
         */
        Station.fromObject = function fromObject(object) {
            if (object instanceof $root.adif.Station)
                return object;
            var message = new $root.adif.Station();
            if (object.opCall != null)
                message.opCall = String(object.opCall);
            if (object.opName != null)
                message.opName = String(object.opName);
            if (object.gridSquare != null)
                message.gridSquare = String(object.gridSquare);
            if (object.latitude != null)
                message.latitude = Number(object.latitude);
            if (object.longitude != null)
                message.longitude = Number(object.longitude);
            if (object.power != null)
                message.power = Number(object.power);
            if (object.rig != null)
                message.rig = String(object.rig);
            if (object.antenna != null)
                message.antenna = String(object.antenna);
            if (object.antennaAzimuth != null)
                message.antennaAzimuth = object.antennaAzimuth | 0;
            if (object.antennaElevation != null)
                message.antennaElevation = object.antennaElevation | 0;
            if (object.ownerCall != null)
                message.ownerCall = String(object.ownerCall);
            if (object.stationCall != null)
                message.stationCall = String(object.stationCall);
            if (object.age != null)
                message.age = object.age >>> 0;
            if (object.silentKey != null)
                message.silentKey = Boolean(object.silentKey);
            if (object.qslVia != null)
                message.qslVia = String(object.qslVia);
            if (object.address != null)
                message.address = String(object.address);
            if (object.street != null)
                message.street = String(object.street);
            if (object.city != null)
                message.city = String(object.city);
            if (object.postalCode != null)
                message.postalCode = String(object.postalCode);
            if (object.county != null)
                message.county = String(object.county);
            if (object.state != null)
                message.state = String(object.state);
            if (object.country != null)
                message.country = String(object.country);
            if (object.dxcc != null)
                message.dxcc = object.dxcc >>> 0;
            if (object.continent != null)
                message.continent = String(object.continent);
            if (object.email != null)
                message.email = String(object.email);
            if (object.web != null)
                message.web = String(object.web);
            if (object.cqZone != null)
                message.cqZone = object.cqZone >>> 0;
            if (object.ituZone != null)
                message.ituZone = object.ituZone >>> 0;
            if (object.darcDok != null)
                message.darcDok = String(object.darcDok);
            if (object.fists != null)
                message.fists = object.fists >>> 0;
            if (object.fistsCc != null)
                message.fistsCc = object.fistsCc >>> 0;
            if (object.iota != null)
                message.iota = String(object.iota);
            if (object.iotaIslandId != null)
                message.iotaIslandId = object.iotaIslandId >>> 0;
            if (object.pfx != null)
                message.pfx = String(object.pfx);
            if (object.region != null)
                message.region = String(object.region);
            if (object.skcc != null)
                message.skcc = String(object.skcc);
            if (object.sig != null)
                message.sig = String(object.sig);
            if (object.sigInfo != null)
                message.sigInfo = String(object.sigInfo);
            if (object.sotaRef != null)
                message.sotaRef = String(object.sotaRef);
            if (object.tenTen != null)
                message.tenTen = object.tenTen >>> 0;
            if (object.usacaCounties != null)
                message.usacaCounties = String(object.usacaCounties);
            if (object.uksmg != null)
                message.uksmg = object.uksmg >>> 0;
            if (object.vuccGrids != null)
                message.vuccGrids = String(object.vuccGrids);
            return message;
        };

        /**
         * Creates a plain object from a Station message. Also converts values to other types if specified.
         * @function toObject
         * @memberof adif.Station
         * @static
         * @param {adif.Station} message Station
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Station.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.opCall = "";
                object.opName = "";
                object.gridSquare = "";
                object.latitude = 0;
                object.longitude = 0;
                object.power = 0;
                object.rig = "";
                object.antenna = "";
                object.antennaAzimuth = 0;
                object.antennaElevation = 0;
                object.ownerCall = "";
                object.stationCall = "";
                object.age = 0;
                object.silentKey = false;
                object.qslVia = "";
                object.address = "";
                object.street = "";
                object.city = "";
                object.postalCode = "";
                object.county = "";
                object.state = "";
                object.country = "";
                object.dxcc = 0;
                object.continent = "";
                object.email = "";
                object.web = "";
                object.cqZone = 0;
                object.ituZone = 0;
                object.darcDok = "";
                object.fists = 0;
                object.fistsCc = 0;
                object.iota = "";
                object.iotaIslandId = 0;
                object.pfx = "";
                object.region = "";
                object.skcc = "";
                object.sig = "";
                object.sigInfo = "";
                object.sotaRef = "";
                object.tenTen = 0;
                object.usacaCounties = "";
                object.uksmg = 0;
                object.vuccGrids = "";
            }
            if (message.opCall != null && message.hasOwnProperty("opCall"))
                object.opCall = message.opCall;
            if (message.opName != null && message.hasOwnProperty("opName"))
                object.opName = message.opName;
            if (message.gridSquare != null && message.hasOwnProperty("gridSquare"))
                object.gridSquare = message.gridSquare;
            if (message.latitude != null && message.hasOwnProperty("latitude"))
                object.latitude = options.json && !isFinite(message.latitude) ? String(message.latitude) : message.latitude;
            if (message.longitude != null && message.hasOwnProperty("longitude"))
                object.longitude = options.json && !isFinite(message.longitude) ? String(message.longitude) : message.longitude;
            if (message.power != null && message.hasOwnProperty("power"))
                object.power = options.json && !isFinite(message.power) ? String(message.power) : message.power;
            if (message.rig != null && message.hasOwnProperty("rig"))
                object.rig = message.rig;
            if (message.antenna != null && message.hasOwnProperty("antenna"))
                object.antenna = message.antenna;
            if (message.antennaAzimuth != null && message.hasOwnProperty("antennaAzimuth"))
                object.antennaAzimuth = message.antennaAzimuth;
            if (message.antennaElevation != null && message.hasOwnProperty("antennaElevation"))
                object.antennaElevation = message.antennaElevation;
            if (message.ownerCall != null && message.hasOwnProperty("ownerCall"))
                object.ownerCall = message.ownerCall;
            if (message.stationCall != null && message.hasOwnProperty("stationCall"))
                object.stationCall = message.stationCall;
            if (message.age != null && message.hasOwnProperty("age"))
                object.age = message.age;
            if (message.silentKey != null && message.hasOwnProperty("silentKey"))
                object.silentKey = message.silentKey;
            if (message.qslVia != null && message.hasOwnProperty("qslVia"))
                object.qslVia = message.qslVia;
            if (message.address != null && message.hasOwnProperty("address"))
                object.address = message.address;
            if (message.street != null && message.hasOwnProperty("street"))
                object.street = message.street;
            if (message.city != null && message.hasOwnProperty("city"))
                object.city = message.city;
            if (message.postalCode != null && message.hasOwnProperty("postalCode"))
                object.postalCode = message.postalCode;
            if (message.county != null && message.hasOwnProperty("county"))
                object.county = message.county;
            if (message.state != null && message.hasOwnProperty("state"))
                object.state = message.state;
            if (message.country != null && message.hasOwnProperty("country"))
                object.country = message.country;
            if (message.dxcc != null && message.hasOwnProperty("dxcc"))
                object.dxcc = message.dxcc;
            if (message.continent != null && message.hasOwnProperty("continent"))
                object.continent = message.continent;
            if (message.email != null && message.hasOwnProperty("email"))
                object.email = message.email;
            if (message.web != null && message.hasOwnProperty("web"))
                object.web = message.web;
            if (message.cqZone != null && message.hasOwnProperty("cqZone"))
                object.cqZone = message.cqZone;
            if (message.ituZone != null && message.hasOwnProperty("ituZone"))
                object.ituZone = message.ituZone;
            if (message.darcDok != null && message.hasOwnProperty("darcDok"))
                object.darcDok = message.darcDok;
            if (message.fists != null && message.hasOwnProperty("fists"))
                object.fists = message.fists;
            if (message.fistsCc != null && message.hasOwnProperty("fistsCc"))
                object.fistsCc = message.fistsCc;
            if (message.iota != null && message.hasOwnProperty("iota"))
                object.iota = message.iota;
            if (message.iotaIslandId != null && message.hasOwnProperty("iotaIslandId"))
                object.iotaIslandId = message.iotaIslandId;
            if (message.pfx != null && message.hasOwnProperty("pfx"))
                object.pfx = message.pfx;
            if (message.region != null && message.hasOwnProperty("region"))
                object.region = message.region;
            if (message.skcc != null && message.hasOwnProperty("skcc"))
                object.skcc = message.skcc;
            if (message.sig != null && message.hasOwnProperty("sig"))
                object.sig = message.sig;
            if (message.sigInfo != null && message.hasOwnProperty("sigInfo"))
                object.sigInfo = message.sigInfo;
            if (message.sotaRef != null && message.hasOwnProperty("sotaRef"))
                object.sotaRef = message.sotaRef;
            if (message.tenTen != null && message.hasOwnProperty("tenTen"))
                object.tenTen = message.tenTen;
            if (message.usacaCounties != null && message.hasOwnProperty("usacaCounties"))
                object.usacaCounties = message.usacaCounties;
            if (message.uksmg != null && message.hasOwnProperty("uksmg"))
                object.uksmg = message.uksmg;
            if (message.vuccGrids != null && message.hasOwnProperty("vuccGrids"))
                object.vuccGrids = message.vuccGrids;
            return object;
        };

        /**
         * Converts this Station to JSON.
         * @function toJSON
         * @memberof adif.Station
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Station.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Station;
    })();

    adif.Propagation = (function() {

        /**
         * Properties of a Propagation.
         * @memberof adif
         * @interface IPropagation
         * @property {string|null} [propagationMode] Propagation propagationMode
         * @property {number|null} [aIndex] Propagation aIndex
         * @property {number|null} [kIndex] Propagation kIndex
         * @property {number|null} [solarFluxIndex] Propagation solarFluxIndex
         * @property {string|null} [antPath] Propagation antPath
         * @property {boolean|null} [forceInit] Propagation forceInit
         * @property {number|null} [maxBursts] Propagation maxBursts
         * @property {string|null} [meteorShowerName] Propagation meteorShowerName
         * @property {number|null} [nrBursts] Propagation nrBursts
         * @property {number|null} [nrPings] Propagation nrPings
         * @property {string|null} [satMode] Propagation satMode
         * @property {string|null} [satName] Propagation satName
         */

        /**
         * Constructs a new Propagation.
         * @memberof adif
         * @classdesc Represents a Propagation.
         * @implements IPropagation
         * @constructor
         * @param {adif.IPropagation=} [properties] Properties to set
         */
        function Propagation(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Propagation propagationMode.
         * @member {string} propagationMode
         * @memberof adif.Propagation
         * @instance
         */
        Propagation.prototype.propagationMode = "";

        /**
         * Propagation aIndex.
         * @member {number} aIndex
         * @memberof adif.Propagation
         * @instance
         */
        Propagation.prototype.aIndex = 0;

        /**
         * Propagation kIndex.
         * @member {number} kIndex
         * @memberof adif.Propagation
         * @instance
         */
        Propagation.prototype.kIndex = 0;

        /**
         * Propagation solarFluxIndex.
         * @member {number} solarFluxIndex
         * @memberof adif.Propagation
         * @instance
         */
        Propagation.prototype.solarFluxIndex = 0;

        /**
         * Propagation antPath.
         * @member {string} antPath
         * @memberof adif.Propagation
         * @instance
         */
        Propagation.prototype.antPath = "";

        /**
         * Propagation forceInit.
         * @member {boolean} forceInit
         * @memberof adif.Propagation
         * @instance
         */
        Propagation.prototype.forceInit = false;

        /**
         * Propagation maxBursts.
         * @member {number} maxBursts
         * @memberof adif.Propagation
         * @instance
         */
        Propagation.prototype.maxBursts = 0;

        /**
         * Propagation meteorShowerName.
         * @member {string} meteorShowerName
         * @memberof adif.Propagation
         * @instance
         */
        Propagation.prototype.meteorShowerName = "";

        /**
         * Propagation nrBursts.
         * @member {number} nrBursts
         * @memberof adif.Propagation
         * @instance
         */
        Propagation.prototype.nrBursts = 0;

        /**
         * Propagation nrPings.
         * @member {number} nrPings
         * @memberof adif.Propagation
         * @instance
         */
        Propagation.prototype.nrPings = 0;

        /**
         * Propagation satMode.
         * @member {string} satMode
         * @memberof adif.Propagation
         * @instance
         */
        Propagation.prototype.satMode = "";

        /**
         * Propagation satName.
         * @member {string} satName
         * @memberof adif.Propagation
         * @instance
         */
        Propagation.prototype.satName = "";

        /**
         * Creates a new Propagation instance using the specified properties.
         * @function create
         * @memberof adif.Propagation
         * @static
         * @param {adif.IPropagation=} [properties] Properties to set
         * @returns {adif.Propagation} Propagation instance
         */
        Propagation.create = function create(properties) {
            return new Propagation(properties);
        };

        /**
         * Encodes the specified Propagation message. Does not implicitly {@link adif.Propagation.verify|verify} messages.
         * @function encode
         * @memberof adif.Propagation
         * @static
         * @param {adif.IPropagation} message Propagation message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Propagation.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.propagationMode != null && Object.hasOwnProperty.call(message, "propagationMode"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.propagationMode);
            if (message.aIndex != null && Object.hasOwnProperty.call(message, "aIndex"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.aIndex);
            if (message.kIndex != null && Object.hasOwnProperty.call(message, "kIndex"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.kIndex);
            if (message.solarFluxIndex != null && Object.hasOwnProperty.call(message, "solarFluxIndex"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.solarFluxIndex);
            if (message.antPath != null && Object.hasOwnProperty.call(message, "antPath"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.antPath);
            if (message.forceInit != null && Object.hasOwnProperty.call(message, "forceInit"))
                writer.uint32(/* id 6, wireType 0 =*/48).bool(message.forceInit);
            if (message.maxBursts != null && Object.hasOwnProperty.call(message, "maxBursts"))
                writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.maxBursts);
            if (message.meteorShowerName != null && Object.hasOwnProperty.call(message, "meteorShowerName"))
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.meteorShowerName);
            if (message.satMode != null && Object.hasOwnProperty.call(message, "satMode"))
                writer.uint32(/* id 9, wireType 2 =*/74).string(message.satMode);
            if (message.satName != null && Object.hasOwnProperty.call(message, "satName"))
                writer.uint32(/* id 10, wireType 2 =*/82).string(message.satName);
            if (message.nrBursts != null && Object.hasOwnProperty.call(message, "nrBursts"))
                writer.uint32(/* id 11, wireType 0 =*/88).uint32(message.nrBursts);
            if (message.nrPings != null && Object.hasOwnProperty.call(message, "nrPings"))
                writer.uint32(/* id 12, wireType 0 =*/96).uint32(message.nrPings);
            return writer;
        };

        /**
         * Encodes the specified Propagation message, length delimited. Does not implicitly {@link adif.Propagation.verify|verify} messages.
         * @function encodeDelimited
         * @memberof adif.Propagation
         * @static
         * @param {adif.IPropagation} message Propagation message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Propagation.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Propagation message from the specified reader or buffer.
         * @function decode
         * @memberof adif.Propagation
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {adif.Propagation} Propagation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Propagation.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.adif.Propagation();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.propagationMode = reader.string();
                    break;
                case 2:
                    message.aIndex = reader.uint32();
                    break;
                case 3:
                    message.kIndex = reader.uint32();
                    break;
                case 4:
                    message.solarFluxIndex = reader.uint32();
                    break;
                case 5:
                    message.antPath = reader.string();
                    break;
                case 6:
                    message.forceInit = reader.bool();
                    break;
                case 7:
                    message.maxBursts = reader.uint32();
                    break;
                case 8:
                    message.meteorShowerName = reader.string();
                    break;
                case 11:
                    message.nrBursts = reader.uint32();
                    break;
                case 12:
                    message.nrPings = reader.uint32();
                    break;
                case 9:
                    message.satMode = reader.string();
                    break;
                case 10:
                    message.satName = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Propagation message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof adif.Propagation
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {adif.Propagation} Propagation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Propagation.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Propagation message.
         * @function verify
         * @memberof adif.Propagation
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Propagation.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.propagationMode != null && message.hasOwnProperty("propagationMode"))
                if (!$util.isString(message.propagationMode))
                    return "propagationMode: string expected";
            if (message.aIndex != null && message.hasOwnProperty("aIndex"))
                if (!$util.isInteger(message.aIndex))
                    return "aIndex: integer expected";
            if (message.kIndex != null && message.hasOwnProperty("kIndex"))
                if (!$util.isInteger(message.kIndex))
                    return "kIndex: integer expected";
            if (message.solarFluxIndex != null && message.hasOwnProperty("solarFluxIndex"))
                if (!$util.isInteger(message.solarFluxIndex))
                    return "solarFluxIndex: integer expected";
            if (message.antPath != null && message.hasOwnProperty("antPath"))
                if (!$util.isString(message.antPath))
                    return "antPath: string expected";
            if (message.forceInit != null && message.hasOwnProperty("forceInit"))
                if (typeof message.forceInit !== "boolean")
                    return "forceInit: boolean expected";
            if (message.maxBursts != null && message.hasOwnProperty("maxBursts"))
                if (!$util.isInteger(message.maxBursts))
                    return "maxBursts: integer expected";
            if (message.meteorShowerName != null && message.hasOwnProperty("meteorShowerName"))
                if (!$util.isString(message.meteorShowerName))
                    return "meteorShowerName: string expected";
            if (message.nrBursts != null && message.hasOwnProperty("nrBursts"))
                if (!$util.isInteger(message.nrBursts))
                    return "nrBursts: integer expected";
            if (message.nrPings != null && message.hasOwnProperty("nrPings"))
                if (!$util.isInteger(message.nrPings))
                    return "nrPings: integer expected";
            if (message.satMode != null && message.hasOwnProperty("satMode"))
                if (!$util.isString(message.satMode))
                    return "satMode: string expected";
            if (message.satName != null && message.hasOwnProperty("satName"))
                if (!$util.isString(message.satName))
                    return "satName: string expected";
            return null;
        };

        /**
         * Creates a Propagation message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof adif.Propagation
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {adif.Propagation} Propagation
         */
        Propagation.fromObject = function fromObject(object) {
            if (object instanceof $root.adif.Propagation)
                return object;
            var message = new $root.adif.Propagation();
            if (object.propagationMode != null)
                message.propagationMode = String(object.propagationMode);
            if (object.aIndex != null)
                message.aIndex = object.aIndex >>> 0;
            if (object.kIndex != null)
                message.kIndex = object.kIndex >>> 0;
            if (object.solarFluxIndex != null)
                message.solarFluxIndex = object.solarFluxIndex >>> 0;
            if (object.antPath != null)
                message.antPath = String(object.antPath);
            if (object.forceInit != null)
                message.forceInit = Boolean(object.forceInit);
            if (object.maxBursts != null)
                message.maxBursts = object.maxBursts >>> 0;
            if (object.meteorShowerName != null)
                message.meteorShowerName = String(object.meteorShowerName);
            if (object.nrBursts != null)
                message.nrBursts = object.nrBursts >>> 0;
            if (object.nrPings != null)
                message.nrPings = object.nrPings >>> 0;
            if (object.satMode != null)
                message.satMode = String(object.satMode);
            if (object.satName != null)
                message.satName = String(object.satName);
            return message;
        };

        /**
         * Creates a plain object from a Propagation message. Also converts values to other types if specified.
         * @function toObject
         * @memberof adif.Propagation
         * @static
         * @param {adif.Propagation} message Propagation
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Propagation.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.propagationMode = "";
                object.aIndex = 0;
                object.kIndex = 0;
                object.solarFluxIndex = 0;
                object.antPath = "";
                object.forceInit = false;
                object.maxBursts = 0;
                object.meteorShowerName = "";
                object.satMode = "";
                object.satName = "";
                object.nrBursts = 0;
                object.nrPings = 0;
            }
            if (message.propagationMode != null && message.hasOwnProperty("propagationMode"))
                object.propagationMode = message.propagationMode;
            if (message.aIndex != null && message.hasOwnProperty("aIndex"))
                object.aIndex = message.aIndex;
            if (message.kIndex != null && message.hasOwnProperty("kIndex"))
                object.kIndex = message.kIndex;
            if (message.solarFluxIndex != null && message.hasOwnProperty("solarFluxIndex"))
                object.solarFluxIndex = message.solarFluxIndex;
            if (message.antPath != null && message.hasOwnProperty("antPath"))
                object.antPath = message.antPath;
            if (message.forceInit != null && message.hasOwnProperty("forceInit"))
                object.forceInit = message.forceInit;
            if (message.maxBursts != null && message.hasOwnProperty("maxBursts"))
                object.maxBursts = message.maxBursts;
            if (message.meteorShowerName != null && message.hasOwnProperty("meteorShowerName"))
                object.meteorShowerName = message.meteorShowerName;
            if (message.satMode != null && message.hasOwnProperty("satMode"))
                object.satMode = message.satMode;
            if (message.satName != null && message.hasOwnProperty("satName"))
                object.satName = message.satName;
            if (message.nrBursts != null && message.hasOwnProperty("nrBursts"))
                object.nrBursts = message.nrBursts;
            if (message.nrPings != null && message.hasOwnProperty("nrPings"))
                object.nrPings = message.nrPings;
            return object;
        };

        /**
         * Converts this Propagation to JSON.
         * @function toJSON
         * @memberof adif.Propagation
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Propagation.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Propagation;
    })();

    adif.ContestData = (function() {

        /**
         * Properties of a ContestData.
         * @memberof adif
         * @interface IContestData
         * @property {string|null} [contestId] ContestData contestId
         * @property {string|null} [serialSent] ContestData serialSent
         * @property {string|null} [serialReceived] ContestData serialReceived
         * @property {string|null} [arrlSection] ContestData arrlSection
         * @property {string|null} [stationClass] ContestData stationClass
         * @property {string|null} [check] ContestData check
         * @property {string|null} [precedence] ContestData precedence
         */

        /**
         * Constructs a new ContestData.
         * @memberof adif
         * @classdesc Represents a ContestData.
         * @implements IContestData
         * @constructor
         * @param {adif.IContestData=} [properties] Properties to set
         */
        function ContestData(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ContestData contestId.
         * @member {string} contestId
         * @memberof adif.ContestData
         * @instance
         */
        ContestData.prototype.contestId = "";

        /**
         * ContestData serialSent.
         * @member {string} serialSent
         * @memberof adif.ContestData
         * @instance
         */
        ContestData.prototype.serialSent = "";

        /**
         * ContestData serialReceived.
         * @member {string} serialReceived
         * @memberof adif.ContestData
         * @instance
         */
        ContestData.prototype.serialReceived = "";

        /**
         * ContestData arrlSection.
         * @member {string} arrlSection
         * @memberof adif.ContestData
         * @instance
         */
        ContestData.prototype.arrlSection = "";

        /**
         * ContestData stationClass.
         * @member {string} stationClass
         * @memberof adif.ContestData
         * @instance
         */
        ContestData.prototype.stationClass = "";

        /**
         * ContestData check.
         * @member {string} check
         * @memberof adif.ContestData
         * @instance
         */
        ContestData.prototype.check = "";

        /**
         * ContestData precedence.
         * @member {string} precedence
         * @memberof adif.ContestData
         * @instance
         */
        ContestData.prototype.precedence = "";

        /**
         * Creates a new ContestData instance using the specified properties.
         * @function create
         * @memberof adif.ContestData
         * @static
         * @param {adif.IContestData=} [properties] Properties to set
         * @returns {adif.ContestData} ContestData instance
         */
        ContestData.create = function create(properties) {
            return new ContestData(properties);
        };

        /**
         * Encodes the specified ContestData message. Does not implicitly {@link adif.ContestData.verify|verify} messages.
         * @function encode
         * @memberof adif.ContestData
         * @static
         * @param {adif.IContestData} message ContestData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ContestData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.contestId != null && Object.hasOwnProperty.call(message, "contestId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.contestId);
            if (message.serialSent != null && Object.hasOwnProperty.call(message, "serialSent"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.serialSent);
            if (message.serialReceived != null && Object.hasOwnProperty.call(message, "serialReceived"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.serialReceived);
            if (message.arrlSection != null && Object.hasOwnProperty.call(message, "arrlSection"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.arrlSection);
            if (message.stationClass != null && Object.hasOwnProperty.call(message, "stationClass"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.stationClass);
            if (message.check != null && Object.hasOwnProperty.call(message, "check"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.check);
            if (message.precedence != null && Object.hasOwnProperty.call(message, "precedence"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.precedence);
            return writer;
        };

        /**
         * Encodes the specified ContestData message, length delimited. Does not implicitly {@link adif.ContestData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof adif.ContestData
         * @static
         * @param {adif.IContestData} message ContestData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ContestData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ContestData message from the specified reader or buffer.
         * @function decode
         * @memberof adif.ContestData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {adif.ContestData} ContestData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ContestData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.adif.ContestData();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.contestId = reader.string();
                    break;
                case 2:
                    message.serialSent = reader.string();
                    break;
                case 3:
                    message.serialReceived = reader.string();
                    break;
                case 4:
                    message.arrlSection = reader.string();
                    break;
                case 5:
                    message.stationClass = reader.string();
                    break;
                case 6:
                    message.check = reader.string();
                    break;
                case 7:
                    message.precedence = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ContestData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof adif.ContestData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {adif.ContestData} ContestData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ContestData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ContestData message.
         * @function verify
         * @memberof adif.ContestData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ContestData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.contestId != null && message.hasOwnProperty("contestId"))
                if (!$util.isString(message.contestId))
                    return "contestId: string expected";
            if (message.serialSent != null && message.hasOwnProperty("serialSent"))
                if (!$util.isString(message.serialSent))
                    return "serialSent: string expected";
            if (message.serialReceived != null && message.hasOwnProperty("serialReceived"))
                if (!$util.isString(message.serialReceived))
                    return "serialReceived: string expected";
            if (message.arrlSection != null && message.hasOwnProperty("arrlSection"))
                if (!$util.isString(message.arrlSection))
                    return "arrlSection: string expected";
            if (message.stationClass != null && message.hasOwnProperty("stationClass"))
                if (!$util.isString(message.stationClass))
                    return "stationClass: string expected";
            if (message.check != null && message.hasOwnProperty("check"))
                if (!$util.isString(message.check))
                    return "check: string expected";
            if (message.precedence != null && message.hasOwnProperty("precedence"))
                if (!$util.isString(message.precedence))
                    return "precedence: string expected";
            return null;
        };

        /**
         * Creates a ContestData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof adif.ContestData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {adif.ContestData} ContestData
         */
        ContestData.fromObject = function fromObject(object) {
            if (object instanceof $root.adif.ContestData)
                return object;
            var message = new $root.adif.ContestData();
            if (object.contestId != null)
                message.contestId = String(object.contestId);
            if (object.serialSent != null)
                message.serialSent = String(object.serialSent);
            if (object.serialReceived != null)
                message.serialReceived = String(object.serialReceived);
            if (object.arrlSection != null)
                message.arrlSection = String(object.arrlSection);
            if (object.stationClass != null)
                message.stationClass = String(object.stationClass);
            if (object.check != null)
                message.check = String(object.check);
            if (object.precedence != null)
                message.precedence = String(object.precedence);
            return message;
        };

        /**
         * Creates a plain object from a ContestData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof adif.ContestData
         * @static
         * @param {adif.ContestData} message ContestData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ContestData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.contestId = "";
                object.serialSent = "";
                object.serialReceived = "";
                object.arrlSection = "";
                object.stationClass = "";
                object.check = "";
                object.precedence = "";
            }
            if (message.contestId != null && message.hasOwnProperty("contestId"))
                object.contestId = message.contestId;
            if (message.serialSent != null && message.hasOwnProperty("serialSent"))
                object.serialSent = message.serialSent;
            if (message.serialReceived != null && message.hasOwnProperty("serialReceived"))
                object.serialReceived = message.serialReceived;
            if (message.arrlSection != null && message.hasOwnProperty("arrlSection"))
                object.arrlSection = message.arrlSection;
            if (message.stationClass != null && message.hasOwnProperty("stationClass"))
                object.stationClass = message.stationClass;
            if (message.check != null && message.hasOwnProperty("check"))
                object.check = message.check;
            if (message.precedence != null && message.hasOwnProperty("precedence"))
                object.precedence = message.precedence;
            return object;
        };

        /**
         * Converts this ContestData to JSON.
         * @function toJSON
         * @memberof adif.ContestData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ContestData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ContestData;
    })();

    adif.Credit = (function() {

        /**
         * Properties of a Credit.
         * @memberof adif
         * @interface ICredit
         * @property {string|null} [credit] Credit credit
         * @property {string|null} [qslMedium] Credit qslMedium
         */

        /**
         * Constructs a new Credit.
         * @memberof adif
         * @classdesc Represents a Credit.
         * @implements ICredit
         * @constructor
         * @param {adif.ICredit=} [properties] Properties to set
         */
        function Credit(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Credit credit.
         * @member {string} credit
         * @memberof adif.Credit
         * @instance
         */
        Credit.prototype.credit = "";

        /**
         * Credit qslMedium.
         * @member {string} qslMedium
         * @memberof adif.Credit
         * @instance
         */
        Credit.prototype.qslMedium = "";

        /**
         * Creates a new Credit instance using the specified properties.
         * @function create
         * @memberof adif.Credit
         * @static
         * @param {adif.ICredit=} [properties] Properties to set
         * @returns {adif.Credit} Credit instance
         */
        Credit.create = function create(properties) {
            return new Credit(properties);
        };

        /**
         * Encodes the specified Credit message. Does not implicitly {@link adif.Credit.verify|verify} messages.
         * @function encode
         * @memberof adif.Credit
         * @static
         * @param {adif.ICredit} message Credit message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Credit.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.credit != null && Object.hasOwnProperty.call(message, "credit"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.credit);
            if (message.qslMedium != null && Object.hasOwnProperty.call(message, "qslMedium"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.qslMedium);
            return writer;
        };

        /**
         * Encodes the specified Credit message, length delimited. Does not implicitly {@link adif.Credit.verify|verify} messages.
         * @function encodeDelimited
         * @memberof adif.Credit
         * @static
         * @param {adif.ICredit} message Credit message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Credit.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Credit message from the specified reader or buffer.
         * @function decode
         * @memberof adif.Credit
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {adif.Credit} Credit
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Credit.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.adif.Credit();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.credit = reader.string();
                    break;
                case 2:
                    message.qslMedium = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Credit message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof adif.Credit
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {adif.Credit} Credit
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Credit.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Credit message.
         * @function verify
         * @memberof adif.Credit
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Credit.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.credit != null && message.hasOwnProperty("credit"))
                if (!$util.isString(message.credit))
                    return "credit: string expected";
            if (message.qslMedium != null && message.hasOwnProperty("qslMedium"))
                if (!$util.isString(message.qslMedium))
                    return "qslMedium: string expected";
            return null;
        };

        /**
         * Creates a Credit message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof adif.Credit
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {adif.Credit} Credit
         */
        Credit.fromObject = function fromObject(object) {
            if (object instanceof $root.adif.Credit)
                return object;
            var message = new $root.adif.Credit();
            if (object.credit != null)
                message.credit = String(object.credit);
            if (object.qslMedium != null)
                message.qslMedium = String(object.qslMedium);
            return message;
        };

        /**
         * Creates a plain object from a Credit message. Also converts values to other types if specified.
         * @function toObject
         * @memberof adif.Credit
         * @static
         * @param {adif.Credit} message Credit
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Credit.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.credit = "";
                object.qslMedium = "";
            }
            if (message.credit != null && message.hasOwnProperty("credit"))
                object.credit = message.credit;
            if (message.qslMedium != null && message.hasOwnProperty("qslMedium"))
                object.qslMedium = message.qslMedium;
            return object;
        };

        /**
         * Converts this Credit to JSON.
         * @function toJSON
         * @memberof adif.Credit
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Credit.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Credit;
    })();

    adif.Upload = (function() {

        /**
         * Properties of an Upload.
         * @memberof adif
         * @interface IUpload
         * @property {google.protobuf.ITimestamp|null} [uploadDate] Upload uploadDate
         * @property {adif.UploadStatus|null} [uploadStatus] Upload uploadStatus
         */

        /**
         * Constructs a new Upload.
         * @memberof adif
         * @classdesc Represents an Upload.
         * @implements IUpload
         * @constructor
         * @param {adif.IUpload=} [properties] Properties to set
         */
        function Upload(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Upload uploadDate.
         * @member {google.protobuf.ITimestamp|null|undefined} uploadDate
         * @memberof adif.Upload
         * @instance
         */
        Upload.prototype.uploadDate = null;

        /**
         * Upload uploadStatus.
         * @member {adif.UploadStatus} uploadStatus
         * @memberof adif.Upload
         * @instance
         */
        Upload.prototype.uploadStatus = 0;

        /**
         * Creates a new Upload instance using the specified properties.
         * @function create
         * @memberof adif.Upload
         * @static
         * @param {adif.IUpload=} [properties] Properties to set
         * @returns {adif.Upload} Upload instance
         */
        Upload.create = function create(properties) {
            return new Upload(properties);
        };

        /**
         * Encodes the specified Upload message. Does not implicitly {@link adif.Upload.verify|verify} messages.
         * @function encode
         * @memberof adif.Upload
         * @static
         * @param {adif.IUpload} message Upload message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Upload.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.uploadDate != null && Object.hasOwnProperty.call(message, "uploadDate"))
                $root.google.protobuf.Timestamp.encode(message.uploadDate, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.uploadStatus != null && Object.hasOwnProperty.call(message, "uploadStatus"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.uploadStatus);
            return writer;
        };

        /**
         * Encodes the specified Upload message, length delimited. Does not implicitly {@link adif.Upload.verify|verify} messages.
         * @function encodeDelimited
         * @memberof adif.Upload
         * @static
         * @param {adif.IUpload} message Upload message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Upload.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Upload message from the specified reader or buffer.
         * @function decode
         * @memberof adif.Upload
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {adif.Upload} Upload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Upload.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.adif.Upload();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.uploadDate = $root.google.protobuf.Timestamp.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.uploadStatus = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an Upload message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof adif.Upload
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {adif.Upload} Upload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Upload.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Upload message.
         * @function verify
         * @memberof adif.Upload
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Upload.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.uploadDate != null && message.hasOwnProperty("uploadDate")) {
                var error = $root.google.protobuf.Timestamp.verify(message.uploadDate);
                if (error)
                    return "uploadDate." + error;
            }
            if (message.uploadStatus != null && message.hasOwnProperty("uploadStatus"))
                switch (message.uploadStatus) {
                default:
                    return "uploadStatus: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            return null;
        };

        /**
         * Creates an Upload message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof adif.Upload
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {adif.Upload} Upload
         */
        Upload.fromObject = function fromObject(object) {
            if (object instanceof $root.adif.Upload)
                return object;
            var message = new $root.adif.Upload();
            if (object.uploadDate != null) {
                if (typeof object.uploadDate !== "object")
                    throw TypeError(".adif.Upload.uploadDate: object expected");
                message.uploadDate = $root.google.protobuf.Timestamp.fromObject(object.uploadDate);
            }
            switch (object.uploadStatus) {
            case "UNKNOWN":
            case 0:
                message.uploadStatus = 0;
                break;
            case "UPLOAD_COMPLETE":
            case 1:
                message.uploadStatus = 1;
                break;
            case "DO_NOT_UPLOAD":
            case 2:
                message.uploadStatus = 2;
                break;
            case "MODIFIED_AFTER_UPLOAD":
            case 3:
                message.uploadStatus = 3;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from an Upload message. Also converts values to other types if specified.
         * @function toObject
         * @memberof adif.Upload
         * @static
         * @param {adif.Upload} message Upload
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Upload.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.uploadDate = null;
                object.uploadStatus = options.enums === String ? "UNKNOWN" : 0;
            }
            if (message.uploadDate != null && message.hasOwnProperty("uploadDate"))
                object.uploadDate = $root.google.protobuf.Timestamp.toObject(message.uploadDate, options);
            if (message.uploadStatus != null && message.hasOwnProperty("uploadStatus"))
                object.uploadStatus = options.enums === String ? $root.adif.UploadStatus[message.uploadStatus] : message.uploadStatus;
            return object;
        };

        /**
         * Converts this Upload to JSON.
         * @function toJSON
         * @memberof adif.Upload
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Upload.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Upload;
    })();

    /**
     * UploadStatus enum.
     * @name adif.UploadStatus
     * @enum {number}
     * @property {number} UNKNOWN=0 UNKNOWN value
     * @property {number} UPLOAD_COMPLETE=1 UPLOAD_COMPLETE value
     * @property {number} DO_NOT_UPLOAD=2 DO_NOT_UPLOAD value
     * @property {number} MODIFIED_AFTER_UPLOAD=3 MODIFIED_AFTER_UPLOAD value
     */
    adif.UploadStatus = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "UNKNOWN"] = 0;
        values[valuesById[1] = "UPLOAD_COMPLETE"] = 1;
        values[valuesById[2] = "DO_NOT_UPLOAD"] = 2;
        values[valuesById[3] = "MODIFIED_AFTER_UPLOAD"] = 3;
        return values;
    })();

    adif.Qsl = (function() {

        /**
         * Properties of a Qsl.
         * @memberof adif
         * @interface IQsl
         * @property {google.protobuf.ITimestamp|null} [sentDate] Qsl sentDate
         * @property {string|null} [sentStatus] Qsl sentStatus
         * @property {string|null} [sentVia] Qsl sentVia
         * @property {google.protobuf.ITimestamp|null} [receivedDate] Qsl receivedDate
         * @property {string|null} [receivedStatus] Qsl receivedStatus
         * @property {string|null} [receivedVia] Qsl receivedVia
         * @property {string|null} [receivedMessage] Qsl receivedMessage
         */

        /**
         * Constructs a new Qsl.
         * @memberof adif
         * @classdesc Represents a Qsl.
         * @implements IQsl
         * @constructor
         * @param {adif.IQsl=} [properties] Properties to set
         */
        function Qsl(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Qsl sentDate.
         * @member {google.protobuf.ITimestamp|null|undefined} sentDate
         * @memberof adif.Qsl
         * @instance
         */
        Qsl.prototype.sentDate = null;

        /**
         * Qsl sentStatus.
         * @member {string} sentStatus
         * @memberof adif.Qsl
         * @instance
         */
        Qsl.prototype.sentStatus = "";

        /**
         * Qsl sentVia.
         * @member {string} sentVia
         * @memberof adif.Qsl
         * @instance
         */
        Qsl.prototype.sentVia = "";

        /**
         * Qsl receivedDate.
         * @member {google.protobuf.ITimestamp|null|undefined} receivedDate
         * @memberof adif.Qsl
         * @instance
         */
        Qsl.prototype.receivedDate = null;

        /**
         * Qsl receivedStatus.
         * @member {string} receivedStatus
         * @memberof adif.Qsl
         * @instance
         */
        Qsl.prototype.receivedStatus = "";

        /**
         * Qsl receivedVia.
         * @member {string} receivedVia
         * @memberof adif.Qsl
         * @instance
         */
        Qsl.prototype.receivedVia = "";

        /**
         * Qsl receivedMessage.
         * @member {string} receivedMessage
         * @memberof adif.Qsl
         * @instance
         */
        Qsl.prototype.receivedMessage = "";

        /**
         * Creates a new Qsl instance using the specified properties.
         * @function create
         * @memberof adif.Qsl
         * @static
         * @param {adif.IQsl=} [properties] Properties to set
         * @returns {adif.Qsl} Qsl instance
         */
        Qsl.create = function create(properties) {
            return new Qsl(properties);
        };

        /**
         * Encodes the specified Qsl message. Does not implicitly {@link adif.Qsl.verify|verify} messages.
         * @function encode
         * @memberof adif.Qsl
         * @static
         * @param {adif.IQsl} message Qsl message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Qsl.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.sentDate != null && Object.hasOwnProperty.call(message, "sentDate"))
                $root.google.protobuf.Timestamp.encode(message.sentDate, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.sentStatus != null && Object.hasOwnProperty.call(message, "sentStatus"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.sentStatus);
            if (message.sentVia != null && Object.hasOwnProperty.call(message, "sentVia"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.sentVia);
            if (message.receivedDate != null && Object.hasOwnProperty.call(message, "receivedDate"))
                $root.google.protobuf.Timestamp.encode(message.receivedDate, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.receivedStatus != null && Object.hasOwnProperty.call(message, "receivedStatus"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.receivedStatus);
            if (message.receivedVia != null && Object.hasOwnProperty.call(message, "receivedVia"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.receivedVia);
            if (message.receivedMessage != null && Object.hasOwnProperty.call(message, "receivedMessage"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.receivedMessage);
            return writer;
        };

        /**
         * Encodes the specified Qsl message, length delimited. Does not implicitly {@link adif.Qsl.verify|verify} messages.
         * @function encodeDelimited
         * @memberof adif.Qsl
         * @static
         * @param {adif.IQsl} message Qsl message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Qsl.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Qsl message from the specified reader or buffer.
         * @function decode
         * @memberof adif.Qsl
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {adif.Qsl} Qsl
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Qsl.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.adif.Qsl();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.sentDate = $root.google.protobuf.Timestamp.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.sentStatus = reader.string();
                    break;
                case 3:
                    message.sentVia = reader.string();
                    break;
                case 4:
                    message.receivedDate = $root.google.protobuf.Timestamp.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.receivedStatus = reader.string();
                    break;
                case 6:
                    message.receivedVia = reader.string();
                    break;
                case 7:
                    message.receivedMessage = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Qsl message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof adif.Qsl
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {adif.Qsl} Qsl
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Qsl.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Qsl message.
         * @function verify
         * @memberof adif.Qsl
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Qsl.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.sentDate != null && message.hasOwnProperty("sentDate")) {
                var error = $root.google.protobuf.Timestamp.verify(message.sentDate);
                if (error)
                    return "sentDate." + error;
            }
            if (message.sentStatus != null && message.hasOwnProperty("sentStatus"))
                if (!$util.isString(message.sentStatus))
                    return "sentStatus: string expected";
            if (message.sentVia != null && message.hasOwnProperty("sentVia"))
                if (!$util.isString(message.sentVia))
                    return "sentVia: string expected";
            if (message.receivedDate != null && message.hasOwnProperty("receivedDate")) {
                var error = $root.google.protobuf.Timestamp.verify(message.receivedDate);
                if (error)
                    return "receivedDate." + error;
            }
            if (message.receivedStatus != null && message.hasOwnProperty("receivedStatus"))
                if (!$util.isString(message.receivedStatus))
                    return "receivedStatus: string expected";
            if (message.receivedVia != null && message.hasOwnProperty("receivedVia"))
                if (!$util.isString(message.receivedVia))
                    return "receivedVia: string expected";
            if (message.receivedMessage != null && message.hasOwnProperty("receivedMessage"))
                if (!$util.isString(message.receivedMessage))
                    return "receivedMessage: string expected";
            return null;
        };

        /**
         * Creates a Qsl message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof adif.Qsl
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {adif.Qsl} Qsl
         */
        Qsl.fromObject = function fromObject(object) {
            if (object instanceof $root.adif.Qsl)
                return object;
            var message = new $root.adif.Qsl();
            if (object.sentDate != null) {
                if (typeof object.sentDate !== "object")
                    throw TypeError(".adif.Qsl.sentDate: object expected");
                message.sentDate = $root.google.protobuf.Timestamp.fromObject(object.sentDate);
            }
            if (object.sentStatus != null)
                message.sentStatus = String(object.sentStatus);
            if (object.sentVia != null)
                message.sentVia = String(object.sentVia);
            if (object.receivedDate != null) {
                if (typeof object.receivedDate !== "object")
                    throw TypeError(".adif.Qsl.receivedDate: object expected");
                message.receivedDate = $root.google.protobuf.Timestamp.fromObject(object.receivedDate);
            }
            if (object.receivedStatus != null)
                message.receivedStatus = String(object.receivedStatus);
            if (object.receivedVia != null)
                message.receivedVia = String(object.receivedVia);
            if (object.receivedMessage != null)
                message.receivedMessage = String(object.receivedMessage);
            return message;
        };

        /**
         * Creates a plain object from a Qsl message. Also converts values to other types if specified.
         * @function toObject
         * @memberof adif.Qsl
         * @static
         * @param {adif.Qsl} message Qsl
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Qsl.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.sentDate = null;
                object.sentStatus = "";
                object.sentVia = "";
                object.receivedDate = null;
                object.receivedStatus = "";
                object.receivedVia = "";
                object.receivedMessage = "";
            }
            if (message.sentDate != null && message.hasOwnProperty("sentDate"))
                object.sentDate = $root.google.protobuf.Timestamp.toObject(message.sentDate, options);
            if (message.sentStatus != null && message.hasOwnProperty("sentStatus"))
                object.sentStatus = message.sentStatus;
            if (message.sentVia != null && message.hasOwnProperty("sentVia"))
                object.sentVia = message.sentVia;
            if (message.receivedDate != null && message.hasOwnProperty("receivedDate"))
                object.receivedDate = $root.google.protobuf.Timestamp.toObject(message.receivedDate, options);
            if (message.receivedStatus != null && message.hasOwnProperty("receivedStatus"))
                object.receivedStatus = message.receivedStatus;
            if (message.receivedVia != null && message.hasOwnProperty("receivedVia"))
                object.receivedVia = message.receivedVia;
            if (message.receivedMessage != null && message.hasOwnProperty("receivedMessage"))
                object.receivedMessage = message.receivedMessage;
            return object;
        };

        /**
         * Converts this Qsl to JSON.
         * @function toJSON
         * @memberof adif.Qsl
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Qsl.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Qsl;
    })();

    return adif;
})();

$root.google = (function() {

    /**
     * Namespace google.
     * @exports google
     * @namespace
     */
    var google = {};

    google.protobuf = (function() {

        /**
         * Namespace protobuf.
         * @memberof google
         * @namespace
         */
        var protobuf = {};

        protobuf.Timestamp = (function() {

            /**
             * Properties of a Timestamp.
             * @memberof google.protobuf
             * @interface ITimestamp
             * @property {number|Long|null} [seconds] Timestamp seconds
             * @property {number|null} [nanos] Timestamp nanos
             */

            /**
             * Constructs a new Timestamp.
             * @memberof google.protobuf
             * @classdesc Represents a Timestamp.
             * @implements ITimestamp
             * @constructor
             * @param {google.protobuf.ITimestamp=} [properties] Properties to set
             */
            function Timestamp(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Timestamp seconds.
             * @member {number|Long} seconds
             * @memberof google.protobuf.Timestamp
             * @instance
             */
            Timestamp.prototype.seconds = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * Timestamp nanos.
             * @member {number} nanos
             * @memberof google.protobuf.Timestamp
             * @instance
             */
            Timestamp.prototype.nanos = 0;

            /**
             * Creates a new Timestamp instance using the specified properties.
             * @function create
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {google.protobuf.ITimestamp=} [properties] Properties to set
             * @returns {google.protobuf.Timestamp} Timestamp instance
             */
            Timestamp.create = function create(properties) {
                return new Timestamp(properties);
            };

            /**
             * Encodes the specified Timestamp message. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {google.protobuf.ITimestamp} message Timestamp message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Timestamp.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.seconds != null && Object.hasOwnProperty.call(message, "seconds"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int64(message.seconds);
                if (message.nanos != null && Object.hasOwnProperty.call(message, "nanos"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nanos);
                return writer;
            };

            /**
             * Encodes the specified Timestamp message, length delimited. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {google.protobuf.ITimestamp} message Timestamp message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Timestamp.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Timestamp message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Timestamp} Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Timestamp.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Timestamp();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.seconds = reader.int64();
                        break;
                    case 2:
                        message.nanos = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Timestamp message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Timestamp} Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Timestamp.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Timestamp message.
             * @function verify
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Timestamp.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.seconds != null && message.hasOwnProperty("seconds"))
                    if (!$util.isInteger(message.seconds) && !(message.seconds && $util.isInteger(message.seconds.low) && $util.isInteger(message.seconds.high)))
                        return "seconds: integer|Long expected";
                if (message.nanos != null && message.hasOwnProperty("nanos"))
                    if (!$util.isInteger(message.nanos))
                        return "nanos: integer expected";
                return null;
            };

            /**
             * Creates a Timestamp message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Timestamp} Timestamp
             */
            Timestamp.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Timestamp)
                    return object;
                var message = new $root.google.protobuf.Timestamp();
                if (object.seconds != null)
                    if ($util.Long)
                        (message.seconds = $util.Long.fromValue(object.seconds)).unsigned = false;
                    else if (typeof object.seconds === "string")
                        message.seconds = parseInt(object.seconds, 10);
                    else if (typeof object.seconds === "number")
                        message.seconds = object.seconds;
                    else if (typeof object.seconds === "object")
                        message.seconds = new $util.LongBits(object.seconds.low >>> 0, object.seconds.high >>> 0).toNumber();
                if (object.nanos != null)
                    message.nanos = object.nanos | 0;
                return message;
            };

            /**
             * Creates a plain object from a Timestamp message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {google.protobuf.Timestamp} message Timestamp
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Timestamp.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.seconds = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.seconds = options.longs === String ? "0" : 0;
                    object.nanos = 0;
                }
                if (message.seconds != null && message.hasOwnProperty("seconds"))
                    if (typeof message.seconds === "number")
                        object.seconds = options.longs === String ? String(message.seconds) : message.seconds;
                    else
                        object.seconds = options.longs === String ? $util.Long.prototype.toString.call(message.seconds) : options.longs === Number ? new $util.LongBits(message.seconds.low >>> 0, message.seconds.high >>> 0).toNumber() : message.seconds;
                if (message.nanos != null && message.hasOwnProperty("nanos"))
                    object.nanos = message.nanos;
                return object;
            };

            /**
             * Converts this Timestamp to JSON.
             * @function toJSON
             * @memberof google.protobuf.Timestamp
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Timestamp.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Timestamp;
        })();

        return protobuf;
    })();

    return google;
})();

module.exports = $root;
