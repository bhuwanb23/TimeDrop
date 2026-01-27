import React from 'react';
import { View } from 'react-native';

// Import MapComponents wrapper to handle compatibility issues
const { Polyline } = require('../components/MapComponentsWrapper');

const RoutePolyline = ({ 
  origin, 
  destination, 
  waypoints = [], 
  color = '#1152d4', 
  width = 6,
  linePattern = 'solid', // 'solid', 'dashed', 'dotted'
  onRouteCalculated = null,
  isVisible = true
}) => {
  // Calculate all coordinates for the route
  const calculateRouteCoordinates = () => {
    const coordinates = [];
    
    // Add origin if provided
    if (origin) {
      coordinates.push(origin);
    }
    
    // Add waypoints if provided
    if (waypoints && Array.isArray(waypoints)) {
      coordinates.push(...waypoints);
    }
    
    // Add destination if provided
    if (destination) {
      coordinates.push(destination);
    }
    
    return coordinates;
  };

  const routeCoordinates = calculateRouteCoordinates();

  // Calculate route distance and notify parent if needed
  React.useEffect(() => {
    if (onRouteCalculated && routeCoordinates.length >= 2) {
      // Simple distance calculation between points (in meters)
      const calculateDistance = (point1, point2) => {
        const R = 6371e3; // Earth's radius in meters
        const lat1Rad = point1.latitude * Math.PI / 180;
        const lat2Rad = point2.latitude * Math.PI / 180;
        const deltaLatRad = (point2.latitude - point1.latitude) * Math.PI / 180;
        const deltaLonRad = (point2.longitude - point1.longitude) * Math.PI / 180;

        const a = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
                  Math.cos(lat1Rad) * Math.cos(lat2Rad) *
                  Math.sin(deltaLonRad / 2) * Math.sin(deltaLonRad / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance in meters
      };

      let totalDistance = 0;
      for (let i = 0; i < routeCoordinates.length - 1; i++) {
        totalDistance += calculateDistance(routeCoordinates[i], routeCoordinates[i + 1]);
      }

      // Notify parent with route information
      onRouteCalculated({
        coordinates: routeCoordinates,
        distance: totalDistance,
        duration: totalDistance / 10, // Rough estimate (10 m/s average speed)
        numPoints: routeCoordinates.length
      });
    }
  }, [routeCoordinates, onRouteCalculated]);

  // Get line dash pattern based on linePattern prop
  const getLineDashPattern = () => {
    switch (linePattern) {
      case 'dashed':
        return [10, 10]; // Dash pattern
      case 'dotted':
        return [2, 5]; // Dot pattern
      case 'solid':
      default:
        return []; // Solid line
    }
  };

  if (!isVisible || routeCoordinates.length < 2) {
    return null;
  }

  return (
    <Polyline
      coordinates={routeCoordinates}
      strokeColor={color}
      strokeWidth={width}
      lineDashPhase={1}
      lineDashPattern={getLineDashPattern()}
    />
  );
};

export default RoutePolyline;