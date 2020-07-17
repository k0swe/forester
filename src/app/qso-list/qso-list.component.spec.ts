import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {QsoListComponent} from './qso-list.component';

describe('QsosComponent', () => {
  let component: QsoListComponent;
  let fixture: ComponentFixture<QsoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QsoListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QsoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
