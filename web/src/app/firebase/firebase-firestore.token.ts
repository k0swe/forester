import { InjectionToken } from '@angular/core';

import { Firestore } from 'firebase/firestore';

export const FIREBASE_FIRESTORE = new InjectionToken<Firestore>(
  'FIREBASE_FIRESTORE',
);
