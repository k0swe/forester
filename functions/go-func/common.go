package forester

import (
	"cloud.google.com/go/firestore"
	"encoding/json"
	"fmt"
	adifpb "github.com/k0swe/adif-json-protobuf/go"
	"google.golang.org/protobuf/encoding/protojson"
	"log"
	"net/http"
	"os"
	"strings"
)

// GCP_PROJECT is a user-set environment variable.
var projectID = os.Getenv("GCP_PROJECT")

// Write CORS headers to the response. Returns true if this is an OPTIONS request; false otherwise.
func handleCorsOptions(w http.ResponseWriter, r *http.Request) bool {
	origin := r.Header.Get("Origin")
	if strings.Contains(origin, "forester.radio") || strings.Contains(origin, "localhost") {
		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Access-Control-Allow-Credentials", "true")
	}
	if r.Method == http.MethodOptions {
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Max-Age", "3600")
		w.WriteHeader(http.StatusNoContent)
		return true
	}
	return false
}

func writeError(statusCode int, message string, err error, w http.ResponseWriter) {
	w.WriteHeader(statusCode)
	_, _ = fmt.Fprintf(w, message+": %v", err)
	if statusCode >= 500 {
		log.Printf(message+": %v", err)
	}
}

func ParseFirestoreQso(qsoDoc *firestore.DocumentSnapshot) (FirestoreQso, error) {
	// I want to just qsoDoc.DataTo(&qso), but timestamps don't unmarshal
	buf := qsoDoc.Data()
	marshal, _ := json.Marshal(buf)
	var qso adifpb.Qso
	err := protojson.Unmarshal(marshal, &qso)
	return FirestoreQso{&qso, qsoDoc.Ref}, err
}
