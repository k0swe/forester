import Maidenhead from '@amrato/maidenhead-ts';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor() {}

  public getLocation(): Observable<HamLocation> {
    return new Observable((obs) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = new HamLocation();
          // TODO: vary precision based on pos.coords.accuracy?
          loc.latitude = Number(pos.coords.latitude.toFixed(2));
          loc.longitude = Number(pos.coords.longitude.toFixed(2));
          loc.gridSquare = Maidenhead.fromCoordinates(
            loc.latitude,
            loc.longitude,
            2,
          ).locator;
          obs.next(loc);
          obs.complete();
        },
        (err) => obs.error(err),
      );
    });
  }
}

export class HamLocation {
  latitude: number;
  longitude: number;
  gridSquare: string;
}
