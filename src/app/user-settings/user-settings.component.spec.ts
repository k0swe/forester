import { AgentService } from '../shared/agent.service';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserSettingsComponent } from './user-settings.component';
import { UserSettingsService } from '../shared/user-settings.service';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('UserSettingsComponent', () => {
  let component: UserSettingsComponent;
  let fixture: ComponentFixture<UserSettingsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [UserSettingsComponent],
        imports: [ReactiveFormsModule],
        providers: [
          {
            provide: MAT_DIALOG_DATA,
            useValue: null,
          },
          { provide: MatDialogRef, useValue: {} },
          {
            provide: AgentService,
            useValue: {
              getHost: () => 'localhost',
              getPort: () => 8081,
            },
          },
          {
            provide: UserSettingsService,
            useValue: {
              init: () => null,
              settings: () =>
                of({ callsign: 'N0CALL', qrzLogbookApiKey: 'ABCD-1234' }),
            },
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
