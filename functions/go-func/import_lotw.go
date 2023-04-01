package forester

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"github.com/antihax/optional"
	adifpb "github.com/k0swe/adif-json-protobuf/go"
	"github.com/k0swe/lotw-qsl"
	"log"
	"net/http"
	"time"
)

const lotwLastFetchedDate = "lotwLastFetchedDate"

// ImportLotw imports QSLs from Logbook of the World and merges them into Firestore. Called via GCP
// Cloud Functions.
func ImportLotw(w http.ResponseWriter, r *http.Request) {
	const isFixCase = true
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	if handleCorsOptions(w, r) {
		return
	}
	log.Print("Starting ImportLotw")
	fb, err := MakeFirebaseManager(&ctx, r)
	if err != nil {
		writeError(500, "Error", err, w)
		return
	}
	lastFetchedTime, err := fb.GetLogbookProperty(lotwLastFetchedDate)
	if err != nil {
		writeError(500, "Error fetching logbook properties from firestore", err, w)
		return
	}
	if lastFetchedTime == "<nil>" {
		lastFetchedTime = "1970-01-01"
	}
	log.Printf("Last fetched time was %v", lastFetchedTime)
	lotwUser, lotwPass, err := getLOTWCreds(ctx, fb.logbookID)
	if err != nil {
		writeError(500, "Error fetching LotW creds", err, w)
		return
	}
	lotwResponse, err := lotw.Query(lotwUser, lotwPass, &lotw.QueryOpts{
		QsoQsl:      optional.NewInterface(lotw.YES),
		QsoQslsince: optional.NewString(lastFetchedTime),
		QsoMydetail: optional.NewInterface(lotw.YES),
	})
	if err != nil {
		writeError(500, "Error fetching LotW data", err, w)
		return
	}
	log.Printf("Fetched LotW data, %d bytes", len(lotwResponse))
	lotwAdi, err := adifToProto(lotwResponse, time.Now())
	if err != nil {
		writeError(500, "Failed parsing LotW data", err, w)
		log.Printf("LotW payload: %v", base64.StdEncoding.EncodeToString([]byte(lotwResponse)))
		return
	}
	fixLOTWQsls(lotwAdi)
	if isFixCase {
		for _, qso := range lotwAdi.Qsos {
			fixCase(qso)
		}
	}

	fsContacts, err := fb.GetContacts()
	if err != nil {
		writeError(500, "Error fetching contacts from firestore", err, w)
		return
	}
	created, modified, noDiff := fb.MergeQsos(fsContacts, lotwAdi)

	err = storeLastFetched(fb)
	if err != nil {
		writeError(500, "Failed storing last fetched date", err, w)
		return
	}
	var report = map[string]int{}
	report["lotw"] = len(lotwAdi.Qsos)
	report["firestore"] = len(fsContacts)
	report["created"] = created
	report["modified"] = modified
	report["noDiff"] = noDiff
	log.Printf("report: %v", report)
	marshal, _ := json.Marshal(report)
	_, _ = fmt.Fprint(w, string(marshal))
}

func storeLastFetched(fb *FirebaseManager) error {
	today := time.Now().UTC().Format("2006-01-02")
	return fb.SetLogbookProperty(lotwLastFetchedDate, today)
}

func fixLOTWQsls(lotwAdi *adifpb.Adif) {
	// LotW puts their QSL in the ADIF fields where cards should go
	for _, qso := range lotwAdi.Qsos {
		qso.Lotw = qso.Card
		qso.Card = nil
	}
}

func getLOTWCreds(ctx context.Context, logbookID string) (string, string, error) {
	secretStore := NewSecretStore(ctx)
	username, err := secretStore.FetchSecret(logbookID, lotwUsername)
	if err != nil {
		return "", "", err
	}
	password, err := secretStore.FetchSecret(logbookID, lotwPassword)
	if err != nil {
		return "", "", err
	}
	return username, password, nil
}
