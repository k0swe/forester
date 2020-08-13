import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WasComponent} from './was.component';

describe('WasComponent', () => {
  let component: WasComponent;
  let fixture: ComponentFixture<WasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WasComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
