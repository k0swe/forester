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
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import moment from 'moment';
import { Observable } from 'rxjs';

import { Qso } from '../../qso';
import { LogbookService } from '../../services/logbook.service';
import { FirebaseQso, QsoService } from '../../services/qso.service';

import ControlPosition = google.maps.ControlPosition;

interface State {
  name: string;
  abbrev: string;
  lat: number;
  lon: number;
}

@Component({
  selector: 'kel-was',
  templateUrl: './was.component.html',
  styleUrls: ['./was.component.scss'],
  imports: [
    GoogleMapsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
})
export class WasComponent implements OnInit, AfterViewInit {
  private logbookService = inject(LogbookService);
  private qsoService = inject(QsoService);
  private destroyRef = inject(DestroyRef);

  @ViewChild('map') map: GoogleMap;
  @ViewChild('filterSelectors') filterSelectors: ElementRef;
  mode = 'mixed';
  band = 'mixed';
  zoom = 3;
  center: google.maps.LatLngLiteral = { lat: 40, lng: -105 };
  options: google.maps.MapOptions = {
    minZoom: 2,
    maxZoom: 9,
    streetViewControl: false,
    mapTypeControlOptions: {
      position: ControlPosition.TOP_RIGHT,
    },
  };

  states: Array<State> = [
    { name: 'Alabama', abbrev: 'AL', lat: 32.601, lon: -86.6807 },
    { name: 'Alaska', abbrev: 'AK', lat: 61.3025, lon: -152.775 },
    { name: 'Arizona', abbrev: 'AZ', lat: 34.1682, lon: -111.9309 },
    { name: 'Arkansas', abbrev: 'AR', lat: 34.7519, lon: -92.1314 },
    { name: 'California', abbrev: 'CA', lat: 36.2719, lon: -120.2704 },
    { name: 'Colorado', abbrev: 'CO', lat: 38.9979, lon: -105.5506 },
    { name: 'Connecticut', abbrev: 'CT', lat: 41.5188, lon: -72.7575 },
    { name: 'Delaware', abbrev: 'DE', lat: 39.1453, lon: -75.4189 },
    { name: 'Florida', abbrev: 'FL', lat: 27.9757, lon: -81.833 },
    { name: 'Georgia', abbrev: 'GA', lat: 32.6781, lon: -83.223 },
    { name: 'Hawaii', abbrev: 'HI', lat: 20.46, lon: -157.505 },
    { name: 'Idaho', abbrev: 'ID', lat: 44.4946, lon: -114.1424 },
    { name: 'Illinois', abbrev: 'IL', lat: 39.7393, lon: -89.5041 },
    { name: 'Indiana', abbrev: 'IN', lat: 39.7662, lon: -86.4413 },
    { name: 'Iowa', abbrev: 'IA', lat: 41.9383, lon: -93.3898 },
    { name: 'Kansas', abbrev: 'KS', lat: 38.4988, lon: -98.3201 },
    { name: 'Kentucky', abbrev: 'KY', lat: 37.8223, lon: -84.7682 },
    { name: 'Louisiana', abbrev: 'LA', lat: 30.9734, lon: -92.4299 },
    { name: 'Maine', abbrev: 'ME', lat: 45.2185, lon: -69.0149 },
    { name: 'Maryland', abbrev: 'MD', lat: 39.3064, lon: -77.2684 },
    { name: 'Massachusetts', abbrev: 'MA', lat: 42.3629, lon: -71.7181 },
    { name: 'Michigan', abbrev: 'MI', lat: 44.9436, lon: -85.4158 },
    { name: 'Minnesota', abbrev: 'MN', lat: 46.4419, lon: -93.3655 },
    { name: 'Mississippi', abbrev: 'MS', lat: 32.5851, lon: -89.8772 },
    { name: 'Missouri', abbrev: 'MO', lat: 38.3047, lon: -92.4371 },
    { name: 'Montana', abbrev: 'MT', lat: 46.6798, lon: -110.0448 },
    { name: 'Nebraska', abbrev: 'NE', lat: 41.5008, lon: -99.6809 },
    { name: 'Nevada', abbrev: 'NV', lat: 38.502, lon: -117.0231 },
    { name: 'New Hampshire', abbrev: 'NH', lat: 44.0012, lon: -71.5799 },
    { name: 'New Jersey', abbrev: 'NJ', lat: 40.143, lon: -74.2311 },
    { name: 'New Mexico', abbrev: 'NM', lat: 34.1662, lon: -106.0261 },
    { name: 'New York', abbrev: 'NY', lat: 42.7056, lon: -74.9797 },
    { name: 'North Carolina', abbrev: 'NC', lat: 35.2146, lon: -79.8913 },
    { name: 'North Dakota', abbrev: 'ND', lat: 47.4679, lon: -100.3023 },
    { name: 'Ohio', abbrev: 'OH', lat: 40.1904, lon: -82.6693 },
    { name: 'Oklahoma', abbrev: 'OK', lat: 35.3098, lon: -97.7166 },
    { name: 'Oregon', abbrev: 'OR', lat: 44.1419, lon: -120.5381 },
    { name: 'Pennsylvania', abbrev: 'PA', lat: 40.9946, lon: -77.6047 },
    { name: 'Rhode Island', abbrev: 'RI', lat: 41.5827, lon: -71.5065 },
    { name: 'South Carolina', abbrev: 'SC', lat: 33.6251, lon: -80.947 },
    { name: 'South Dakota', abbrev: 'SD', lat: 44.2127, lon: -100.2472 },
    { name: 'Tennessee', abbrev: 'TN', lat: 35.8305, lon: -85.9786 },
    { name: 'Texas', abbrev: 'TX', lat: 31.1693, lon: -100.0768 },
    { name: 'Utah', abbrev: 'UT', lat: 39.4998, lon: -111.547 },
    { name: 'Vermont', abbrev: 'VT', lat: 43.8718, lon: -72.8478 },
    { name: 'Virginia', abbrev: 'VA', lat: 37.5034, lon: -78.4588 },
    { name: 'Washington', abbrev: 'WA', lat: 47.4233, lon: -120.3252 },
    { name: 'West Virginia', abbrev: 'WV', lat: 38.9202, lon: -80.1817 },
    { name: 'Wisconsin', abbrev: 'WI', lat: 44.7863, lon: -89.8267 },
    { name: 'Wyoming', abbrev: 'WY', lat: 43.0003, lon: -107.5546 },
  ];
  markers = new Map<string, google.maps.Marker>();
  paths = new Map<string, google.maps.Polyline>();
  infoWindow: google.maps.InfoWindow = new google.maps.InfoWindow();

  ngOnInit(): void {
    this.logbookService.logbookId$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((id) => this.qsoService.init(id));
  }

  ngAfterViewInit(): void {
    this.setupMapControls();

    this.states.forEach((state) => {
      let markerOpts = WasComponent.makeNoQsoMarkerOptions(state);
      markerOpts.map = this.map.googleMap;
      const marker = new google.maps.Marker(markerOpts);
      this.markers.set(state.abbrev, marker);
      let polyline = new google.maps.Polyline({
        strokeColor: 'darkgreen',
        strokeOpacity: 0.5,
        strokeWeight: 1,
        geodesic: true,
        map: this.map.googleMap,
      });
      this.paths.set(state.abbrev, polyline);
    });
    this.updateMarkers();
  }

  private setupMapControls() {
    // TODO: why can't I see select option list when map is fullscreen, maybe z-index?
    this.filterSelectors.nativeElement.remove();
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(
      this.filterSelectors.nativeElement,
    );
  }

  private updateMarkers(): void {
    this.states.forEach((state) => {
      this.findQsoForState(state.abbrev)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((fbq) => {
          const marker = this.markers.get(state.abbrev);
          let markerOpts: google.maps.MarkerOptions;
          let iw: google.maps.InfoWindowOptions;
          if (fbq !== undefined) {
            markerOpts = WasComponent.makeQsoMarkerOptions(state, fbq.qso);
            iw = WasComponent.makeQsoInfoWindowOptions(state, fbq.qso);
            const loggingStationPosition: google.maps.LatLngLiteral = {
              lat: +fbq.qso.loggingStation.latitude,
              lng: +fbq.qso.loggingStation.longitude,
            };
            this.paths
              .get(state.abbrev)
              .setPath([loggingStationPosition, markerOpts.position]);
          } else {
            markerOpts = WasComponent.makeNoQsoMarkerOptions(state);
            iw = WasComponent.makeNoQsoInfoWindowOptions(state);
            this.paths.get(state.abbrev).setPath([{ lat: 0, lng: 0 }]);
          }
          markerOpts.map = this.map.googleMap;
          marker.setOptions(markerOpts);
          marker.addListener('click', () => {
            this.infoWindow.setOptions(iw);
            this.infoWindow.open(this.map.googleMap, marker);
          });
        });
    });
  }

  private findQsoForState(abbrev: string): Observable<FirebaseQso | undefined> {
    if (abbrev === 'AK') {
      return this.qsoService.findWASQso({
        country: 'Alaska',
        mode: this.mode,
        band: this.band,
      });
    }
    if (abbrev === 'HI') {
      return this.qsoService.findWASQso({
        country: 'Hawaii',
        mode: this.mode,
        band: this.band,
      });
    }
    return this.qsoService.findWASQso({
      country: 'United States',
      state: abbrev,
      mode: this.mode,
      band: this.band,
    });
  }

  changeFilters(): void {
    this.updateMarkers();
  }

  private static makeQsoMarkerOptions(
    state: State,
    qso: Qso,
  ): google.maps.MarkerOptions {
    let latitude = state.lat;
    let longitude = state.lon;
    if (qso.contactedStation.latitude != null) {
      latitude = +qso.contactedStation.latitude;
    }
    if (qso.contactedStation.longitude != null) {
      longitude = +qso.contactedStation.longitude;
    }
    const icon = QsoService.isWASQsl(qso)
      ? '/assets/map-pin-green.svg'
      : '/assets/map-pin-yellow.svg';
    return {
      position: {
        lat: latitude,
        lng: longitude,
      },
      icon: icon,
      title: state.abbrev,
    };
  }

  static makeQsoInfoWindowOptions(
    state: State,
    qso: Qso,
  ): google.maps.InfoWindowOptions {
    const timeStr: string = moment(qso.timeOn).utc().format('YYYY-MM-DD HH:mm');
    let qsl = 'no QSL yet';
    if (qso.lotw != null && qso.lotw.receivedStatus == 'Y') {
      qsl = 'QSL via LotW';
    } else if (qso.card != null && qso.card.receivedStatus == 'Y') {
      qsl = 'QSL via card';
    }
    let msg = `Contacted ${qso.contactedStation.stationCall} in ${state.name}
              <br>on ${timeStr}<br>via ${qso.band} ${qso.mode}<br>${qsl}`;
    return {
      content: msg,
    };
  }

  private static makeNoQsoMarkerOptions(
    state: State,
  ): google.maps.MarkerOptions {
    return {
      position: {
        lat: state.lat,
        lng: state.lon,
      },
      icon: '/assets/map-pin-red.svg',
      title: state.name,
    };
  }

  static makeNoQsoInfoWindowOptions(
    state: State,
  ): google.maps.InfoWindowOptions {
    return {
      content: `${state.name} not contacted`,
    };
  }
}
