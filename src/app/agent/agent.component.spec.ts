import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AgentComponent} from './agent.component';

describe('AgentComponent', () => {
  let component: AgentComponent;
  let fixture: ComponentFixture<AgentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AgentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
