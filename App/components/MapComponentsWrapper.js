// MapComponentsWrapper.js - Safe wrapper for react-native-maps components
let MapView;
let Marker;
let Polyline;
let Circle;
let PROVIDER_DEFAULT;

// Try to load react-native-maps components safely
try {
  const MapComponents = require('react-native-maps');
  MapView = MapComponents.default;
  Marker = MapComponents.Marker;
  Polyline = MapComponents.Polyline;
  Circle = MapComponents.Circle;
  PROVIDER_DEFAULT = MapComponents.PROVIDER_DEFAULT;
} catch (error) {
  console.warn('react-native-maps not available, using fallback:', error.message);
  
  // Fallback implementations
  const { View, Image } = require('react-native');
  
  // Fallback MapView - just renders as a regular view with a map image
  MapView = ({ children, style, initialRegion, region, showsUserLocation, ...props }) => (
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
  Marker = ({ children, coordinate, title, identifier, ...props }) => (
    <View style={{ position: 'absolute', top: '45%', left: '50%', zIndex: 1000 }}>
      {children}
    </View>
  );
  
  // Fallback Polyline - renders as a view showing route
  Polyline = ({ coordinates, strokeColor, strokeWidth, ...props }) => (
    <View style={{ position: 'absolute', top: '50%', left: '30%', zIndex: 100 }} />
  );
  
  // Fallback Circle - renders as a view showing accuracy
  Circle = ({ center, radius, fillColor, strokeColor, strokeWidth, ...props }) => (
    <View style={{ position: 'absolute', top: '45%', left: '50%', zIndex: 999 }} />
  );
  
  PROVIDER_DEFAULT = undefined;
}

module.exports = {
  MapView,
  Marker,
  Polyline,
  Circle,
  PROVIDER_DEFAULT
};