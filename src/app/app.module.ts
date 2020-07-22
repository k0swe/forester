import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AgentComponent} from './agent/agent.component';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import {HomeComponent} from './home/home.component';
import {HttpClientModule} from '@angular/common/http';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTableModule} from "@angular/material/table";
import {MatToolbarModule} from '@angular/material/toolbar';
import {QsoDetailComponent} from './qso-detail/qso-detail.component';
import {QsoListComponent} from './qso-list/qso-list.component';
import {QsoService} from './shared/qso.service';

@NgModule({
  declarations: [
    AgentComponent,
    AppComponent,
    HomeComponent,
    QsoListComponent,
    QsoDetailComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FlexLayoutModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatSidenavModule,
    MatTableModule,
    MatToolbarModule,
  ],
  providers: [QsoService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
