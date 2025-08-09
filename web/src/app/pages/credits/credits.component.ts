import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { versions } from '../../../environments/versions';

@Component({
  selector: 'kel-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.scss'],
})
export class CreditsComponent implements OnInit {
  licenses = new BehaviorSubject<Array<LicenseInfo>>([]);
  columnsToDisplay = ['name', 'installedVersion', 'author', 'licenseType'];
  gitRev = versions.revision;

  constructor(private http: HttpClient) {}

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
