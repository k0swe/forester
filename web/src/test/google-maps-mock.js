// Mock object for Google Maps Angular API.
// See https://github.com/angular-ui/angular-google-maps/issues/270#issuecomment-42691473
// and https://github.com/ScottieR/angular-google-maps-mock
var google = {
  maps: {
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
