import {Component, OnInit} from '@angular/core';
import {QsoService} from '../shared/qso.service';
import {Observable} from 'rxjs';
import {Qso} from "../qso";

@Component({
  selector: 'k0s-qso-list',
  templateUrl: './qso-list.component.html',
  styleUrls: ['./qso-list.component.scss']
})
export class QsoListComponent implements OnInit {
  qsos$: Observable<Qso[]>;

  constructor(private qsoService: QsoService) {
  }

  ngOnInit(): void {
    this.qsos$ = this.qsoService.getQsos();
  }
}
