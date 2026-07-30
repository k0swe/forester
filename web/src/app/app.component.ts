import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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
  changeDetection: ChangeDetectionStrategy.Eager,
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
    MatDivider,
    RouterOutlet,
  ],
})
export class AppComponent {
  userSettingsService = inject(UserSettingsService);
  private readonly userSettings = toSignal(this.userSettingsService.settings$, {
    initialValue: {},
  });
  protected readonly starredLogbooks = computed(
    () => this.userSettings()?.starredLogbooks ?? [],
  );
}
