import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.scss'],
  imports: [MatCardModule, MatTableModule],
})
export class CreditsComponent implements OnInit {
  licenses = new BehaviorSubject<Array<LicenseInfo>>([]);
  columnsToDisplay = ['name', 'installedVersion', 'author', 'licenseType'];
  // gitRev = versions.revision;

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
