import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'credits',
    loadComponent: () =>
      import('./pages/credits/credits.component').then(
        (m) => m.CreditsComponent,
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'privacy-and-terms',
    loadComponent: () =>
      import('./pages/privacy-and-terms/privacy-and-terms.component').then(
        (m) => m.PrivacyAndTermsComponent,
      ),
  },
];
