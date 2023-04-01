const { readFileSync, createWriteStream } = require("fs");
const http = require("http");

const testing = require("@firebase/rules-unit-testing");
const { initializeTestEnvironment, assertFails, assertSucceeds } = testing;

const { setLogLevel } = require("firebase/firestore");

const MY_UID = "k0swe";
const THEIR_UID = "n0call";

/** @type testing.RulesTestEnvironment */
let testEnv;

before(async () => {
  // Silence expected rules rejections from Firestore SDK. Unexpected rejections
  // will still bubble up and will be thrown as an error (failing the tests).
  setLogLevel("error");

  testEnv = await initializeTestEnvironment({
    projectId: "firestore-test",
    firestore: { rules: readFileSync("firestore.rules", "utf8") },
  });
});

after(async () => {
  // Delete all the FirebaseApp instances created during testing.
  // Note: this does not affect or clear any data.
  await testEnv.cleanup();

  // Write the coverage report to a file
  const coverageFile = "firestore-coverage.html";
  const fstream = createWriteStream(coverageFile);
  await new Promise((resolve, reject) => {
    const { host, port } = testEnv.emulators.firestore;
    const quotedHost = host.includes(":") ? `[${host}]` : host;
    http.get(
      `http://${quotedHost}:${port}/emulator/v1/projects/${testEnv.projectId}:ruleCoverage.html`,
      (res) => {
        res.pipe(fstream, { end: true });

        res.on("end", resolve);
        res.on("error", reject);
      }
    );
  });

  console.log(`View firestore rule coverage information at ${coverageFile}\n`);
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

describe("Firestore rules", () => {
  it("should allow a user to read their own document", async () => {
    const db = testEnv.authenticatedContext(MY_UID).firestore();
    const myDoc = db.collection("users").doc(MY_UID);
    await assertSucceeds(myDoc.get());
  });

  it("should allow a user to write to their own document", async () => {
    const db = testEnv.authenticatedContext(MY_UID).firestore();
    const myDoc = db.collection("users").doc(MY_UID);
    await assertSucceeds(myDoc.set({ callsign: "K0SWE" }));
  });

  it("should allow a user to read their own collection", async () => {
    const db = testEnv.authenticatedContext(MY_UID).firestore();
    const contacts = db.collection("users").doc(MY_UID).collection("contacts");
    await assertSucceeds(contacts.get());
  });

  it("should allow a user to write to their own collection", async () => {
    const db = testEnv.authenticatedContext(MY_UID).firestore();
    const myDoc = db.collection("users").doc(MY_UID);
    await myDoc.set({ callsign: "K0SWE" });
    const contacts = myDoc.collection("contacts");
    await assertSucceeds(contacts.add({ contactedStation: "KE0OG" }));
  });

  it("should deny a user from reading a different user document", async () => {
    const db = testEnv.authenticatedContext(THEIR_UID).firestore();
    const myDoc = db.collection("users").doc(MY_UID);
    await assertFails(myDoc.get());
  });

  it("should deny a user from writing to a different user document", async () => {
    const db = testEnv.authenticatedContext(THEIR_UID).firestore();
    const myDoc = db.collection("users").doc(MY_UID);
    await assertFails(myDoc.set({ callsign: "N0CALL" }));
  });

  it("should deny anon from reading a user document", async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    const myDoc = db.collection("users").doc(MY_UID);
    await assertFails(myDoc.get());
  });

  it("should deny anon from writing to a user document", async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    const myDoc = db.collection("users").doc(MY_UID);
    await assertFails(myDoc.set({ callsign: "nobody" }));
  });

  it("should allow a user to create a logbook", async () => {
    const db = testEnv.authenticatedContext(MY_UID).firestore();
    const myDoc = db.collection("logbooks").doc("K0SWE");
    await assertSucceeds(myDoc.set({ editors: [MY_UID] }));
  });

  it("should allow an editor to read a logbook", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const fs = context.firestore();
      await fs
        .collection("logbooks")
        .doc("K0SWE")
        .set({ editors: [MY_UID] });
    });

    const db = testEnv.authenticatedContext(MY_UID).firestore();
    const myDoc = db.collection("logbooks").doc("K0SWE");
    await assertSucceeds(myDoc.get());
  });

  it("should allow an editor to read contacts in a logbook", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const fs = context.firestore();
      await fs
        .collection("logbooks")
        .doc("K0SWE")
        .set({ editors: [MY_UID] });
    });

    const db = testEnv.authenticatedContext(MY_UID).firestore();
    const contacts = db
      .collection("logbooks")
      .doc("K0SWE")
      .collection("contacts");
    await assertSucceeds(contacts.get());
  });
});
