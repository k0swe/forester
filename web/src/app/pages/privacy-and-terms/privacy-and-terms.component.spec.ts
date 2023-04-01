import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyAndTermsComponent } from './privacy-and-terms.component';

describe('PrivacyAndTermsComponent', () => {
  let component: PrivacyAndTermsComponent;
  let fixture: ComponentFixture<PrivacyAndTermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrivacyAndTermsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyAndTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
