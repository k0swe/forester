import {Component, OnInit} from '@angular/core';
import {Qso} from "../qso";

@Component({
  selector: 'app-qsos',
  templateUrl: './qsos.component.html',
  styleUrls: ['./qsos.component.css']
})
export class QsosComponent implements OnInit {
  qso: Qso = {
    band: "20m",
    dxCall: "N0CALL",
    dxGrid: "ZM33",
    frequencyHz: 14074000,
    mode: "FT8",
    myCall: "K0SWE",
    myGrid: "DM79",
    rstReceived: "",
    rstSent: "",
    timeOff: new Date(),
    timeOn: new Date(),
  }

  constructor() {
  }

  ngOnInit(): void {
  }

}
