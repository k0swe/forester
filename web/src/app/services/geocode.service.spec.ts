import { TestBed } from '@angular/core/testing';
import { MapGeocoder, MapGeocoderResponse } from '@angular/google-maps';
import { of } from 'rxjs';

import { GeocodeService } from './geocode.service';

function makeComponent(
  long_name: string,
  short_name: string,
  ...types: string[]
): google.maps.GeocoderAddressComponent {
  return { long_name, short_name, types };
}

function makeGeocoderResponse(
  components: google.maps.GeocoderAddressComponent[],
): MapGeocoderResponse {
  return {
    status: 'OK' as google.maps.GeocoderStatus,
    results: [{ address_components: components } as google.maps.GeocoderResult],
  };
}

const usComponents = [
  makeComponent('United States', 'US', 'country', 'political'),
  makeComponent('Colorado', 'CO', 'administrative_area_level_1', 'political'),
  makeComponent(
    'Jefferson County',
    'Jefferson County',
    'administrative_area_level_2',
    'political',
  ),
  makeComponent('Golden', 'Golden', 'locality', 'political'),
];

const caComponents = [
  makeComponent('Canada', 'CA', 'country', 'political'),
  makeComponent('Ontario', 'ON', 'administrative_area_level_1', 'political'),
  makeComponent(
    'Regional Municipality of Waterloo',
    'Regional Municipality of Waterloo',
    'administrative_area_level_2',
    'political',
  ),
  makeComponent('Waterloo', 'Waterloo', 'locality', 'political'),
];

describe('GeocodeService', () => {
  let service: GeocodeService;
  let geocoderSpy: jasmine.SpyObj<MapGeocoder>;

  beforeEach(() => {
    geocoderSpy = jasmine.createSpyObj<MapGeocoder>('MapGeocoder', ['geocode']);
    TestBed.configureTestingModule({
      providers: [{ provide: MapGeocoder, useValue: geocoderSpy }],
    });
    service = TestBed.inject(GeocodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('geocode()', () => {
    it('should geocode by lat/lon when coordinates are present', async () => {
      geocoderSpy.geocode.and.returnValue(of(makeGeocoderResponse(usComponents)));
      const result = await service.geocode({ latitude: 39.7555, longitude: -105.2211 });
      expect(geocoderSpy.geocode).toHaveBeenCalledWith({
        location: { lat: 39.7555, lng: -105.2211 },
      });
      expect(result.city).toBe('Golden');
    });

    it('should geocode by address text when no coordinates are present', async () => {
      geocoderSpy.geocode.and.returnValue(of(makeGeocoderResponse(usComponents)));
      await service.geocode({ city: 'Golden', state: 'CO', country: 'United States' });
      expect(geocoderSpy.geocode).toHaveBeenCalledWith({
        address: 'Golden, CO, United States',
      });
    });

    it('should omit empty address parts from the query string', async () => {
      geocoderSpy.geocode.and.returnValue(of(makeGeocoderResponse(usComponents)));
      await service.geocode({ city: 'Golden', country: 'United States' });
      expect(geocoderSpy.geocode).toHaveBeenCalledWith({
        address: 'Golden, United States',
      });
    });

    it('should return abbreviated state for a US address', async () => {
      geocoderSpy.geocode.and.returnValue(of(makeGeocoderResponse(usComponents)));
      const result = await service.geocode({ latitude: 39.7555, longitude: -105.2211 });
      expect(result.state).toBe('CO');
    });

    it('should strip "County" from a US county name', async () => {
      geocoderSpy.geocode.and.returnValue(of(makeGeocoderResponse(usComponents)));
      const result = await service.geocode({ latitude: 39.7555, longitude: -105.2211 });
      expect(result.county).toBe('Jefferson');
    });

    it('should use long state name for a non-US address', async () => {
      geocoderSpy.geocode.and.returnValue(of(makeGeocoderResponse(caComponents)));
      const result = await service.geocode({ latitude: 43.4643, longitude: -80.5204 });
      expect(result.state).toBe('Ontario');
    });

    it('should not strip suffixes from a non-US county/region name', async () => {
      geocoderSpy.geocode.and.returnValue(of(makeGeocoderResponse(caComponents)));
      const result = await service.geocode({ latitude: 43.4643, longitude: -80.5204 });
      expect(result.county).toBe('Regional Municipality of Waterloo');
    });

    it('should return an empty object when geocoder returns no results', async () => {
      geocoderSpy.geocode.and.returnValue(
        of({
          status: 'ZERO_RESULTS' as google.maps.GeocoderStatus,
          results: [],
        }),
      );
      const result = await service.geocode({ city: 'Nowhere' });
      expect(result).toEqual({});
    });

    it('should populate all fields from address components', async () => {
      geocoderSpy.geocode.and.returnValue(of(makeGeocoderResponse(usComponents)));
      const result = await service.geocode({ latitude: 39.7555, longitude: -105.2211 });
      expect(result).toEqual({
        country: 'United States',
        state: 'CO',
        county: 'Jefferson',
        city: 'Golden',
      });
    });
  });

  describe('resolveState', () => {
    it('should use short_name for US addresses', () => {
      const component = makeComponent('Colorado', 'CO');
      expect((service as any).resolveState(component, true)).toBe('CO');
    });

    it('should use long_name for non-US addresses', () => {
      const component = makeComponent('Ontario', 'ON');
      expect((service as any).resolveState(component, false)).toBe('Ontario');
    });
  });

  describe('resolveCounty', () => {
    it('should strip "County" suffix for US addresses', () => {
      const component = makeComponent('Jefferson County', 'Jefferson County');
      expect((service as any).resolveCounty(component, true)).toBe('Jefferson');
    });

    it('should strip "Parish" suffix for US addresses', () => {
      const component = makeComponent('Orleans Parish', 'Orleans Parish');
      expect((service as any).resolveCounty(component, true)).toBe('Orleans');
    });

    it('should strip "Borough" suffix for US addresses', () => {
      const component = makeComponent('Sitka Borough', 'Sitka Borough');
      expect((service as any).resolveCounty(component, true)).toBe('Sitka');
    });

    it('should strip "Census Area" suffix for US addresses', () => {
      const component = makeComponent(
        'Yukon-Koyukuk Census Area',
        'Yukon-Koyukuk Census Area',
      );
      expect((service as any).resolveCounty(component, true)).toBe(
        'Yukon-Koyukuk',
      );
    });

    it('should strip "Municipality" suffix for US addresses', () => {
      const component = makeComponent(
        'Anchorage Municipality',
        'Anchorage Municipality',
      );
      expect((service as any).resolveCounty(component, true)).toBe('Anchorage');
    });

    it('should strip "City and Borough" suffix for US addresses', () => {
      const component = makeComponent(
        'Juneau City and Borough',
        'Juneau City and Borough',
      );
      expect((service as any).resolveCounty(component, true)).toBe('Juneau');
    });

    it('should strip "Municipio" suffix for US addresses', () => {
      const component = makeComponent(
        'San Juan Municipio',
        'San Juan Municipio',
      );
      expect((service as any).resolveCounty(component, true)).toBe('San Juan');
    });

    it('should strip "District" suffix for US addresses', () => {
      const component = makeComponent(
        'Northwest Arctic District',
        'Northwest Arctic District',
      );
      expect((service as any).resolveCounty(component, true)).toBe(
        'Northwest Arctic',
      );
    });

    it('should not strip suffixes for non-US addresses', () => {
      const component = makeComponent('County Dublin', 'County Dublin');
      expect((service as any).resolveCounty(component, false)).toBe(
        'County Dublin',
      );
    });

    it('should return county name unchanged when no suffix matches', () => {
      const component = makeComponent('Denver', 'Denver');
      expect((service as any).resolveCounty(component, true)).toBe('Denver');
    });
  });
});
