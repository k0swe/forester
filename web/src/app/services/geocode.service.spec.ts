import { TestBed } from '@angular/core/testing';

import { GeocodeService } from './geocode.service';

import GeocoderAddressComponent = google.maps.GeocoderAddressComponent;

function makeComponent(
  long_name: string,
  short_name: string,
): GeocoderAddressComponent {
  return { long_name, short_name, types: [] };
}

describe('GeocodeService', () => {
  let service: GeocodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeocodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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
