package forester

import (
	"bytes"
	"fmt"
	"github.com/Matir/adifparser"
	adifpb "github.com/k0swe/adif-json-protobuf/go"
	"math"
	"strconv"
	"strings"
	"time"
)

func protoToAdif(adif *adifpb.Adif) (string, error) {
	buf := new(bytes.Buffer)
	writer := adifparser.NewADIFWriter(buf)
	for _, qso := range adif.Qsos {
		record := writeQso(qso)
		err := writer.WriteRecord(record)
		if err != nil {
			return "", err
		}
	}
	if err := writer.Flush(); err != nil {
		return "", err
	}
	return buf.String(), nil
}

func writeQso(qso *adifpb.Qso) adifparser.ADIFRecord {
	var rec = adifparser.NewADIFRecord()
	writeTopLevel(qso, rec)
	writeAppDefined(qso, rec)
	writeContactedStation(qso, rec)
	writeLoggingStation(qso, rec)
	writeContest(qso, rec)
	writePropagation(qso, rec)
	writeAwardsAndCredit(qso, rec)
	writeUploads(qso, rec)
	writeQsls(qso, rec)
	return rec
}

func writeTopLevel(qso *adifpb.Qso, rec adifparser.ADIFRecord) {
	writeString(rec, "band", qso.Band)
	writeString(rec, "band_rx", qso.BandRx)
	writeString(rec, "comment", qso.Comment)
	writeInt(rec, "distance", int64(qso.DistanceKm))
	writeFloat(rec, "freq", qso.Freq, 6)
	writeFloat(rec, "freq_rx", qso.FreqRx, 6)
	writeString(rec, "mode", qso.Mode)
	writeString(rec, "notes", qso.Notes)
	writeString(rec, "public_key", qso.PublicKey)
	writeString(rec, "qso_complete", qso.Complete)
	writeDate(rec, "qso_date", qso.TimeOn.AsTime())
	writeTime(rec, "time_on", qso.TimeOn.AsTime())
	writeDate(rec, "qso_date_off", qso.TimeOff.AsTime())
	writeTime(rec, "time_off", qso.TimeOff.AsTime())
	writeBool(rec, "qso_random", qso.Random)
	writeString(rec, "rst_rcvd", qso.RstReceived)
	writeString(rec, "rst_sent", qso.RstSent)
	writeString(rec, "submode", qso.Submode)
	writeBool(rec, "swl", qso.Swl)
}

func writeAppDefined(qso *adifpb.Qso, rec adifparser.ADIFRecord) {
	for k, v := range qso.AppDefined {
		rec.SetValue(k, v)
	}
}

func writeContactedStation(qso *adifpb.Qso, rec adifparser.ADIFRecord) {
	if qso.ContactedStation == nil {
		return
	}
	writeString(rec, "address", qso.ContactedStation.Address)
	writeInt(rec, "age", int64(qso.ContactedStation.Age))
	writeString(rec, "call", qso.ContactedStation.StationCall)
	writeString(rec, "cnty", qso.ContactedStation.County)
	writeString(rec, "cont", qso.ContactedStation.Continent)
	writeString(rec, "contacted_op", qso.ContactedStation.OpCall)
	writeString(rec, "country", qso.ContactedStation.Country)
	writeInt(rec, "cqz", int64(qso.ContactedStation.CqZone))
	writeString(rec, "darc_dok", qso.ContactedStation.DarcDok)
	writeInt(rec, "dxcc", int64(qso.ContactedStation.Dxcc))
	writeString(rec, "email", qso.ContactedStation.Email)
	writeString(rec, "eq_call", qso.ContactedStation.OwnerCall)
	writeInt(rec, "fists", int64(qso.ContactedStation.Fists))
	writeInt(rec, "fists_cc", int64(qso.ContactedStation.FistsCc))
	writeString(rec, "gridsquare", qso.ContactedStation.GridSquare)
	writeString(rec, "iota", qso.ContactedStation.Iota)
	writeInt(rec, "iota_island_id", int64(qso.ContactedStation.IotaIslandId))
	writeInt(rec, "ituz", int64(qso.ContactedStation.ItuZone))
	writeLatLon(rec, "lat", qso.ContactedStation.Latitude, true)
	writeLatLon(rec, "lon", qso.ContactedStation.Longitude, false)
	writeString(rec, "name", qso.ContactedStation.OpName)
	writeString(rec, "pfx", qso.ContactedStation.Pfx)
	writeString(rec, "qsl_via", qso.ContactedStation.QslVia)
	writeString(rec, "qth", qso.ContactedStation.City)
	writeString(rec, "region", qso.ContactedStation.Region)
	writeString(rec, "rig", qso.ContactedStation.Rig)
	writeFloat(rec, "rx_pwr", qso.ContactedStation.Power, 2)
	writeString(rec, "sig", qso.ContactedStation.Sig)
	writeString(rec, "sig_info", qso.ContactedStation.SigInfo)
	writeBool(rec, "silent_key", qso.ContactedStation.SilentKey)
	writeString(rec, "skcc", qso.ContactedStation.Skcc)
	writeString(rec, "sota_ref", qso.ContactedStation.SotaRef)
	writeString(rec, "state", qso.ContactedStation.State)
	writeInt(rec, "ten_ten", int64(qso.ContactedStation.TenTen))
	writeInt(rec, "uksmg", int64(qso.ContactedStation.Uksmg))
	writeString(rec, "usaca_counties", qso.ContactedStation.UsacaCounties)
	writeString(rec, "vucc_grids", qso.ContactedStation.VuccGrids)
	writeString(rec, "web", qso.ContactedStation.Web)
}

func writeLoggingStation(qso *adifpb.Qso, rec adifparser.ADIFRecord) {
	if qso.LoggingStation == nil {
		return
	}
	writeInt(rec, "ant_az", int64(qso.LoggingStation.AntennaAzimuth))
	writeInt(rec, "ant_el", int64(qso.LoggingStation.AntennaElevation))
	writeString(rec, "my_antenna", qso.LoggingStation.Antenna)
	writeString(rec, "my_city", qso.LoggingStation.City)
	writeString(rec, "my_cnty", qso.LoggingStation.County)
	writeString(rec, "my_country", qso.LoggingStation.Country)
	writeInt(rec, "my_cq_zone", int64(qso.LoggingStation.CqZone))
	writeInt(rec, "my_dxcc", int64(qso.LoggingStation.Dxcc))
	writeInt(rec, "my_fists", int64(qso.LoggingStation.Fists))
	writeString(rec, "my_gridsquare", qso.LoggingStation.GridSquare)
	writeString(rec, "my_iota", qso.LoggingStation.Iota)
	writeInt(rec, "my_iota_island_id", int64(qso.LoggingStation.IotaIslandId))
	writeInt(rec, "my_itu_zone", int64(qso.LoggingStation.ItuZone))
	writeLatLon(rec, "my_lat", qso.LoggingStation.Latitude, true)
	writeLatLon(rec, "my_lon", qso.LoggingStation.Longitude, false)
	writeString(rec, "my_name", qso.LoggingStation.OpName)
	writeString(rec, "my_postal_code", qso.LoggingStation.PostalCode)
	writeString(rec, "my_rig", qso.LoggingStation.Rig)
	writeString(rec, "my_sig", qso.LoggingStation.Sig)
	writeString(rec, "my_sig_info", qso.LoggingStation.SigInfo)
	writeString(rec, "my_sota_ref", qso.LoggingStation.SotaRef)
	writeString(rec, "my_state", qso.LoggingStation.State)
	writeString(rec, "my_street", qso.LoggingStation.Street)
	writeString(rec, "my_usaca_counties", qso.LoggingStation.UsacaCounties)
	writeString(rec, "my_vucc_grids", qso.LoggingStation.VuccGrids)
	writeString(rec, "operator", qso.LoggingStation.OpCall)
	writeString(rec, "owner_callsign", qso.LoggingStation.OwnerCall)
	writeString(rec, "station_callsign", qso.LoggingStation.StationCall)
	writeFloat(rec, "tx_pwr", qso.LoggingStation.Power, 2)
}

func writeContest(qso *adifpb.Qso, rec adifparser.ADIFRecord) {
	if qso.Contest == nil {
		return
	}
	writeString(rec, "contest_id", qso.Contest.ContestId)
	writeString(rec, "arrl_sect", qso.Contest.ArrlSection)
	writeString(rec, "class", qso.Contest.StationClass)
	writeString(rec, "check", qso.Contest.Check)
	writeString(rec, "precedence", qso.Contest.Precedence)
	writeString(rec, "srx", qso.Contest.SerialReceived)
	writeString(rec, "srx_string", qso.Contest.SerialReceived)
	writeString(rec, "stx", qso.Contest.SerialSent)
	writeString(rec, "stx_string", qso.Contest.SerialSent)
}

func writePropagation(qso *adifpb.Qso, rec adifparser.ADIFRecord) {
	if qso.Propagation == nil {
		return
	}
	writeInt(rec, "a_index", int64(qso.Propagation.AIndex))
	writeString(rec, "ant_path", qso.Propagation.AntPath)
	writeBool(rec, "force_init", qso.Propagation.ForceInit)
	writeInt(rec, "k_index", int64(qso.Propagation.KIndex))
	writeInt(rec, "max_bursts", int64(qso.Propagation.MaxBursts))
	writeString(rec, "ms_shower", qso.Propagation.MeteorShowerName)
	writeInt(rec, "nr_bursts", int64(qso.Propagation.NrBursts))
	writeInt(rec, "nr_pings", int64(qso.Propagation.NrPings))
	writeString(rec, "prop_mode", qso.Propagation.PropagationMode)
	writeString(rec, "sat_mode", qso.Propagation.SatMode)
	writeString(rec, "sat_name", qso.Propagation.SatName)
	writeInt(rec, "sfi", int64(qso.Propagation.SolarFluxIndex))
}

func writeAwardsAndCredit(qso *adifpb.Qso, rec adifparser.ADIFRecord) {
	writeAwards(qso.AwardSubmitted, rec, "award_submitted")
	writeAwards(qso.AwardGranted, rec, "award_granted")
	writeCredit(qso.CreditSubmitted, rec, "credit_submitted")
	writeCredit(qso.CreditGranted, rec, "credit_granted")
}

func writeAwards(awards []string, rec adifparser.ADIFRecord, field string) {
	writeString(rec, field, strings.Join(awards, ","))
}

func writeCredit(credit []*adifpb.Credit, rec adifparser.ADIFRecord, field string) {
	var elem = make([]string, 0)
	for _, c := range credit {
		e := c.Credit
		if c.QslMedium != "" {
			e += ":" + c.QslMedium
		}
		elem = append(elem, e)
	}
	writeString(rec, field, strings.Join(elem, ","))
}

func writeUploads(qso *adifpb.Qso, rec adifparser.ADIFRecord) {
	if qso.Qrzcom != nil {
		writeString(rec, "qrzcom_qso_upload_status", writeUploadStatus(qso.Qrzcom.UploadStatus))
		writeDate(rec, "qrzcom_qso_upload_date", qso.Qrzcom.UploadDate.AsTime())
	}

	if qso.Hrdlog != nil {
		writeString(rec, "hrdlog_qso_upload_status", writeUploadStatus(qso.Hrdlog.UploadStatus))
		writeDate(rec, "hrdlog_qso_upload_date", qso.Hrdlog.UploadDate.AsTime())
	}

	if qso.Clublog != nil {
		writeString(rec, "clublog_qso_upload_status", writeUploadStatus(qso.Clublog.UploadStatus))
		writeDate(rec, "clublog_qso_upload_date", qso.Clublog.UploadDate.AsTime())
	}
}

func writeUploadStatus(status adifpb.UploadStatus) string {
	switch status {
	case adifpb.UploadStatus_UPLOAD_COMPLETE:
		return "Y"
	case adifpb.UploadStatus_DO_NOT_UPLOAD:
		return "N"
	case adifpb.UploadStatus_MODIFIED_AFTER_UPLOAD:
		return "M"
	default:
		return ""
	}
}

func writeQsls(qso *adifpb.Qso, rec adifparser.ADIFRecord) {
	writeCardQsl(qso.Card, rec)
	writeQsl(qso.Eqsl, rec, "eqsl_")
	writeQsl(qso.Lotw, rec, "lotw_")
}

func writeCardQsl(qsl *adifpb.Qsl, rec adifparser.ADIFRecord) {
	if qsl == nil {
		return
	}
	writeQsl(qsl, rec, "")
	writeString(rec, "qsl_sent_via", qsl.SentVia)
	writeString(rec, "qsl_rcvd_via", qsl.ReceivedVia)
	writeString(rec, "qslmsg", qsl.ReceivedMessage)
}

func writeQsl(qsl *adifpb.Qsl, rec adifparser.ADIFRecord, prefix string) {
	if qsl == nil {
		return
	}
	writeString(rec, prefix+"qsl_sent", qsl.SentStatus)
	writeDate(rec, prefix+"qslsdate", qsl.SentDate.AsTime())
	writeString(rec, prefix+"qsl_rcvd", qsl.ReceivedStatus)
	writeDate(rec, prefix+"qslrdate", qsl.ReceivedDate.AsTime())

}

func writeString(rec adifparser.ADIFRecord, adifField string, value string) {
	if value == "" {
		return
	}
	rec.SetValue(adifField, value)
}

func writeBool(rec adifparser.ADIFRecord, adifField string, value bool) {
	if !value {
		return
	}
	rec.SetValue(adifField, "Y")
}

func writeInt(rec adifparser.ADIFRecord, adifField string, value int64) {
	if value == 0 {
		return
	}
	rec.SetValue(adifField, strconv.FormatInt(value, 10))
}

func writeFloat(rec adifparser.ADIFRecord, adifField string, value float64, precision int) {
	if value == 0 {
		return
	}
	rec.SetValue(adifField, strconv.FormatFloat(value, 'g', precision, 64))
}

func writeLatLon(rec adifparser.ADIFRecord, adifField string, latLon float64, isLat bool) {
	if latLon == 0 {
		return
	}
	value := latLonToString(latLon, isLat)
	rec.SetValue(adifField, value)
}

func latLonToString(latLon float64, isLat bool) string {
	var cardinal string
	if isLat {
		if latLon >= 0 {
			cardinal = "N"
		} else {
			cardinal = "S"
		}
	} else {
		if latLon >= 0 {
			cardinal = "E"
		} else {
			cardinal = "W"
		}
	}
	degrees := math.Floor(math.Abs(latLon))
	minutes := (math.Abs(latLon) - math.Abs(degrees)) * 60
	return fmt.Sprintf("%s%03d %06.3f", cardinal, int(degrees), minutes)
}

func writeDate(rec adifparser.ADIFRecord, adifField string, value time.Time) {
	if value.Unix() == 0 {
		return
	}
	// YYYYMMDD
	rec.SetValue(adifField, dateToString(value))
}

func dateToString(value time.Time) string {
	return value.Format("20060102")
}

func writeTime(rec adifparser.ADIFRecord, adifField string, value time.Time) {
	if value.Unix() == 0 {
		return
	}
	// HHMMSS
	rec.SetValue(adifField, timeToString(value))
}

func timeToString(value time.Time) string {
	return value.Format("150405")
}
