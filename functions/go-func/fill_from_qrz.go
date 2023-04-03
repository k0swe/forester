package forester

import (
	"cloud.google.com/go/firestore"
	"cloud.google.com/go/pubsub"
	"context"
	"encoding/json"
	"fmt"
	adifpb "github.com/k0swe/adif-json-protobuf/go"
	"github.com/k0swe/qrz-api"
	"log"
	"strconv"
	"strings"
)

// FillNewQsoFromQrz listens to Pub/Sub for new contacts in Firestore, and fills
// in missing QSO details for the contacted station from QRZ.com.
func FillNewQsoFromQrz(ctx context.Context, m pubsub.Message) error {
	var psMap map[string]string
	err := json.Unmarshal(m.Data, &psMap)
	if err != nil {
		return err
	}
	logbookID := psMap["logbookId"]
	contactID := psMap["contactId"]
	firebasePath := fmt.Sprintf("logbooks/%s/contacts/%s", logbookID, contactID)
	log.Printf("Got a new Firebase QSO at path %s", firebasePath)

	client, err := firestore.NewClient(ctx, projectID)
	if err != nil {
		return err
	}
	defer client.Close()
	doc := client.Doc(firebasePath)
	snapshot, err := doc.Get(ctx)
	if err != nil {
		return err
	}
	qso, err := ParseFirestoreQso(snapshot)
	if err != nil {
		return err
	}

	contactedStationCall := qso.qsopb.ContactedStation.StationCall
	if contactedStationCall == "T3ST" {
		log.Printf("Contacted station is special value T3ST; aborting lookup")
		return nil
	}

	qrzUser, qrzPass, err := getQrzCreds(ctx, logbookID)
	if err != nil {
		return err
	}

	log.Printf("Querying QRZ.com for %v", contactedStationCall)
	lookupResp, err := qrz.Lookup(ctx, &qrzUser, &qrzPass, &contactedStationCall)
	if err != nil {
		return err
	}
	log.Printf("QRZ.com lookup: %v is %v %v",
		lookupResp.Callsign.Call, lookupResp.Callsign.Fname, lookupResp.Callsign.Name)

	station := qrzLookupToStation(lookupResp.Callsign)
	q := adifpb.Qso{ContactedStation: &station, LoggingStation: &adifpb.Station{}}
	fixCase(&q)
	mergeQso(qso.qsopb, &q)
	j, err := qsoToJSON(qso.qsopb)
	if err != nil {
		return err
	}
	_, err = doc.Set(ctx, j)
	if err != nil {
		return err
	}
	log.Printf("Updated contact with QRZ.com details")
	return nil
}

func getQrzCreds(ctx context.Context, logbookID string) (string, string, error) {
	secretStore := NewSecretStore(ctx)
	username, err := secretStore.FetchSecret(logbookID, qrzUsername)
	if err != nil {
		return "", "", err
	}
	password, err := secretStore.FetchSecret(logbookID, qrzPassword)
	if err != nil {
		return "", "", err
	}
	return username, password, nil
}

func qrzLookupToStation(c qrz.Callsign) adifpb.Station {
	dxcc, _ := strconv.ParseUint(c.Dxcc, 10, 32)
	cq, _ := strconv.ParseUint(c.Cqzone, 10, 32)
	itu, _ := strconv.ParseUint(c.Ituzone, 10, 32)
	return adifpb.Station{
		StationCall: c.Call,
		OpName:      strings.TrimSpace(c.Fname + " " + c.Name),
		GridSquare:  c.Grid,
		Latitude:    c.Lat,
		Longitude:   c.Lon,
		QslVia:      c.Qslmgr,
		Street:      c.Addr1,
		City:        c.Addr2,
		PostalCode:  c.Zip,
		County:      c.County,
		State:       c.State,
		Country:     c.Country,
		Dxcc:        uint32(dxcc),
		Email:       c.Email,
		CqZone:      uint32(cq),
		ItuZone:     uint32(itu),
		Iota:        c.Iota,
	}
}
