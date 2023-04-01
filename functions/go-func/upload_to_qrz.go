package forester

import (
	"cloud.google.com/go/firestore"
	"cloud.google.com/go/pubsub"
	"context"
	"encoding/json"
	"fmt"
	adifpb "github.com/k0swe/adif-json-protobuf/go"
	qrzlog "github.com/k0swe/qrz-logbook"
	"log"
)

// UploadNewQsoToQrz listens to Pub/Sub for new contacts in Firestore, and uploads them to the
// QRZ.com Logbook.
func UploadNewQsoToQrz(ctx context.Context, m pubsub.Message) error {
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
		log.Printf("Contacted station is special value T3ST; aborting upload")
		return nil
	}

	adifProto := &adifpb.Adif{Qsos: []*adifpb.Qso{qso.qsopb}}
	adif, err := protoToAdif(adifProto)
	if err != nil {
		return err
	}

	secretStore := NewSecretStore(ctx)
	qrzAPIKey, err := secretStore.FetchSecret(logbookID, qrzLogbookAPIKey)
	if err != nil {
		return err
	}

	log.Printf("Uploading contact to QRZ.com...")
	insert, err := qrzlog.Insert(ctx, &qrzAPIKey, adif, false)
	if err != nil {
		return err
	}
	log.Printf("Uploaded contact to QRZ.com")

	if qso.qsopb.AppDefined == nil {
		qso.qsopb.AppDefined = map[string]string{}
	}
	qso.qsopb.AppDefined["app_qrzlog_logid"] = insert.LogId
	j, err := qsoToJSON(qso.qsopb)
	if err != nil {
		return err
	}
	_, err = doc.Set(ctx, j)
	if err != nil {
		return err
	}
	log.Printf("Updated contact with QRZ.com log ID")
	return nil
}
