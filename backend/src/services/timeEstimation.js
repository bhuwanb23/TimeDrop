/**
 * timeEstimation service
 */

const AVERAGE_SPEED_KMH = 25;
const AVERAGE_STOP_TIME_MINUTES = 5;
const PREPARATION_TIME_MINUTES = 15;

const estimateDeliveryTime = (distanceKm, stopsCount) => {
  stopsCount = stopsCount || 1;
  var travelMinutes = (distanceKm / AVERAGE_SPEED_KMH) * 60;
  var stopMinutes = stopsCount * AVERAGE_STOP_TIME_MINUTES;
  var totalMinutes = Math.ceil(travelMinutes + stopMinutes + PREPARATION_TIME_MINUTES);
  return {
    estimatedMinutes: totalMinutes,
    estimatedHours: Math.floor(totalMinutes / 60),
    remainingMinutes: totalMinutes % 60,
    breakdown: { preparation: PREPARATION_TIME_MINUTES, travel: Math.ceil(travelMinutes), stops: stopMinutes }
  };
};

module.exports = { estimateDeliveryTime, AVERAGE_SPEED_KMH };