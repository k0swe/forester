import { Component } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatIconModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
