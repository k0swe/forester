import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LogbookService {
  logbookId$ = new BehaviorSubject<string>(null);

  constructor() {}
}
