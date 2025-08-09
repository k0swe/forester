import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { initializeFirestore, provideFirestore } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreditsComponent } from './pages/credits/credits.component';
import { HomeComponent } from './pages/home/home.component';
import { LogbookComponent } from './pages/logbook/logbook.component';
import { MapComponent } from './pages/map/map.component';
import { PrivacyAndTermsComponent } from './pages/privacy-and-terms/privacy-and-terms.component';
import { QsoListComponent } from './pages/qso-list/qso-list.component';
import { WasComponent } from './pages/was/was.component';
import { AgentComponent } from './shared/agent/agent.component';
import { AuthService } from './shared/auth/auth.service';
import { AvatarComponent } from './shared/avatar/avatar.component';
import { ImportExportService } from './shared/import-export/import-export.service';
import { LogbookSettingsComponent } from './shared/logbook-settings/logbook-settings.component';
import { LoginComponent } from './shared/login/login.component';
import { NewLogbookDialogComponent } from './shared/new-logbook-dialog/new-logbook-dialog.component';
import { QsoDetailComponent } from './shared/qso-detail/qso-detail.component';
import { QsoSearchComponent } from './shared/qso-search/qso-search.component';
import { QsoService } from './shared/qso/qso.service';
import { SecretService } from './shared/secret/secret.service';
import { StationDetailComponent } from './shared/station-detail/station-detail.component';
import { SwUpdateComponent } from './shared/sw-update/sw-update.component';
import { UserSettingsComponent } from './shared/user-settings/user-settings.component';
import { UserSettingsService } from './shared/user-settings/user-settings.service';

@NgModule({
  declarations: [
    AppComponent,

    LogbookComponent,

    NewLogbookDialogComponent,
    QsoDetailComponent,

    SwUpdateComponent,
    UserSettingsComponent,
  ],
  bootstrap: [AppComponent],
  imports: [
    AgentComponent,
    AppRoutingModule,
    AvatarComponent,
    LogbookSettingsComponent,
    StationDetailComponent,
    BrowserAnimationsModule,
    BrowserModule,
    CreditsComponent,
    FormsModule,
    GoogleMapsModule,
    HomeComponent,
    LoginComponent,
    MapComponent,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatOptionModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    PrivacyAndTermsComponent,
    QsoListComponent,
    QsoSearchComponent,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerImmediately',
    }),
    WasComponent,
  ],
  providers: [
    AuthService,
    ImportExportService,
    QsoService,
    SecretService,
    UserSettingsService,
    provideHttpClient(withInterceptorsFromDi()),
    provideAuth(() => getAuth()),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() =>
      initializeFirestore(getApp(), { ignoreUndefinedProperties: true }),
    ),
  ],
  exports: [StationDetailComponent],
})
export class AppModule {}
