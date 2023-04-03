import * as functions from "firebase-functions";
import {PubSub} from "@google-cloud/pubsub";

const projectId = "k0swe-kellog";
const topicName = "contact-created";

// noinspection JSUnusedGlobalSymbols
export const onCreateContact = functions.firestore
    .document("logbooks/{logbookId}/contacts/{contactId}")
    .onCreate(async (snapshot, context) => {
      functions.logger.info("Contact was created", snapshot.ref.path);
      const pubsub = new PubSub({projectId});
      return pubsub.topic(topicName)
          .publish(Buffer.from(JSON.stringify(context.params)));
    });
