import { AsyncPipe, NgForOf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatListItem, MatNavList } from '@angular/material/list';
import { MatSidenav, MatSidenavContainer } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';

import { UserSettingsService } from './services/user-settings.service';
import { AgentComponent } from './shared/agent/agent.component';
import { AvatarComponent } from './shared/avatar/avatar.component';
import { SwUpdateComponent } from './shared/sw-update/sw-update.component';

@Component({
  selector: 'kel-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    MatToolbar,
    MatIconButton,
    MatIcon,
    RouterLink,
    AgentComponent,
    SwUpdateComponent,
    AvatarComponent,
    MatSidenavContainer,
    MatSidenav,
    MatNavList,
    MatListItem,
    NgForOf,
    MatDivider,
    AsyncPipe,
    RouterOutlet,
  ],
})
export class AppComponent implements OnInit {
  userSettingsService = inject(UserSettingsService);

  ngOnInit(): void {
    this.userSettingsService.init();
  }
}
