import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Use safe MapComponents wrapper to handle compatibility issues
const { Marker } = require('../components/MapComponentsWrapper');

const DeliveryMarker = ({ 
  coordinate, 
  title, 
  type = 'pending', // 'next', 'completed', 'pending'
  onPress,
  isActive = false
}) => {
  // Define colors based on marker type
  const getMarkerColors = () => {
    switch (type) {
      case 'next':
        return {
          backgroundColor: '#10b981', // Emerald green for next stop
          borderColor: '#059669',
          iconColor: '#ffffff',
          textColor: '#ffffff'
        };
      case 'completed':
        return {
          backgroundColor: '#94a3b8', // Gray for completed
          borderColor: '#64748b',
          iconColor: '#ffffff',
          textColor: '#ffffff'
        };
      case 'pending':
      default:
        return {
          backgroundColor: '#f59e0b', // Amber for pending
          borderColor: '#d97706',
          iconColor: '#ffffff',
          textColor: '#ffffff'
        };
    }
  };

  const colors = getMarkerColors();

  return (
    <Marker
      coordinate={coordinate}
      title={title}
      onPress={onPress}
    >
      <View style={[
        styles.markerContainer,
        {
          backgroundColor: colors.backgroundColor,
          borderColor: colors.borderColor,
          borderWidth: 2,
        },
        isActive && styles.activeMarker
      ]}>
        <View style={styles.markerContent}>
          {type === 'next' && (
            <MaterialIcons name="navigation" size={16} color={colors.iconColor} />
          )}
          {type === 'completed' && (
            <MaterialIcons name="check-circle" size={16} color={colors.iconColor} />
          )}
          {type === 'pending' && (
            <MaterialIcons name="location-pin" size={16} color={colors.iconColor} />
          )}
        </View>
        <Text style={[styles.markerTitle, { color: colors.textColor }]}>
          {title}
        </Text>
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    minWidth: 60,
    minHeight: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activeMarker: {
    transform: [{ scale: 1.1 }],
  },
  markerContent: {
    marginBottom: 4,
  },
  markerTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    maxWidth: 80,
  },
});

export default DeliveryMarker;