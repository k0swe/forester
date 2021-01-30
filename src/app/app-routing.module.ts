import { CreditsComponent } from './pages/credits/credits.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './shared/login/login.component';
import { LoginGuard } from './login.guard';
import { NgModule } from '@angular/core';
import { QsoListComponent } from './pages/qso-list/qso-list.component';
import { RouterModule, Routes } from '@angular/router';
import { WasComponent } from './pages/was/was.component';
import { LogbookComponent } from './pages/logbook/logbook.component';

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
    path: ':callsign',
    component: LogbookComponent,
    canActivate: [LoginGuard],
    children: [
      { path: 'qsos', component: QsoListComponent },
      { path: 'was', component: WasComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
