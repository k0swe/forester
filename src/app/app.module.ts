import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {QsosComponent} from './qsos/qsos.component';
import {QsoService} from './shared/qso.service';

@NgModule({
  declarations: [
    AppComponent,
    QsosComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule
  ],
  providers: [QsoService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
