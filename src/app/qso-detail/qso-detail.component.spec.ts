import {QsoDetailComponent} from './qso-detail.component';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

describe('QsoDetailComponent', () => {
  let component: QsoDetailComponent;
  let fixture: ComponentFixture<QsoDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [QsoDetailComponent]
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
