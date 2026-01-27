import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const MapLegend = ({ 
  isVisible = true,
  onToggle = null,
  showUserLocation = true,
  showDestinations = true,
  showRoute = true,
  showTraffic = true
}) => {
  if (!isVisible) return null;

  const legendItems = [
    {
      icon: 'person-pin-circle',
      color: '#1152d4',
      label: 'Your Location',
      enabled: showUserLocation
    },
    {
      icon: 'navigation',
      color: '#10b981',
      label: 'Next Stop',
      enabled: showDestinations
    },
    {
      icon: 'location-pin',
      color: '#f59e0b',
      label: 'Pending Stops',
      enabled: showDestinations
    },
    {
      icon: 'check-circle',
      color: '#94a3b8',
      label: 'Completed',
      enabled: showDestinations
    },
    {
      icon: 'route',
      color: '#1152d4',
      label: 'Route Line',
      enabled: showRoute
    },
    {
      icon: 'traffic',
      color: '#ef4444',
      label: 'Traffic',
      enabled: showTraffic
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>MAP LEGEND</Text>
          {onToggle && (
            <TouchableOpacity onPress={onToggle} style={styles.toggleButton}>
              <MaterialIcons name="close" size={18} color="#64748B" />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.legendItems}>
          {legendItems
            .filter(item => item.enabled)
            .map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <MaterialIcons 
                  name={item.icon} 
                  size={16} 
                  color={item.color} 
                />
                <Text style={styles.legendText}>{item.label}</Text>
              </View>
            ))}
        </View>
        
        <View style={styles.legendFooter}>
          <Text style={styles.footerText}>Tap legend items to toggle visibility</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 200,
    left: 20,
    zIndex: 60,
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
    minWidth: 200,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  toggleButton: {
    padding: 4,
  },
  legendItems: {
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111318',
    flex: 1,
  },
  legendFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  footerText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94a3b8',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default MapLegend;