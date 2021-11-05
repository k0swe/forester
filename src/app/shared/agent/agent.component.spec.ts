import { AgentComponent } from './agent.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

describe('AgentComponent', () => {
  let component: AgentComponent;
  let fixture: ComponentFixture<AgentComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AgentComponent],
        providers: [
          {
            provide: AngularFireAuth,
            useValue: {
              signInWithPopup: () => null,
            },
          },
          {
            provide: AngularFirestore,
            useValue: {
              doc: () => null,
            },
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
