import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const RouteInfoOverlay = ({ 
  totalStops = 8,
  remainingStops = 8,
  totalTime = '4h 20m',
  totalDistance = '12.5 km',
  isOptimized = true,
  isVisible = true
}) => {
  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Today's Route</Text>
          {isOptimized && (
            <View style={styles.optimizedBadge}>
              <MaterialIcons name="bolt" size={14} color="#1152d4" />
              <Text style={styles.optimizedText}>OPTIMIZED</Text>
            </View>
          )}
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <MaterialIcons name="location-on" size={16} color="#64748B" />
            <Text style={styles.statText}>{remainingStops}/{totalStops} STOPS</Text>
          </View>
          
          <View style={styles.statItem}>
            <MaterialIcons name="schedule" size={16} color="#64748B" />
            <Text style={styles.statText}>{totalTime}</Text>
          </View>
          
          <View style={styles.statItem}>
            <MaterialIcons name="straighten" size={16} color="#64748B" />
            <Text style={styles.statText}>{totalDistance}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    backdropFilter: 'blur(10px)',
    zIndex: 100,
  },
  content: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111318',
  },
  optimizedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 82, 212, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  optimizedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1152d4',
    letterSpacing: 0.5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
});

export default RouteInfoOverlay;