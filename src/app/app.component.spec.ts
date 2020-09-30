import {AppComponent} from './app.component';
import {AuthService} from './shared/auth.service';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {RouterTestingModule} from '@angular/router/testing';
import {of} from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterTestingModule, MatSnackBarModule],
      providers: [
        {
          provide: AuthService, useValue: {
            user: () => of({
              displayName: 'Joe Schmoe',
              email: 'joe@schmoe.net',
              photoURL: 'http://example.com/image.png'
            })
          }
        },
        {
          provide: HttpClient, useValue: {
            get: null
          }
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
