import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLogbookDialogComponent } from './new-logbook-dialog.component';

describe('NewLogbookDialogComponent', () => {
  let component: NewLogbookDialogComponent;
  let fixture: ComponentFixture<NewLogbookDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewLogbookDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLogbookDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
