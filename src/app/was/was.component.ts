import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'k0s-was',
  templateUrl: './was.component.html',
  styleUrls: ['./was.component.scss']
})
export class WasComponent implements OnInit {
  zoom = 3;
  center: google.maps.LatLngLiteral = {lat: 40, lng: -105}
  options: google.maps.MapOptions = {
    minZoom: 2,
    maxZoom: 7,
  }

  constructor() {
  }

  ngOnInit(): void {
  }

}
