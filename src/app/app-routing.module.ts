import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { QsoListComponent } from './qso-list/qso-list.component';
import { RouterModule, Routes } from '@angular/router';
import { WasComponent } from './was/was.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: ':callsign/qsos',
    component: QsoListComponent,
  },
  {
    path: ':callsign/was',
    component: WasComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
