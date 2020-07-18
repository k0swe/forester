import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {QsoListComponent} from './qso-list/qso-list.component';
import {QsoService} from './shared/qso.service';
import {HttpClientModule} from "@angular/common/http";
import {HomeComponent} from './home/home.component';
import {AgentComponent} from './agent/agent.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AgentComponent,
    AppComponent,
    HomeComponent,
    QsoListComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [QsoService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
