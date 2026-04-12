// Mock object for Google Maps Angular API.
// See https://github.com/angular-ui/angular-google-maps/issues/270#issuecomment-42691473
// and https://github.com/ScottieR/angular-google-maps-mock
var google = {
  maps: {
    GeocoderStatus: {
      ERROR: 'ERROR',
      INVALID_REQUEST: 'INVALID_REQUEST',
      OK: 'OK',
      OVER_DAILY_LIMIT: 'OVER_DAILY_LIMIT',
      OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
      REQUEST_DENIED: 'REQUEST_DENIED',
      UNKNOWN_ERROR: 'UNKNOWN_ERROR',
      ZERO_RESULTS: 'ZERO_RESULTS',
    },
    OverlayView: function () {},
    Marker: function () {
      return {
        addListener: () => {},
        push: () => {},
      };
    },
    InfoWindow: function () {
      return {
        open: () => {},
        setOptions: () => {},
      };
    },
    Map: function (obj) {
      return {
        setCenter: () => {},
        setOptions: () => {},
        setZoom: () => {},
      };
    },
  },
};
