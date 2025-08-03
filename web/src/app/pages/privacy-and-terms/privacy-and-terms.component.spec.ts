import { TestBed } from '@angular/core/testing';

import { PrivacyAndTermsComponent } from './privacy-and-terms.component';

describe('PrivacyAndTermsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacyAndTermsComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PrivacyAndTermsComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
