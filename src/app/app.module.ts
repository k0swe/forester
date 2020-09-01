import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AgentComponent} from './agent/agent.component';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireModule} from '@angular/fire';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {AuthService} from './shared/auth.service';
import {AvatarComponent} from './avatar/avatar.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import {GoogleMapsModule} from '@angular/google-maps';
import {HomeComponent} from './home/home.component';
import {HttpClientModule} from '@angular/common/http';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {QsoDetailComponent} from './qso-detail/qso-detail.component';
import {QsoListComponent} from './qso-list/qso-list.component';
import {QsoService} from './shared/qso.service';
import {WasComponent} from './was/was.component';
import {environment} from '../environments/environment';

@NgModule({
  declarations: [
    AgentComponent,
    AppComponent,
    AvatarComponent,
    HomeComponent,
    QsoDetailComponent,
    QsoListComponent,
    WasComponent,
  ],
  imports: [
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FlexLayoutModule,
    GoogleMapsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatGridListModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  providers: [
    AuthService,
    QsoService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
