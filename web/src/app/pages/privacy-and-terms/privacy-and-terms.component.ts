import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'kel-privacy-and-terms',
  templateUrl: './privacy-and-terms.component.html',
  styleUrls: ['./privacy-and-terms.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatCardModule, MatIconModule],
})
export class PrivacyAndTermsComponent {}
