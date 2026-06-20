import { InjectionToken } from '@angular/core';

import { Auth } from 'firebase/auth';

export const FIREBASE_AUTH = new InjectionToken<Auth>('FIREBASE_AUTH');
