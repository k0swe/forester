import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-privacy-and-terms',
  templateUrl: './privacy-and-terms.component.html',
  styleUrls: ['./privacy-and-terms.component.scss'],
  imports: [MatCardModule, MatIconModule],
})
export class PrivacyAndTermsComponent {}
