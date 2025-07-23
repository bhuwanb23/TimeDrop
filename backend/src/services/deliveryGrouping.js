/**
 * deliveryGrouping service
 */

const MAX_GROUP_DISTANCE_KM = 5;
const MAX_GROUP_SIZE = 10;

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  var R = 6371;
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLon = (lon2 - lon1) * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

const groupDeliveries = (deliveries) => {
  var groups = [];
  var used = new Set();
  deliveries.forEach(function(delivery) {
    if (used.has(delivery.id)) return;
    var group = [delivery];
    used.add(delivery.id);
    deliveries.forEach(function(other) {
      if (used.has(other.id) || group.length >= MAX_GROUP_SIZE) return;
      var dist = haversineDistance(delivery.coordinates.lat, delivery.coordinates.lng, other.coordinates.lat, other.coordinates.lng);
      if (dist <= MAX_GROUP_DISTANCE_KM) {
        group.push(other);
        used.add(other.id);
      }
    });
    groups.push(group);
  });
  return groups;
};

module.exports = { groupDeliveries, haversineDistance, MAX_GROUP_DISTANCE_KM };