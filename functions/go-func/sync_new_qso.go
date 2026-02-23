package forester

import (
	"cloud.google.com/go/pubsub/v2"
	"context"
)

// SyncNewQso listens to Pub/Sub for new contacts in Firestore, fills missing details from the
// QRZ.com database, and uploads them to the QRZ.com Logbook.
func SyncNewQso(ctx context.Context, m pubsub.Message) error {
	err := FillNewQsoFromQrz(ctx, m)
	if err != nil {
		return err
	}
	return UploadNewQsoToQrz(ctx, m)
}
