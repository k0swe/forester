import { CreditsComponent } from './credits/credits.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LoginGuard } from './login.guard';
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
    path: 'credits',
    component: CreditsComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: ':callsign/qsos',
    component: QsoListComponent,
    canActivate: [LoginGuard],
  },
  {
    path: ':callsign/was',
    component: WasComponent,
    canActivate: [LoginGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
