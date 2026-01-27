import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const DistanceOverlay = ({ 
  fromLocation = 'Current Location',
  toLocation = '284 Market St',
  distance = '2.3 km',
  estimatedTime = '8 min',
  viaRoute = 'Main St',
  isVisible = true
}) => {
  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <MaterialIcons name="route" size={20} color="#1152d4" />
          <Text style={styles.title}>Route Information</Text>
        </View>
        
        <View style={styles.routeInfo}>
          <View style={styles.locationItem}>
            <MaterialIcons name="circle" size={8} color="#1152d4" />
            <Text style={styles.locationText} numberOfLines={1}>{fromLocation}</Text>
          </View>
          
          <View style={styles.viaContainer}>
            <View style={styles.dashLine} />
            <Text style={styles.viaText}>via {viaRoute}</Text>
          </View>
          
          <View style={styles.locationItem}>
            <MaterialIcons name="location-on" size={16} color="#1152d4" />
            <Text style={styles.locationText} numberOfLines={1}>{toLocation}</Text>
          </View>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <MaterialIcons name="straighten" size={16} color="#64748B" />
            <Text style={styles.statValue}>{distance}</Text>
            <Text style={styles.statLabel}>DISTANCE</Text>
          </View>
          
          <View style={styles.statItem}>
            <MaterialIcons name="schedule" size={16} color="#64748B" />
            <Text style={styles.statValue}>{estimatedTime}</Text>
            <Text style={styles.statLabel}>EST. TIME</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    zIndex: 80,
  },
  content: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    backdropFilter: 'blur(10px)',
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111318',
  },
  routeInfo: {
    gap: 8,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111318',
    flex: 1,
  },
  viaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  dashLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 8,
  },
  viaText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111318',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94a3b8',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});

export default DistanceOverlay;