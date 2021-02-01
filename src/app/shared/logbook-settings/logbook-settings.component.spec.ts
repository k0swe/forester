import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogbookSettingsComponent } from './logbook-settings.component';

describe('LogbookSettingsComponent', () => {
  let component: LogbookSettingsComponent;
  let fixture: ComponentFixture<LogbookSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogbookSettingsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogbookSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
