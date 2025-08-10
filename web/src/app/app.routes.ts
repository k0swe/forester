import { Routes } from '@angular/router';

import { LoginGuard } from './login.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'credits',
    loadComponent: () =>
      import('./pages/credits/credits.component').then(
        (m) => m.CreditsComponent,
      ),
  },
  {
    path: 'privacy-and-terms',
    loadComponent: () =>
      import('./pages/privacy-and-terms/privacy-and-terms.component').then(
        (m) => m.PrivacyAndTermsComponent,
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./shared/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: ':callsign',
    loadComponent: () =>
      import('./pages/logbook/logbook.component').then(
        (m) => m.LogbookComponent,
      ),
    canActivate: [LoginGuard],
    children: [
      {
        path: 'qsos',
        loadComponent: () =>
          import('./pages/qso-list/qso-list.component').then(
            (m) => m.QsoListComponent,
          ),
      },
      {
        path: 'map',
        loadComponent: () =>
          import('./pages/map/map.component').then((m) => m.MapComponent),
      },
      {
        path: 'was',
        loadComponent: () =>
          import('./pages/was/was.component').then((m) => m.WasComponent),
      },
    ],
  },
];
