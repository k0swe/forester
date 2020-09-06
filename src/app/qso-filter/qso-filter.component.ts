import {Component, OnInit} from '@angular/core';
import {QsoService} from '../shared/qso.service';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'kel-qso-filter',
  templateUrl: './qso-filter.component.html',
  styleUrls: ['./qso-filter.component.scss']
})
export class QsoFilterComponent implements OnInit {
  filterForm: FormGroup;

  constructor(public fb: FormBuilder, private qsoSerivce: QsoService) {
  }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      callsign: [''],
    });
  }

  changed(): void {
    this.qsoSerivce.setFilter({
      call: this.filterForm.get('callsign').value.toUpperCase(),
    });
  }
}
