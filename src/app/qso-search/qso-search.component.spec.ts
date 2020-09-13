import {ComponentFixture, TestBed} from '@angular/core/testing';

import {QsoSearchComponent} from './qso-search.component';

describe('QsoSearchComponent', () => {
  let component: QsoSearchComponent;
  let fixture: ComponentFixture<QsoSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QsoSearchComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QsoSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
