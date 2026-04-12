import { Injectable } from '@angular/core';
import { importLibrary, setOptions } from '@googlemaps/js-api-loader';

import { environment } from '../../environments/environment';
import { Station } from '../qso';

import GeocoderAddressComponent = google.maps.GeocoderAddressComponent;

const emptyComponent = {} as GeocoderAddressComponent;

@Injectable({
  providedIn: 'root',
})
export class GeocodeService {
  constructor() {
    setOptions({ key: environment.firebase.apiKey });
  }

  async geocode(station: Station): Promise<Station> {
    const geocodingLibrary = await importLibrary('geocoding');
    const geocoder = new geocodingLibrary.Geocoder();

    let address: string;
    if (station.latitude && station.longitude) {
      address = station.latitude + ',' + station.longitude;
    } else {
      address =
        (station.city ?? '') +
        ',' +
        (station.county ?? '') +
        ',' +
        (station.state ?? '') +
        ',' +
        (station.country ?? '');
    }
    const response = geocoder.geocode({
      address: address,
      bounds: {
        north: +station.latitude,
        south: +station.latitude,
        east: +station.longitude,
        west: +station.longitude,
      },
    });
    const { results } = await response;
    const countryComponent =
      results[0].address_components.find((component) =>
        component.types.includes('country'),
      ) ?? emptyComponent;
    const stateComponent =
      results[0].address_components.find((component) =>
        component.types.includes('administrative_area_level_1'),
      ) ?? emptyComponent;
    const countyComponent =
      results[0].address_components.length > 3
        ? (results[0].address_components.find((component) =>
            component.types.includes('administrative_area_level_2'),
          ) ?? emptyComponent)
        : emptyComponent;
    const cityComponent =
      results[0].address_components.length > 2
        ? (results[0].address_components.find((component) =>
            component.types.includes('locality'),
          ) ??
          results[0].address_components[0] ??
          emptyComponent)
        : emptyComponent;
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
