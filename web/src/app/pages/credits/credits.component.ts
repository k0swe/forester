import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';

import { versions } from '../../../environments/versions';

@Component({
  selector: 'kel-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.scss'],
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatTableModule],
})
export class CreditsComponent implements OnInit {
  private http = inject(HttpClient);

  licenses = new BehaviorSubject<Array<LicenseInfo>>([]);
  columnsToDisplay = ['name', 'installedVersion', 'author', 'licenseType'];
  gitRev = versions.revision;

  ngOnInit(): void {
    this.http
      .get<Array<LicenseInfo>>('/assets/license-report.json')
      .subscribe((response) => {
        response = response.map((lic) => {
          lic.link = lic.link.replace('git+', '');
          lic.link = lic.link.replace('.git', '');
          lic.link = lic.link.replace('git://', 'https://');
          return lic;
        });
        this.licenses.next(response);
      });
  }
}

interface LicenseInfo {
  name: string;
  licenseType: string;
  link: string;
  remoteVersion: string;
  installedVersion: string;
  author?: string;
}
