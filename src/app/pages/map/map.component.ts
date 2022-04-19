import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Duration, ZonedDateTime } from 'js-joda';
import { FirebaseQso, QsoService } from '../../shared/qso/qso.service';
import { GoogleMap } from '@angular/google-maps';
import { LogbookService } from '../logbook/logbook.service';
import { Observable, switchMap } from 'rxjs';
import { Qso } from '../../qso';
// @ts-ignore
import moment from 'moment';

@Component({
  selector: 'kel-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild('map') map: GoogleMap;
  @ViewChild('filterSelectors') filterSelectors: ElementRef;
  zoom = 3;
  center: google.maps.LatLngLiteral = { lat: 40, lng: -105 };
  options: google.maps.MapOptions = {
    minZoom: 2,
    maxZoom: 9,
    streetViewControl: false,
    mapTypeControlOptions: {
      position: google.maps.ControlPosition.TOP_RIGHT,
    },
  };
  markers = new Map<string, google.maps.Marker>();
  paths = new Map<string, google.maps.Polyline>();
  infoWindow: google.maps.InfoWindow = new google.maps.InfoWindow();

  constructor(
    private logbookService: LogbookService,
    private qsoService: QsoService
  ) {}

  ngOnInit(): void {
    this.logbookService.logbookId$.subscribe((id) => this.qsoService.init(id));
  }

  ngAfterViewInit(): void {
    this.updateMarkers();
  }

  private updateMarkers(): void {
    this.findQsosForPast(Duration.ofHours(24)).subscribe((fbq) => {
      let marker = this.markers.get(fbq.id);
      if (marker == undefined) {
        marker = new google.maps.Marker();
      }
      let polyline = this.paths.get(fbq.id);
      if (polyline == undefined) {
        polyline = new google.maps.Polyline({
          strokeColor: 'darkgreen',
          strokeOpacity: 0.5,
          strokeWeight: 1,
          geodesic: true,
          map: this.map.googleMap,
        });
      }
      let markerOpts = MapComponent.makeQsoMarkerOptions(fbq.qso);
      let iw = MapComponent.makeQsoInfoWindowOptions(fbq.qso);
      const loggingStationPosition: google.maps.LatLngLiteral = {
        lat: fbq.qso.loggingStation.latitude,
        lng: fbq.qso.loggingStation.longitude,
      };
      polyline.setPath([loggingStationPosition, markerOpts.position]);
      markerOpts.map = this.map.googleMap;
      marker.setOptions(markerOpts);
      marker.addListener('click', () => {
        this.infoWindow.setOptions(iw);
        this.infoWindow.open(this.map.googleMap, marker);
      });
    });
  }

  private findQsosForPast(d: Duration): Observable<FirebaseQso> {
    this.qsoService.setFilter({
      dateAfter: ZonedDateTime.now().minusTemporalAmount(d),
    });
    return this.qsoService.getFilteredQsos().pipe(switchMap((fbqs) => fbqs));
  }

  private static makeQsoMarkerOptions(qso: Qso): google.maps.MarkerOptions {
    const latitude = qso.contactedStation.latitude;
    const longitude = qso.contactedStation.longitude;
    const icon = '/assets/map-pin-green.svg';
    return {
      position: {
        lat: latitude,
        lng: longitude,
      },
      icon: icon,
    };
  }

  static makeQsoInfoWindowOptions(qso: Qso): google.maps.InfoWindowOptions {
    const timeStr: string = moment(qso.timeOn).utc().format('YYYY-MM-DD HH:mm');
    let msg = `Contacted ${qso.contactedStation.stationCall}
              <br>on ${timeStr}<br>via ${qso.band} ${qso.mode}`;
    return {
      content: msg,
    };
  }
}
