import {
  provideHttpClient,
  withInterceptorsFromDi,
  withXhr,
} from '@angular/common/http';
import {
  ApplicationConfig,
  enableProdMode,
  importProvidersFrom,
} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FirebaseApp, getApps, initializeApp, setLogLevel } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, initializeFirestore } from 'firebase/firestore';

import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { FIREBASE_AUTH } from './firebase/firebase-auth.token';
import { FIREBASE_FIRESTORE } from './firebase/firebase-firestore.token';

if (environment.production) {
  enableProdMode();
}

setLogLevel('verbose');

let firebaseApp: FirebaseApp | undefined;
let firestore: Firestore | undefined;

function getOrInitFirebaseApp(): FirebaseApp {
  if (firebaseApp) {
    return firebaseApp;
  }
  const apps = getApps();
  firebaseApp = apps.length > 0 ? apps[0] : initializeApp(environment.firebase);
  return firebaseApp;
}

function getFirebaseAuth(): Auth {
  return getAuth(getOrInitFirebaseApp());
}

function getFirebaseFirestore(): Firestore {
  if (firestore) {
    return firestore;
  }
  firestore = initializeFirestore(getOrInitFirebaseApp(), {
    ignoreUndefinedProperties: true,
  });
  return firestore;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withXhr(), withInterceptorsFromDi()),
    { provide: FIREBASE_AUTH, useFactory: getFirebaseAuth },
    { provide: FIREBASE_FIRESTORE, useFactory: getFirebaseFirestore },
    importProvidersFrom(
      BrowserAnimationsModule,
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.production,
        registrationStrategy: 'registerWhenStable:30000',
      }),
    ),
  ],
};
