package forester

import (
	"cloud.google.com/go/secretmanager/apiv1"
	"context"
	"google.golang.org/api/iterator"
	secretmanagerpb "google.golang.org/genproto/googleapis/cloud/secretmanager/v1"
)

const lotwUsername = "lotw_username"
const lotwPassword = "lotw_password"
const qrzUsername = "qrz_username"
const qrzPassword = "qrz_password"
const qrzLogbookAPIKey = "qrz_logbook_api_key"

type SecretStore struct {
	ctx    context.Context
	client *secretmanager.Client
}

func NewSecretStore(ctx context.Context) SecretStore {
	client, _ := secretmanager.NewClient(ctx)
	return SecretStore{ctx, client}
}

func makeSecretID(scope string, key string) string {
	return scope + "_" + key
}

// FetchSecret gets the latest value of the secret for the given logbook and key.
func (s *SecretStore) FetchSecret(logbookID string, key string) (string, error) {
	secretID := makeSecretID(logbookID, key)
	versionName := "projects/" + projectID + "/secrets/" + secretID + "/versions/latest"
	req := &secretmanagerpb.AccessSecretVersionRequest{
		Name: versionName,
	}
	resp, err := s.client.AccessSecretVersion(s.ctx, req)
	if err != nil {
		return "", err
	}
	return string(resp.GetPayload().GetData()), nil
}

// SetSecret adds a version to the given secret, possibly creating the secret first. It returns the
// version name, e.g. "/projects/*/secrets/*/versions/n".
func (s *SecretStore) SetSecret(logbookID string, key string, secretValue string) (string, error) {
	secretID := makeSecretID(logbookID, key)
	projectName := "projects/" + projectID
	secretName := projectName + "/secrets/" + secretID
	_, err := s.client.GetSecret(s.ctx, &secretmanagerpb.GetSecretRequest{Name: secretName})
	if err != nil {
		// assume the secret didn't exist and create it
		secretName, err = s.createSecret(projectName, secretID)
		if err != nil {
			return "", err
		}
	}
	newVersion, err := s.addSecretVersion(secretName, secretValue)
	if err != nil {
		return "", err
	}
	err = s.deleteAllVersionsExceptLatest(secretName, newVersion)
	return newVersion, err
}

// Creates a new secret with no versions. Returns the secret name, e.g. "/projects/*/secrets/*".
func (s *SecretStore) createSecret(projectName string, secretID string) (string, error) {
	createResp, err := s.client.CreateSecret(s.ctx, &secretmanagerpb.CreateSecretRequest{
		Parent:   projectName,
		SecretId: secretID,
		Secret: &secretmanagerpb.Secret{
			Replication: &secretmanagerpb.Replication{
				Replication: &secretmanagerpb.Replication_Automatic_{
					Automatic: &secretmanagerpb.Replication_Automatic{},
				},
			},
		},
	})
	if err != nil {
		return "", err
	}
	return createResp.Name, nil
}

// Adds a version to the given secret. Returns the version name, e.g.
// "/projects/*/secrets/*/versions/n".
func (s *SecretStore) addSecretVersion(secretName string, secretValue string) (string, error) {
	versionResp, err := s.client.AddSecretVersion(s.ctx, &secretmanagerpb.AddSecretVersionRequest{
		Parent: secretName,
		Payload: &secretmanagerpb.SecretPayload{
			Data: []byte(secretValue),
		},
	})
	if err != nil {
		return "", err
	}
	return versionResp.Name, nil
}

// Destroys all versions of the secret except the given (latest) version name, e.g.
// "/projects/*/secrets/*/versions/n".
func (s *SecretStore) deleteAllVersionsExceptLatest(
	secretName string, latestVersionName string) error {

	versionItr := s.client.ListSecretVersions(s.ctx,
		&secretmanagerpb.ListSecretVersionsRequest{Parent: secretName})
	for {
		ver, err := versionItr.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return err
		}
		if ver.Name == latestVersionName {
			// Don't delete the (given) latest
			continue
		}
		ver, err = s.client.DestroySecretVersion(s.ctx,
			&secretmanagerpb.DestroySecretVersionRequest{Name: ver.Name, Etag: ver.Etag})
		if err != nil {
			return err
		}
	}
	return nil
}
