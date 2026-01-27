import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const TrafficOverlay = ({ 
  trafficCondition = 'light', // 'light', 'moderate', 'heavy', 'severe'
  trafficDelay = '0 min',
  alternativeRouteAvailable = false,
  isVisible = true
}) => {
  if (!isVisible) return null;

  const getTrafficInfo = () => {
    switch (trafficCondition) {
      case 'severe':
        return {
          color: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          icon: 'traffic',
          text: 'SEVERE TRAFFIC',
          description: 'Significant delays expected'
        };
      case 'heavy':
        return {
          color: '#f97316',
          backgroundColor: 'rgba(249, 115, 22, 0.1)',
          icon: 'warning',
          text: 'HEAVY TRAFFIC',
          description: 'Delays expected'
        };
      case 'moderate':
        return {
          color: '#eab308',
          backgroundColor: 'rgba(234, 179, 8, 0.1)',
          icon: 'info',
          text: 'MODERATE TRAFFIC',
          description: 'Normal conditions'
        };
      case 'light':
      default:
        return {
          color: '#22c55e',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          icon: 'check-circle',
          text: 'LIGHT TRAFFIC',
          description: 'Clear roads ahead'
        };
    }
  };

  const trafficInfo = getTrafficInfo();

  return (
    <View style={styles.container}>
      <View style={[styles.content, { backgroundColor: trafficInfo.backgroundColor }]}>
        <View style={styles.header}>
          <MaterialIcons name={trafficInfo.icon} size={20} color={trafficInfo.color} />
          <Text style={[styles.title, { color: trafficInfo.color }]}>{trafficInfo.text}</Text>
        </View>
        
        <Text style={[styles.description, { color: trafficInfo.color }]}>
          {trafficInfo.description}
        </Text>
        
        {trafficDelay !== '0 min' && (
          <View style={styles.delayContainer}>
            <MaterialIcons name="schedule" size={16} color={trafficInfo.color} />
            <Text style={[styles.delayText, { color: trafficInfo.color }]}>
              {trafficDelay} delay expected
            </Text>
          </View>
        )}
        
        {alternativeRouteAvailable && (
          <View style={styles.alternativeContainer}>
            <MaterialIcons name="alt-route" size={16} color="#1152d4" />
            <Text style={styles.alternativeText}>Alternative route available</Text>
          </View>
        )}
        
        <View style={styles.trafficLegend}>
          <Text style={styles.legendTitle}>TRAFFIC LEGEND</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#22c55e' }]} />
              <Text style={styles.legendText}>Light</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#eab308' }]} />
              <Text style={styles.legendText}>Moderate</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#f97316' }]} />
              <Text style={styles.legendText}>Heavy</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#ef4444' }]} />
              <Text style={styles.legendText}>Severe</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 250,
    right: 20,
    width: 200,
    zIndex: 70,
  },
  content: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 12,
    fontWeight: '600',
  },
  delayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  delayText: {
    fontSize: 12,
    fontWeight: '600',
  },
  alternativeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(17, 82, 212, 0.1)',
    padding: 8,
    borderRadius: 8,
  },
  alternativeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1152d4',
  },
  trafficLegend: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    paddingTop: 12,
    gap: 8,
  },
  legendTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  legendItem: {
    alignItems: 'center',
    gap: 4,
  },
  legendColor: {
    width: 16,
    height: 4,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#64748B',
  },
});

export default TrafficOverlay;