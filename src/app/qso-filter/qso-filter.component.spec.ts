import {ComponentFixture, TestBed} from '@angular/core/testing';

import {QsoFilterComponent} from './qso-filter.component';

describe('QsoFilterComponent', () => {
  let component: QsoFilterComponent;
  let fixture: ComponentFixture<QsoFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QsoFilterComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QsoFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
