import { AgentComponent } from './shared/agent/agent.component';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import {
  AngularFirestoreModule,
  SETTINGS as FIRESTORE_SETTINGS,
} from '@angular/fire/compat/firestore';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './shared/auth/auth.service';
import { AvatarComponent } from './shared/avatar/avatar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CreditsComponent } from './pages/credits/credits.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { HomeComponent } from './pages/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { ImportExportService } from './shared/import-export/import-export.service';
import { LogbookComponent } from './pages/logbook/logbook.component';
import { LogbookSettingsComponent } from './shared/logbook-settings/logbook-settings.component';
import { LoginComponent } from './shared/login/login.component';
import { MapComponent } from './pages/map/map.component';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { NewLogbookDialogComponent } from './shared/new-logbook-dialog/new-logbook-dialog.component';
import { NgModule } from '@angular/core';
import { PrivacyAndTermsComponent } from './pages/privacy-and-terms/privacy-and-terms.component';
import { QsoDetailComponent } from './shared/qso-detail/qso-detail.component';
import { QsoListComponent } from './pages/qso-list/qso-list.component';
import { QsoSearchComponent } from './shared/qso-search/qso-search.component';
import { QsoService } from './shared/qso/qso.service';
import { SecretService } from './shared/secret/secret.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { SwUpdateComponent } from './shared/sw-update/sw-update.component';
import { UserSettingsComponent } from './shared/user-settings/user-settings.component';
import { UserSettingsService } from './shared/user-settings/user-settings.service';
import { WasComponent } from './pages/was/was.component';
import { environment } from '../environments/environment';
import { StationDetailComponent } from './shared/station-detail/station-detail.component';

@NgModule({
  declarations: [
    AgentComponent,
    AppComponent,
    AvatarComponent,
    CreditsComponent,
    HomeComponent,
    LogbookComponent,
    LogbookSettingsComponent,
    LoginComponent,
    MapComponent,
    NewLogbookDialogComponent,
    PrivacyAndTermsComponent,
    QsoDetailComponent,
    QsoListComponent,
    QsoSearchComponent,
    SwUpdateComponent,
    UserSettingsComponent,
    WasComponent,
    StationDetailComponent,
  ],
  imports: [
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    GoogleMapsModule,
    HttpClientModule,
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
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerImmediately',
    }),
    ReactiveFormsModule,
  ],
  providers: [
    AuthService,
    ImportExportService,
    QsoService,
    SecretService,
    UserSettingsService,
    {
      provide: FIRESTORE_SETTINGS,
      useValue: {
        ignoreUndefinedProperties: true,
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
