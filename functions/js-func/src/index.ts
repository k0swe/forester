import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { PubSub } from '@google-cloud/pubsub';
import { log } from 'firebase-functions/logger';

const documentId: string = 'logbooks/{logbookId}/contacts/{contactId}';
const projectId: string = 'k0swe-kellog';
const topicName: string = 'contact-created';

// noinspection JSUnusedGlobalSymbols
export const onCreateContact = onDocumentCreated(documentId, async (event) => {
  log('Contact was created', event.data?.ref.path);
  const pubsub = new PubSub({ projectId });
  await pubsub.topic(topicName).publishMessage({ json: event.params });
});
