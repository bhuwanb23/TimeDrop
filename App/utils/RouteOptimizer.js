import React from 'react';

// Helper function to calculate distance between two points using Haversine formula
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

// Helper function to calculate travel time based on distance and average speed
const calculateTravelTime = (distanceMeters, averageSpeedKmh = 30) => {
  // Convert distance to kilometers and calculate time in hours
  const distanceKm = distanceMeters / 1000;
  const timeHours = distanceKm / averageSpeedKmh;
  return timeHours * 60; // Return time in minutes
};

// Route optimizer that calculates optimized route using nearest neighbor algorithm
const optimizeRoute = (origin, destinations) => {
  if (!origin || !destinations || destinations.length === 0) {
    return { optimizedRoute: destinations, totalDistance: 0, totalTime: 0 };
  }

  const route = [];
  const unvisited = [...destinations];
  let currentPoint = origin;
  let totalDistance = 0;

  while (unvisited.length > 0) {
    let nearestIndex = 0;
    let nearestDistance = calculateDistance(currentPoint, unvisited[0]);

    // Find the nearest unvisited destination
    for (let i = 1; i < unvisited.length; i++) {
      const distance = calculateDistance(currentPoint, unvisited[i]);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    }

    // Add the nearest destination to the route
    const nearestDestination = unvisited.splice(nearestIndex, 1)[0];
    route.push(nearestDestination);
    totalDistance += nearestDistance;
    currentPoint = nearestDestination;
  }

  const totalTime = calculateTravelTime(totalDistance);

  return {
    optimizedRoute: route,
    totalDistance,
    totalTime
  };
};

// Calculate route statistics
const calculateRouteStats = (origin, destinations) => {
  if (!origin || !destinations || destinations.length === 0) {
    return {
      totalDistance: 0,
      totalTime: 0,
      stopsCount: 0,
      optimizedRoute: []
    };
  }

  const { optimizedRoute, totalDistance, totalTime } = optimizeRoute(origin, destinations);

  return {
    totalDistance,
    totalTime,
    stopsCount: destinations.length,
    optimizedRoute
  };
};

// Export utility functions
export {
  calculateDistance,
  calculateTravelTime,
  optimizeRoute,
  calculateRouteStats
};

export default {
  calculateDistance,
  calculateTravelTime,
  optimizeRoute,
  calculateRouteStats
};