package forester

import (
	"github.com/k0swe/adif-json-protobuf/go"
	"strings"
)

func fixCase(qso *adifpb.Qso) {
	qso.Mode = fixToUpper(qso.Mode)
	qso.Band = fixToLower(qso.Band)
	qso.BandRx = fixToLower(qso.BandRx)

	qso.ContactedStation.Address = fixToTitle(qso.ContactedStation.Address)
	qso.ContactedStation.StationCall = fixToUpper(qso.ContactedStation.StationCall)
	qso.ContactedStation.Continent = fixToUpper(qso.ContactedStation.Continent)
	qso.ContactedStation.OpCall = fixToUpper(qso.ContactedStation.OpCall)
	qso.ContactedStation.Country = fixToTitle(qso.ContactedStation.Country)
	qso.ContactedStation.Email = strings.TrimSpace(qso.ContactedStation.Email)
	qso.ContactedStation.OwnerCall = fixToUpper(qso.ContactedStation.OwnerCall)
	qso.ContactedStation.GridSquare = fixToUpper(qso.ContactedStation.GridSquare)
	qso.ContactedStation.OpName = fixToTitle(qso.ContactedStation.OpName)
	qso.ContactedStation.City = fixToTitle(qso.ContactedStation.City)
	if len(qso.ContactedStation.State) < 3 {
		// probably an abbreviation
		qso.ContactedStation.State = fixToUpper(qso.ContactedStation.State)
	} else {
		// probably a proper name
		qso.ContactedStation.State = fixToTitle(qso.ContactedStation.State)
	}

	qso.LoggingStation.City = fixToTitle(qso.LoggingStation.City)
	qso.LoggingStation.Country = fixToTitle(qso.LoggingStation.Country)
	qso.LoggingStation.GridSquare = fixToUpper(qso.LoggingStation.GridSquare)
	qso.LoggingStation.OpName = fixToTitle(qso.LoggingStation.OpName)
	if len(qso.LoggingStation.State) < 3 {
		// probably an abbreviation
		qso.LoggingStation.State = fixToUpper(qso.LoggingStation.State)
	} else {
		// probably a proper name
		qso.LoggingStation.State = fixToTitle(qso.LoggingStation.State)
	}
	qso.LoggingStation.OpCall = fixToUpper(qso.LoggingStation.OpCall)
	qso.LoggingStation.OwnerCall = fixToUpper(qso.LoggingStation.OwnerCall)
	qso.LoggingStation.StationCall = fixToUpper(qso.LoggingStation.StationCall)
}

func fixToLower(str string) string {
	return strings.TrimSpace(strings.ToLower(str))
}

func fixToUpper(str string) string {
	return strings.TrimSpace(strings.ToUpper(str))
}

func fixToTitle(str string) string {
	return strings.TrimSpace(strings.Title(strings.ToLower(str)))
}
