import {AgentService} from '../shared/agent.service';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {UserSettingsComponent} from './user-settings.component';
import {UserSettingsService} from '../shared/user-settings.service';
import {of} from 'rxjs';

describe('UserSettingsComponent', () => {
  let component: UserSettingsComponent;
  let fixture: ComponentFixture<UserSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UserSettingsComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA, useValue: null
        },
        {
          provide: AgentService, useValue: {
            getHost: () => 'localhost',
            getPort: () => 8081,
          }
        },
        {
          provide: UserSettingsService, useValue: {
            init: () => null,
            settings: () => of({callsign: 'N0CALL', qrzLogbookApiKey: 'ABCD-1234'}),
          }
        },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
