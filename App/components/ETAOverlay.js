import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ETAOverlay = ({ 
  currentStop = 1,
  nextStopETA = '2:15 PM',
  nextStopAddress = '284 Market St',
  orderNumber = '#8821',
  deliveryType = 'standard', // 'standard', 'express', 'signature'
  isVisible = true
}) => {
  if (!isVisible) return null;

  const getDeliveryTypeIcon = () => {
    switch (deliveryType) {
      case 'express':
        return <MaterialIcons name="bolt" size={16} color="#1152d4" />;
      case 'signature':
        return <MaterialIcons name="edit" size={16} color="#94a3b8" />;
      case 'priority':
        return <MaterialIcons name="priority-high" size={16} color="#f59e0b" />;
      default:
        return null;
    }
  };

  const getDeliveryTypeColor = () => {
    switch (deliveryType) {
      case 'express':
        return '#dbeafe';
      case 'signature':
        return '#f8fafc';
      case 'priority':
        return '#fffbeb';
      default:
        return '#f1f5f9';
    }
  };

  const getDeliveryTypeTextColor = () => {
    switch (deliveryType) {
      case 'express':
        return '#1d4ed8';
      case 'signature':
        return '#94a3b8';
      case 'priority':
        return '#f59e0b';
      default:
        return '#64748B';
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.content, { backgroundColor: getDeliveryTypeColor() }]}>
        <View style={styles.header}>
          <Text style={styles.title}>NEXT STOP</Text>
          <View style={styles.stopBadge}>
            <Text style={styles.stopNumber}>{currentStop}</Text>
          </View>
        </View>
        
        <View style={styles.addressContainer}>
          <Text style={styles.address}>{nextStopAddress}</Text>
          {getDeliveryTypeIcon()}
        </View>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <MaterialIcons name="schedule" size={14} color="#64748B" />
            <Text style={styles.detailText}>ETA {nextStopETA}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <MaterialIcons name="confirmation-number" size={14} color="#64748B" />
            <Text style={styles.detailText}>{orderNumber}</Text>
          </View>
        </View>
        
        {deliveryType !== 'standard' && (
          <View style={styles.deliveryTypeContainer}>
            <Text style={[styles.deliveryTypeText, { color: getDeliveryTypeTextColor() }]}>
              {deliveryType.toUpperCase()} DELIVERY
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    zIndex: 90,
  },
  content: {
    backgroundColor: '#f1f5f9',
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  stopBadge: {
    width: 28,
    height: 28,
    backgroundColor: '#1152d4',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  address: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111318',
    flex: 1,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  detailText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  deliveryTypeContainer: {
    alignItems: 'flex-start',
  },
  deliveryTypeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});

export default ETAOverlay;