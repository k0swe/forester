import { Injectable } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';

import { environment } from '../../../environments/environment';
import { Station } from '../../qso';

import GeocoderAddressComponent = google.maps.GeocoderAddressComponent;

const emptyComponent = {} as GeocoderAddressComponent;

@Injectable({
  providedIn: 'root',
})
export class GeocodeService {
  private loader: Loader;

  constructor() {
    this.loader = new Loader({
      apiKey: environment.firebase.apiKey,
    });
  }

  async geocode(station: Station): Promise<Station> {
    await this.loader.importLibrary('geocoding');
    const geocoder = new google.maps.Geocoder();

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
        ? results[0].address_components.find((component) =>
            component.types.includes('administrative_area_level_2'),
          ) ?? emptyComponent
        : emptyComponent;
    const cityComponent =
      results[0].address_components.length > 2
        ? results[0].address_components.find((component) =>
            component.types.includes('locality'),
          ) ??
          results[0].address_components[0] ??
          emptyComponent
        : emptyComponent;
    return {
      country: countryComponent.long_name ?? countryComponent.short_name ?? '',
      state: stateComponent.long_name ?? stateComponent.short_name ?? '',
      county: countyComponent.long_name ?? countyComponent.short_name ?? '',
      city: cityComponent.long_name ?? cityComponent.short_name ?? '',
    };
  }
}
