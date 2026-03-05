/**
 * Route Calculator Utility
 * Calculates distance and duration between two coordinates
 * Uses Haversine formula for distance calculation
 */

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Convert degrees to radians
 */
const toRad = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Calculate route between start and end points
 * @param {Object} startCoords - { latitude, longitude }
 * @param {Object} endCoords - { latitude, longitude }
 * @returns {Object} { distance, duration, polyline }
 */
export const calculateRoute = async (startCoords, endCoords) => {
  try {
    // Calculate straight-line distance
    const distance = calculateDistance(
      startCoords.latitude,
      startCoords.longitude,
      endCoords.latitude,
      endCoords.longitude
    );
    
    // Estimate duration (assuming average speed of 40 km/h in city)
    const avgSpeed = 40; // km/h
    const durationHours = distance / avgSpeed;
    const durationMinutes = durationHours * 60;
    
    // Create simple polyline (straight line for now)
    // In production, you would call Google Maps or OSRM API
    const polyline = [
      { latitude: startCoords.latitude, longitude: startCoords.longitude },
      { latitude: endCoords.latitude, longitude: endCoords.longitude }
    ];
    
    return {
      distance, // in kilometers
      duration: durationMinutes, // in minutes
      polyline
    };
  } catch (error) {
    console.error('Error calculating route:', error);
    // Return fallback values
    return {
      distance: 0,
      duration: 0,
      polyline: []
    };
  }
};

/**
 * Format distance for display
 * @param {number} distanceKm - Distance in kilometers
 * @returns {string} Formatted distance string
 */
export const getDistanceText = (distanceKm) => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
};

/**
 * Format duration for display
 * @param {number} durationMin - Duration in minutes
 * @returns {string} Formatted duration string
 */
export const getDurationText = (durationMin) => {
  if (durationMin < 1) {
    return '< 1 min';
  }
  if (durationMin < 60) {
    return `${Math.round(durationMin)} min`;
  }
  const hours = Math.floor(durationMin / 60);
  const minutes = Math.round(durationMin % 60);
  return `${hours}h ${minutes}m`;
};

/**
 * Generate intermediate points for route visualization
 * @param {Object} start - Start coordinates
 * @param {Object} end - End coordinates
 * @param {number} numPoints - Number of intermediate points
 * @returns {Array} Array of coordinate points
 */
export const generateRoutePoints = (start, end, numPoints = 20) => {
  const points = [];
  
  for (let i = 0; i <= numPoints; i++) {
    const ratio = i / numPoints;
    const lat = start.latitude + (end.latitude - start.latitude) * ratio;
    const lng = start.longitude + (end.longitude - start.longitude) * ratio;
    points.push({ latitude: lat, longitude: lng });
  }
  
  return points;
};

export default {
  calculateDistance,
  calculateRoute,
  getDistanceText,
  getDurationText,
  generateRoutePoints
};
