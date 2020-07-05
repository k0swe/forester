import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QsosComponent } from './qsos.component';

describe('QsosComponent', () => {
  let component: QsosComponent;
  let fixture: ComponentFixture<QsosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QsosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QsosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
