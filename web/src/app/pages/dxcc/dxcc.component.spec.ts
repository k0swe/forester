import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DxccComponent } from './dxcc.component';

describe('DxccComponent', () => {
  let component: DxccComponent;
  let fixture: ComponentFixture<DxccComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DxccComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DxccComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
