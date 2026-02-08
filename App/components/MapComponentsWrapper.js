// MapComponentsWrapper.js - Fallback-only map components for compatibility
const { View, Image } = require('react-native');

// Fallback MapView - just renders as a regular view with a map image
const MapView = ({ 
  children, 
  style, 
  initialRegion, 
  region, 
  showsUserLocation, 
  showsMyLocationButton, 
  followsUserLocation, 
  showsCompass, 
  rotateEnabled, 
  pitchEnabled, 
  toolbarEnabled, 
  scrollEnabled, 
  zoomEnabled, 
  loadingEnabled,
  ...props 
}) => (
  <View style={style}>
    <Image
      source={{ uri: 'https://maps.wikimedia.org/osm-intl/13/37.78825/-122.4324.png' }}
      style={[style, { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }]}
      resizeMode="cover"
    />
    {children}
  </View>
);

// Fallback Marker - renders as a view positioned absolutely
const Marker = ({ children, coordinate, title, identifier, ...props }) => (
  <View style={{ position: 'absolute', top: '45%', left: '50%', zIndex: 1000 }}>
    {children}
  </View>
);

// Fallback Polyline - renders as a view showing route
const Polyline = ({ coordinates, strokeColor, strokeWidth, ...props }) => (
  <View style={{ position: 'absolute', top: '50%', left: '30%', zIndex: 100 }} />
);

// Fallback Circle - renders as a view showing accuracy
const Circle = ({ center, radius, fillColor, strokeColor, strokeWidth, ...props }) => (
  <View style={{ position: 'absolute', top: '45%', left: '50%', zIndex: 999 }} />
);

const PROVIDER_DEFAULT = undefined;

module.exports = {
  MapView,
  Marker,
  Polyline,
  Circle,
  PROVIDER_DEFAULT
};