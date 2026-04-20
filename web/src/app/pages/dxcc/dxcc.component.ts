import {
  AfterViewInit,
  Component,
  DestroyRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { MatCardModule } from '@angular/material/card';
import Maidenhead from '@amrato/maidenhead-ts';
import moment from 'moment';

import { Qso, Station } from '../../qso';
import { DxccRef } from '../../reference/dxcc';
import { LogbookService } from '../../services/logbook.service';
import { FirebaseQso, QsoService } from '../../services/qso.service';

@Component({
  selector: 'kel-dxcc',
  imports: [GoogleMapsModule, MatCardModule],
  templateUrl: './dxcc.component.html',
  styleUrls: ['./dxcc.component.scss'],
})
export class DxccComponent implements OnInit, AfterViewInit {
  private logbookService = inject(LogbookService);
  private qsoService = inject(QsoService);
  private destroyRef = inject(DestroyRef);

  @ViewChild('map') map!: GoogleMap;
  zoom = 2;
  center: google.maps.LatLngLiteral = { lat: 20, lng: 0 };
  options: google.maps.MapOptions = {
    minZoom: 2,
    maxZoom: 9,
    streetViewControl: false,
  };
  markers = new Map<number, google.maps.Marker>();
  paths = new Map<number, google.maps.Polyline>();
  private infoWindow?: google.maps.InfoWindow;

  ngOnInit(): void {
    this.logbookService.logbookId$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((id) => this.qsoService.init(id));
  }

  ngAfterViewInit(): void {
    this.infoWindow = new google.maps.InfoWindow();
    this.qsoService
      .getAllQsos()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((qsos) => this.updateMarkers(DxccComponent.selectQsosByDxcc(qsos)));
  }

  static selectQsosByDxcc(qsos: FirebaseQso[]): Map<number, FirebaseQso> {
    const byDxcc = new Map<number, FirebaseQso>();
    Array.from(qsos.values())
      .filter((fbq) => fbq.qso.timeOn && fbq.qso.contactedStation.dxcc)
      .sort(
        (a, b) =>
          (a.qso.timeOn as Date).getTime() - (b.qso.timeOn as Date).getTime(),
      )
      .forEach((fbq) => {
        const dxcc = fbq.qso.contactedStation.dxcc;
        const existing = byDxcc.get(dxcc);
        if (!existing) {
          byDxcc.set(dxcc, fbq);
          return;
        }
        if (!DxccComponent.isLotwConfirmed(existing.qso)) {
          if (DxccComponent.isLotwConfirmed(fbq.qso)) {
            byDxcc.set(dxcc, fbq);
          }
        }
      });
    return byDxcc;
  }

  private updateMarkers(qsosByDxcc: Map<number, FirebaseQso>): void {
    const googleMap = this.map?.googleMap;
    if (!googleMap) {
      return;
    }
    const current = new Set<number>(this.markers.keys());
    qsosByDxcc.forEach((fbq, dxcc) => {
      current.delete(dxcc);
      const marker = this.markers.get(dxcc) ?? new google.maps.Marker();
      const markerOpts = DxccComponent.makeQsoMarkerOptions(fbq.qso, dxcc);
      markerOpts.map = googleMap;
      marker.setOptions(markerOpts);
      google.maps.event.clearListeners(marker, 'click');
      marker.addListener('click', () => {
        if (!this.infoWindow) {
          return;
        }
        this.infoWindow.setOptions(DxccComponent.makeInfoWindowOptions(fbq.qso));
        this.infoWindow.open(googleMap, marker);
      });
      this.markers.set(dxcc, marker);

      const polyline = this.paths.get(dxcc) ?? DxccComponent.makeQsoPolyline();
      polyline.setMap(googleMap);
      polyline.setPath(DxccComponent.makeQsoPath(fbq.qso, markerOpts.position));
      this.paths.set(dxcc, polyline);
    });
    current.forEach((dxcc) => {
      this.markers.get(dxcc)?.setMap(null);
      this.markers.delete(dxcc);
      this.paths.get(dxcc)?.setMap(null);
      this.paths.delete(dxcc);
    });
  }

  private static makeQsoMarkerOptions(
    qso: Qso,
    dxcc: number,
  ): google.maps.MarkerOptions {
    const icon = DxccComponent.isLotwConfirmed(qso)
      ? '/assets/map-pin-green.svg'
      : '/assets/map-pin-yellow.svg';
    return {
      position: {
        lat: +(qso.contactedStation.latitude ?? 0),
        lng: +(qso.contactedStation.longitude ?? 0),
      },
      icon: icon,
      title: DxccRef.getById(dxcc)?.name ?? qso.contactedStation.country,
    };
  }

  private static makeInfoWindowOptions(qso: Qso): google.maps.InfoWindowOptions {
    const timeStr: string = moment(qso.timeOn).utc().format('YYYY-MM-DD HH:mm');
    const dxcc = qso.contactedStation.dxcc;
    const entityName =
      DxccRef.getById(dxcc)?.name ??
      qso.contactedStation.country ??
      `DXCC ${dxcc}`;
    const qsl = DxccComponent.isLotwConfirmed(qso)
      ? 'QSL via LotW'
      : 'No LotW confirmation yet';
    const msg = `Contacted ${qso.contactedStation.stationCall} in ${entityName}
              <br>on ${timeStr}<br>via ${qso.band} ${qso.mode}<br>${qsl}`;
    return {
      content: msg,
    };
  }

  private static makeQsoPath(
    qso: Qso,
    fallbackContactedPosition?: google.maps.LatLng | google.maps.LatLngLiteral,
  ): google.maps.LatLngLiteral[] {
    const loggingLocation = DxccComponent.getStationLocation(qso.loggingStation);
    const contactedLocation =
      DxccComponent.getStationLocation(qso.contactedStation) ??
      DxccComponent.toLiteral(fallbackContactedPosition);
    if (!loggingLocation || !contactedLocation) {
      return [];
    }
    return [loggingLocation, contactedLocation];
  }

  private static getStationLocation(
    station?: Station,
  ): google.maps.LatLngLiteral | undefined {
    if (
      station?.latitude != null &&
      station?.longitude != null &&
      Number.isFinite(+station.latitude) &&
      Number.isFinite(+station.longitude)
    ) {
      return {
        lat: +station.latitude,
        lng: +station.longitude,
      };
    }
    if (station?.gridSquare) {
      try {
        const loc = Maidenhead.fromLocator(station.gridSquare);
        return { lat: loc.latitude, lng: loc.longitude };
      } catch {
        return undefined;
      }
    }
    return undefined;
  }

  private static toLiteral(
    position?: google.maps.LatLng | google.maps.LatLngLiteral,
  ): google.maps.LatLngLiteral | undefined {
    if (!position) {
      return undefined;
    }
    if (position instanceof google.maps.LatLng) {
      return { lat: position.lat(), lng: position.lng() };
    }
    return position;
  }

  private static makeQsoPolyline(): google.maps.Polyline {
    return new google.maps.Polyline({
      strokeColor: 'darkgreen',
      strokeOpacity: 0.5,
      strokeWeight: 1,
      geodesic: true,
    });
  }

  private static isLotwConfirmed(q: Qso): boolean {
    return q.lotw != null && q.lotw.receivedStatus === 'Y';
  }
}
