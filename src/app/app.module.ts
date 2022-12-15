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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatOptionModule } from '@angular/material/core';
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
