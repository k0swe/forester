import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { LoginComponent } from '../../components/login/login.component';

@Component({
  selector: 'app-home',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatIconModule,
    LoginComponent,
    AsyncPipe,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  auth = inject(Auth);
  protected readonly user$ = user(this.auth);
}
