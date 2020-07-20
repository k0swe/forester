import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QsoDetailComponent } from './qso-detail.component';

describe('QsoDetailComponent', () => {
  let component: QsoDetailComponent;
  let fixture: ComponentFixture<QsoDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QsoDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QsoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
