import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { CreditsComponent } from './credits.component';

describe('CreditsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CreditsComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
