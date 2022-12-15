import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ImportExportService } from './import-export.service';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { TestBed } from '@angular/core/testing';

describe('ImportExportService', () => {
  let service: ImportExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
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
    });
    service = TestBed.inject(ImportExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
