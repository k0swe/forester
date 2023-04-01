package forester

import (
	"cloud.google.com/go/firestore"
	"context"
	"crypto/sha256"
	"encoding/json"
	"errors"
	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"fmt"
	"github.com/imdario/mergo"
	"github.com/jinzhu/copier"
	adifpb "github.com/k0swe/adif-json-protobuf/go"
	"golang.org/x/oauth2"
	"google.golang.org/api/iterator"
	"google.golang.org/api/option"
	"google.golang.org/protobuf/encoding/protojson"
	"google.golang.org/protobuf/proto"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"
)

type FirestoreQso struct {
	qsopb  *adifpb.Qso
	docref *firestore.DocumentRef
}

type FirebaseManager struct {
	ctx             *context.Context
	userToken       *auth.Token
	logbookID       string
	firestoreClient *firestore.Client
	userDoc         *firestore.DocumentRef
	logbookDoc      *firestore.DocumentRef
	contactsCol     *firestore.CollectionRef
}

// MakeFirebaseManager does a bunch of initialization. It verifies the JWT and exchanges it for a
// user token, and inits a Firestore connection as that user.
func MakeFirebaseManager(ctx *context.Context, r *http.Request) (*FirebaseManager, error) {
	// Use the application default credentials

	if projectID == "" {
		panic("GCP_PROJECT is not set")
	}
	conf := &firebase.Config{ProjectID: projectID}
	app, err := firebase.NewApp(*ctx, conf)
	if err != nil {
		// 500
		return nil, fmt.Errorf("error initializing Firebase app: %w", err)
	}

	authClient, err := app.Auth(*ctx)
	if err != nil {
		// 500
		return nil, fmt.Errorf("error getting authClient: %w", err)
	}
	idToken, err := extractIDToken(r)
	if err != nil {
		// 403
		return nil, fmt.Errorf("couldn't find authorization: %w", err)
	}
	userToken, err := authClient.VerifyIDToken(*ctx, idToken)
	if err != nil {
		// 403
		return nil, fmt.Errorf("couldn't verify authorization: %w", err)
	}
	logbookID, err := extractLogbookID(r)
	if err != nil {
		// 400
		return nil, fmt.Errorf("couldn't get logbook ID: %w", err)
	}
	firestoreClient, err := makeFirestoreClient(*ctx, idToken)
	if err != nil {
		// 500
		return nil, fmt.Errorf("error creating firestore client: %w", err)
	}
	userDoc := firestoreClient.Collection("users").Doc(userToken.UID)
	logbookDoc := firestoreClient.Collection("logbooks").Doc(logbookID)
	contactsCol := logbookDoc.Collection("contacts")
	return &FirebaseManager{
		ctx,
		userToken,
		logbookID,
		firestoreClient,
		userDoc,
		logbookDoc,
		contactsCol,
	}, nil
}

func extractIDToken(r *http.Request) (string, error) {
	idToken := strings.TrimSpace(r.Header.Get("Authorization"))
	if idToken == "" {
		return "", errors.New("requests must be authenticated with a Firebase JWT")
	}
	idToken = strings.TrimPrefix(idToken, "Bearer ")
	return idToken, nil
}

func extractLogbookID(r *http.Request) (string, error) {
	logbookIds, ok := r.URL.Query()["logbookId"]
	if !ok || len(logbookIds) != 1 {
		return "", errors.New("must be exactly one logbookId param")
	}
	return logbookIds[0], nil
}

func makeFirestoreClient(ctx context.Context, idToken string) (*firestore.Client, error) {
	conf := &firebase.Config{ProjectID: projectID}
	userApp, err := firebase.NewApp(ctx, conf, option.WithTokenSource(
		oauth2.StaticTokenSource(
			&oauth2.Token{
				AccessToken: idToken,
			})))
	if err != nil {
		return nil, err
	}
	firestoreClient, err := userApp.Firestore(ctx)
	if err != nil {
		return nil, err
	}
	return firestoreClient, nil
}

func (f *FirebaseManager) GetUID() string {
	return f.userToken.UID
}

func (f *FirebaseManager) GetUserProperty(key string) (string, error) {
	return f.getDocProperty(f.userDoc, key)
}

func (f *FirebaseManager) GetLogbookProperty(key string) (string, error) {
	return f.getDocProperty(f.logbookDoc, key)
}

func (f *FirebaseManager) getDocProperty(doc *firestore.DocumentRef, key string) (string, error) {
	// This could be memoized, but I think the Firestore client does that anyway
	docSnapshot, err := doc.Get(*f.ctx)
	if err != nil {
		return "", err
	}
	if !docSnapshot.Exists() {
		return "", nil
	}
	return fmt.Sprint(docSnapshot.Data()[key]), nil
}

func (f *FirebaseManager) SetLogbookProperty(key string, value string) error {
	_, err := f.logbookDoc.Update(*f.ctx, []firestore.Update{{Path: key, Value: value}})
	return err
}

func (f *FirebaseManager) GetContacts() ([]FirestoreQso, error) {
	docItr := f.contactsCol.Documents(*f.ctx)
	var retval = make([]FirestoreQso, 0, 100)
	for i := 0; ; i++ {
		qsoDoc, err := docItr.Next()
		if errors.Is(err, iterator.Done) {
			break
		}
		if err != nil {
			return nil, err
		}

		firestoreQso, err := ParseFirestoreQso(qsoDoc)
		if err != nil {
			log.Printf("Skipping qso %d: unmarshaling error: %v", i, err)
			continue
		}
		retval = append(retval, firestoreQso)
	}
	return retval, nil
}

// MergeQsos merges the remote ADIF contacts into the Firestore ones. It returns the counts of
// QSOs created, modified, and with no difference.
func (f *FirebaseManager) MergeQsos(
	firebaseQsos []FirestoreQso,
	remoteAdi *adifpb.Adif) (int, int, int) {
	var created = 0
	var modified = 0
	var noDiff = 0
	m := map[string]FirestoreQso{}
	for _, fsQso := range firebaseQsos {
		hash := hashQso(fsQso.qsopb)
		m[hash] = fsQso
	}

	for _, remoteQso := range remoteAdi.Qsos {
		hash := hashQso(remoteQso)
		if _, ok := m[hash]; ok {
			diff := mergeQso(m[hash].qsopb, remoteQso)
			if diff {
				log.Printf("Updating QSO with %v on %v",
					remoteQso.ContactedStation.StationCall,
					remoteQso.TimeOn.String())
				err := f.Update(m[hash])
				if err != nil {
					continue
				}
				modified++
			} else {
				log.Printf("No difference for QSO with %v on %v",
					remoteQso.ContactedStation.StationCall,
					remoteQso.TimeOn.String())
				noDiff++
			}
		} else {
			log.Printf("Creating QSO with %v on %v",
				remoteQso.ContactedStation.StationCall,
				remoteQso.TimeOn.String())
			err := f.Create(remoteQso)
			if err != nil {
				continue
			}
			created++
		}
	}
	return created, modified, noDiff
}

func hashQso(qsopb *adifpb.Qso) string {
	timeOn := qsopb.TimeOn.AsTime()
	// Some providers (QRZ.com) only have minute precision
	timeOn = timeOn.Truncate(time.Minute)
	payload := []byte(normalizeCall(qsopb.LoggingStation.StationCall) +
		normalizeCall(qsopb.ContactedStation.StationCall) +
		strconv.FormatInt(timeOn.Unix(), 10))
	return fmt.Sprintf("%x", sha256.Sum256(payload))
}

func normalizeCall(call string) string {
	c := strings.ReplaceAll(call, "/", "")
	c = strings.ReplaceAll(c, "_", "")
	c = strings.ReplaceAll(c, "-", "")
	return c
}

// Given two QSO objects, replace missing values in `base` with those from `backfill`. Values
// already present in `base` should be preserved.
func mergeQso(base *adifpb.Qso, backfill *adifpb.Qso) bool {
	original := &adifpb.Qso{}
	_ = copier.Copy(original, base)
	cleanQsl(base)
	cleanQsl(backfill)
	_ = mergo.Merge(base, backfill)
	return !proto.Equal(original, base)
}

func (f *FirebaseManager) Create(qso *adifpb.Qso) error {
	buf, err := qsoToJSON(qso)
	if err != nil {
		log.Printf("Problem unmarshaling for create: %v", err)
		return err
	}
	_, err = f.contactsCol.NewDoc().Create(*f.ctx, buf)
	if err != nil {
		log.Printf("Problem creating: %v", err)
		return err
	}
	return nil
}

func (f *FirebaseManager) Update(qso FirestoreQso) error {
	buf, err := qsoToJSON(qso.qsopb)
	if err != nil {
		log.Printf("Problem unmarshaling for update: %v", err)
		return err
	}
	_, err = qso.docref.Set(*f.ctx, buf)
	if err != nil {
		log.Printf("Problem updating: %v", err)
		return err
	}
	return nil
}

func qsoToJSON(qso *adifpb.Qso) (map[string]interface{}, error) {
	jso, _ := protojson.Marshal(qso)
	var buf map[string]interface{}
	err := json.Unmarshal(jso, &buf)
	return buf, err
}

func cleanQsl(qso *adifpb.Qso) {
	// If QSO has LotW QSL with status=N or date=0001-01-01T00:00:00Z,
	// remove those to make way for the merge
	if qso.Lotw != nil {
		l := qso.Lotw
		if l.SentStatus == "N" {
			l.SentStatus = ""
		}
		if l.SentDate != nil &&
			(l.SentDate.Seconds == -62135596800 || l.SentDate.Seconds == 0) {
			l.SentDate = nil
		}
		if l.ReceivedStatus == "N" {
			l.ReceivedStatus = ""
		}
		if l.ReceivedDate != nil &&
			(l.ReceivedDate.Seconds == -62135596800 || l.ReceivedDate.Seconds == 0) {
			l.ReceivedDate = nil
		}
	}
}
