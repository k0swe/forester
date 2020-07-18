import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AgentComponent} from './agent/agent.component';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from "@angular/flex-layout";
import {HomeComponent} from './home/home.component';
import {HttpClientModule} from "@angular/common/http";
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {QsoListComponent} from './qso-list/qso-list.component';
import {QsoService} from './shared/qso.service';
import {MatCardModule} from "@angular/material/card";

@NgModule({
  declarations: [
    AgentComponent,
    AppComponent,
    HomeComponent,
    QsoListComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FlexLayoutModule,
    HttpClientModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
  ],
  providers: [QsoService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
