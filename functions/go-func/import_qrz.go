package forester

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	ql "github.com/k0swe/qrz-logbook"
	"log"
	"net/http"
	"time"
)

const qrzLastFetchedDate = "qrzLastFetchedDate"

// ImportQrz imports QSOs from QRZ logbook and merges them into Firestore. Called via GCP Cloud
// Functions.
func ImportQrz(w http.ResponseWriter, r *http.Request) {
	const isFixCase = true
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	if handleCorsOptions(w, r) {
		return
	}
	log.Print("Starting ImportQrz")
	fb, err := MakeFirebaseManager(&ctx, r)
	if err != nil {
		writeError(500, "Error", err, w)
		return
	}
	_, err = fb.GetLogbookProperty(qrzLastFetchedDate)
	if err != nil {
		writeError(500, "Error fetching logbook properties from firestore", err, w)
		return
	}

	secretStore := NewSecretStore(ctx)
	qrzAPIKey, err := secretStore.FetchSecret(fb.logbookID, qrzLogbookAPIKey)
	if err != nil {
		writeError(500, "Error fetching QRZ API key from secret manager", err, w)
		return
	}
	qrzResponse, err := ql.Fetch(ctx, &qrzAPIKey)
	if err != nil {
		writeError(500, "Error fetching QRZ.com data", err, w)
		return
	}
	log.Printf("Fetched QRZ.com data, %d records", qrzResponse.Count)
	qrzAdi, err := adifToProto(qrzResponse.Adif, time.Now())
	if err != nil {
		writeError(500, "Failed parsing QRZ.com data", err, w)
		log.Printf("QRZ.com payload: %v", base64.StdEncoding.EncodeToString([]byte(qrzResponse.Adif)))
		return
	}
	if isFixCase {
		for _, qso := range qrzAdi.Qsos {
			fixCase(qso)
		}
	}
	fsContacts, err := fb.GetContacts()
	if err != nil {
		writeError(500, "Error fetching contacts from firestore", err, w)
		return
	}
	created, modified, noDiff := fb.MergeQsos(fsContacts, qrzAdi)

	var report = map[string]int{}
	report["qrz"] = len(qrzAdi.Qsos)
	report["firestore"] = len(fsContacts)
	report["created"] = created
	report["modified"] = modified
	report["noDiff"] = noDiff
	log.Printf("report: %v", report)
	marshal, _ := json.Marshal(report)
	_, _ = fmt.Fprint(w, string(marshal))
}
