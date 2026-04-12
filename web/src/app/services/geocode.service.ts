import { Injectable, inject } from '@angular/core';
import { MapGeocoder } from '@angular/google-maps';
import { firstValueFrom } from 'rxjs';

import { Station } from '../qso';

import GeocoderAddressComponent = google.maps.GeocoderAddressComponent;

const emptyComponent = {} as GeocoderAddressComponent;

@Injectable({
  providedIn: 'root',
})
export class GeocodeService {
  private geocoder = inject(MapGeocoder);

  async geocode(station: Station): Promise<Station> {
    let request: google.maps.GeocoderRequest;
    if (station.latitude && station.longitude) {
      request = {
        location: {
          lat: +station.latitude,
          lng: +station.longitude,
        },
      };
    } else {
      const parts = [
        station.city,
        station.county,
        station.state,
        station.country,
      ].filter((p) => !!p);
      request = { address: parts.join(', ') };
    }

    const { results } = await firstValueFrom(this.geocoder.geocode(request));
    if (!results || results.length === 0) {
      return {};
    }

    const components = results[0].address_components;
    const countryComponent =
      components.find((c) => c.types.includes('country')) ?? emptyComponent;
    const stateComponent =
      components.find((c) =>
        c.types.includes('administrative_area_level_1'),
      ) ?? emptyComponent;
    const countyComponent =
      components.find((c) =>
        c.types.includes('administrative_area_level_2'),
      ) ?? emptyComponent;
    const cityComponent =
      components.find((c) => c.types.includes('locality')) ??
      (components.length > 0 ? components[0] : emptyComponent);

    const isUS = countryComponent.short_name === 'US';
    return {
      country: countryComponent.long_name ?? countryComponent.short_name ?? '',
      state: this.resolveState(stateComponent, isUS),
      county: this.resolveCounty(countyComponent, isUS),
      city: cityComponent.long_name ?? cityComponent.short_name ?? '',
    };
  }

  private resolveState(
    component: GeocoderAddressComponent,
    isUS: boolean,
  ): string {
    if (isUS) {
      return component.short_name ?? component.long_name ?? '';
    }
    return component.long_name ?? component.short_name ?? '';
  }

  private resolveCounty(
    component: GeocoderAddressComponent,
    isUS: boolean,
  ): string {
    const name = component.long_name ?? component.short_name ?? '';
    if (isUS) {
      return name.replace(
        /\s+(County|Parish|Borough|Census Area|Municipality|City and Borough|Municipio|District)\s*$/i,
        '',
      );
    }
    return name;
  }
}
