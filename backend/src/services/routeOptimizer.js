/**
 * routeOptimizer service
 */

const optimizeRoute = (startPoint, deliveries) => {
  if (!deliveries.length) return [];
  var route = [];
  var remaining = deliveries.slice();
  var current = startPoint;
  while (remaining.length > 0) {
    var nearestIdx = 0;
    var nearestDist = Infinity;
    for (var i = 0; i < remaining.length; i++) {
      var dist = calculateDistance(current, remaining[i].coordinates);
      if (dist < nearestDist) { nearestDist = dist; nearestIdx = i; }
    }
    var nearest = remaining.splice(nearestIdx, 1)[0];
    route.push(Object.assign({}, nearest, { distanceFromPrevious: nearestDist }));
    current = nearest.coordinates;
  }
  return route;
};

const calculateDistance = (p1, p2) => {
  var toRad = (d) => d * Math.PI / 180;
  var R = 6371;
  var dLat = toRad(p2.lat - p1.lat);
  var dLon = toRad(p2.lng - p1.lng);
  var a = Math.sin(dLat/2)**2 + Math.cos(toRad(p1.lat)) * Math.cos(toRad(p2.lat)) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

module.exports = { optimizeRoute, calculateDistance };