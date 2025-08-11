import Maidenhead from '@amrato/maidenhead-ts';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Duration, ZonedDateTime, nativeJs } from 'js-joda';
import moment from 'moment';
import { Observable, of, switchMap } from 'rxjs';

import { Qso, Station } from '../../qso';
import { LogbookService } from '../../services/logbook.service';
import { FirebaseQso, QsoService } from '../../services/qso.service';

@Component({
  selector: 'kel-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  imports: [GoogleMapsModule, MatButtonModule, MatCardModule, MatIconModule],
})
export class MapComponent implements OnInit, AfterViewInit {
  private logbookService = inject(LogbookService);
  private qsoService = inject(QsoService);
  private destroyRef = inject(DestroyRef);

  @ViewChild('map') map: GoogleMap;
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

  ngOnInit(): void {
    this.logbookService.logbookId$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((id) => this.qsoService.init(id));
  }

  ngAfterViewInit(): void {
    this.updateMarkers();
  }

  private updateMarkers(): void {
    this.qsoService
      .getMostRecentQsoDate()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((mostRecentDate) => {
          if (!mostRecentDate) {
            return of([]);
          }
          const sessionEnd = ZonedDateTime.from(nativeJs(mostRecentDate));
          const sessionStart = sessionEnd.minusTemporalAmount(
            Duration.ofHours(24),
          );
          this.qsoService.setFilter({
            dateAfter: sessionStart,
            dateBefore: sessionEnd,
          });
          return this.qsoService.getFilteredQsos();
        }),
        switchMap((fbqs) => fbqs),
      )
      .subscribe((fbq) => {
        this.renderContactedMarker(fbq);
        this.renderQsoPath(fbq);
      });
  }

  private renderContactedMarker(fbq: FirebaseQso): void {
    const contactedLoc = MapComponent.getStationLocation(
      fbq.qso.contactedStation,
    );
    if (!contactedLoc) {
      return;
    }
    let marker = this.markers.get(fbq.id);
    if (marker == undefined) {
      marker = new google.maps.Marker();
    }

    let markerOpts = MapComponent.makeQsoMarkerOptions(fbq.qso);
    markerOpts.map = this.map.googleMap;
    marker.setOptions(markerOpts);
    let iw = MapComponent.makeQsoInfoWindowOptions(fbq.qso);
    marker.addListener('click', () => {
      this.infoWindow.setOptions(iw);
      this.infoWindow.open(this.map.googleMap, marker);
    });
  }

  private renderQsoPath(fbq: FirebaseQso) {
    const contactedLoc = MapComponent.getStationLocation(
      fbq.qso.contactedStation,
    );
    const loggingLoc = MapComponent.getStationLocation(fbq.qso.loggingStation);
    if (!loggingLoc || !contactedLoc) {
      return;
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
    polyline.setPath([loggingLoc, contactedLoc]);
    this.paths.set(fbq.id, polyline);
  }

  private static makeQsoMarkerOptions(qso: Qso): google.maps.MarkerOptions {
    const loc = MapComponent.getStationLocation(qso.contactedStation);
    return {
      position: loc,
      icon: '/assets/map-pin-green.svg',
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

  static getStationLocation(
    station: Station,
  ): google.maps.LatLngLiteral | null {
    if (!!station.latitude && !!station.longitude) {
      return {
        lat: +station.latitude,
        lng: +station.longitude,
      };
    }
    if (!!station.gridSquare) {
      const loc = Maidenhead.fromLocator(station.gridSquare);
      return {
        lat: loc.latitude,
        lng: loc.longitude,
      };
    }
    return null;
  }
}
