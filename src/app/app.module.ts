import { AgentComponent } from './shared/agent/agent.component';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import {
  AngularFirestoreModule,
  SETTINGS as FIRESTORE_SETTINGS,
} from '@angular/fire/firestore';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './shared/auth/auth.service';
import { AvatarComponent } from './shared/avatar/avatar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CreditsComponent } from './pages/credits/credits.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { HomeComponent } from './pages/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { ImportExportService } from './shared/import-export/import-export.service';
import { LogbookComponent } from './pages/logbook/logbook.component';
import { LoginComponent } from './shared/login/login.component';
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
import { NgModule } from '@angular/core';
import { QsoDetailComponent } from './shared/qso-detail/qso-detail.component';
import { QsoListComponent } from './pages/qso-list/qso-list.component';
import { QsoSearchComponent } from './shared/qso-search/qso-search.component';
import { QsoService } from './shared/qso/qso.service';
import { UserSettingsComponent } from './shared/user-settings/user-settings.component';
import { UserSettingsService } from './shared/user-settings/user-settings.service';
import { WasComponent } from './pages/was/was.component';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AgentComponent,
    AppComponent,
    AvatarComponent,
    CreditsComponent,
    HomeComponent,
    LogbookComponent,
    LoginComponent,
    QsoDetailComponent,
    QsoListComponent,
    QsoSearchComponent,
    UserSettingsComponent,
    WasComponent,
  ],
  imports: [
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FlexLayoutModule,
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
    ReactiveFormsModule,
  ],
  providers: [
    AuthService,
    ImportExportService,
    QsoService,
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
