import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOW } from '../styles/DesignSystem';

const OrderConfirmationScreen = () => {
  const [order, setOrder] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId } = route.params || {};

  // Mock order data - in a real app, this would come from the created order
  useEffect(() => {
    if (orderId) {
      // Simulate order data
      const mockOrder = {
        id: orderId,
        date: new Date().toLocaleDateString(),
        status: 'Pending Slot Selection',
        customerName: 'John Doe',
        customerPhone: '9876543210',
        deliveryAddress: '123 Main Street, Bangalore, Karnataka 560001',
        orderValue: '₹2,499',
        orderDescription: 'Electronics package',
        estimatedDelivery: '3-5 business days'
      };
      setOrder(mockOrder);
    }
  }, [orderId]);

  const handleSelectSlot = () => {
    navigation.navigate('SlotSelection', { orderId: order.id });
  };

  const handleViewOrders = () => {
    navigation.navigate('Orders');
  };

  const handleCreateAnother = () => {
    navigation.navigate('OrderCreation');
  };

  if (!order) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Icon name="hourglass-outline" size={40} color={COLORS.textSecondary} />
          <Text style={styles.loadingText}>Loading order details...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon name="checkmark-circle-outline" size={60} color={COLORS.textInverted} />
        <Text style={styles.title}>Order Confirmed!</Text>
        <Text style={styles.subtitle}>Your order has been successfully created</Text>
      </View>

      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>Order ID: {order.id}</Text>
          <Text style={[styles.status, styles.pendingStatus]}>{order.status}</Text>
        </View>
        
        <View style={styles.orderDetails}>
          <View style={styles.detailItem}>
            <Icon name="calendar-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.orderDate}>Date: {order.date}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="cash-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.orderValue}>Total: {order.orderValue}</Text>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.infoSection}>
          <View style={styles.sectionHeader}>
            <Icon name="person-outline" size={18} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Customer Information</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="person-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>Name: {order.customerName}</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="call-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>Phone: {order.customerPhone}</Text>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.infoSection}>
          <View style={styles.sectionHeader}>
            <Icon name="location-outline" size={18} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Delivery Information</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="home-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>Address: {order.deliveryAddress}</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="time-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>Estimated Delivery: {order.estimatedDelivery}</Text>
          </View>
        </View>
      </View>

      <View style={styles.nextSteps}>
        <View style={styles.sectionHeader}>
          <Icon name="list-outline" size={18} color={COLORS.primary} />
          <Text style={styles.nextStepsTitle}>Next Steps</Text>
        </View>
        <View style={styles.step}>
          <View style={styles.stepIcon}>
            <Text style={styles.stepNumber}>1</Text>
          </View>
          <Text style={styles.stepText}>Select a delivery slot for your order</Text>
        </View>
        <View style={styles.step}>
          <View style={styles.stepIcon}>
            <Text style={styles.stepNumber}>2</Text>
          </View>
          <Text style={styles.stepText}>Driver will be assigned based on your slot</Text>
        </View>
        <View style={styles.step}>
          <View style={styles.stepIcon}>
            <Text style={styles.stepNumber}>3</Text>
          </View>
          <Text style={styles.stepText}>Track your order in real-time</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleSelectSlot}>
          <Icon name="time-outline" size={20} color={COLORS.textInverted} />
          <Text style={styles.buttonText}>Select Delivery Slot</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton} onPress={handleViewOrders}>
          <Icon name="list-outline" size={20} color={COLORS.primary} />
          <Text style={styles.secondaryButtonText}>View All Orders</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tertiaryButton} onPress={handleCreateAnother}>
          <Icon name="add-outline" size={20} color={COLORS.textSecondary} />
          <Text style={styles.tertiaryButtonText}>Create Another Order</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.l,
  },
  loadingText: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginTop: SPACING.m,
  },
  header: {
    backgroundColor: COLORS.secondary,
    padding: SPACING.l,
    alignItems: 'center',
  },
  title: {
    fontSize: TYPOGRAPHY.h1,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textInverted,
    marginTop: SPACING.m,
    marginBottom: SPACING.s,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textInverted,
    textAlign: 'center',
  },
  orderCard: {
    backgroundColor: COLORS.cardBackground,
    margin: SPACING.m,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.m,
    ...SHADOW,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  orderId: {
    fontSize: TYPOGRAPHY.h3,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
  },
  status: {
    fontSize: TYPOGRAPHY.caption,
    fontWeight: TYPOGRAPHY.semiBold,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.small,
  },
  pendingStatus: {
    backgroundColor: COLORS.primaryLight,
    color: COLORS.primary,
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.m,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderDate: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginLeft: SPACING.s,
  },
  orderValue: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.primary,
    marginLeft: SPACING.s,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.grayLight,
    marginVertical: SPACING.m,
  },
  infoSection: {
    marginBottom: SPACING.m,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.h3,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
    marginLeft: SPACING.s,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  infoText: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginLeft: SPACING.m,
    flex: 1,
  },
  nextSteps: {
    backgroundColor: COLORS.cardBackground,
    margin: SPACING.m,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.m,
    ...SHADOW,
  },
  nextStepsTitle: {
    fontSize: TYPOGRAPHY.h3,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
    marginLeft: SPACING.s,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  stepIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  stepNumber: {
    color: COLORS.textInverted,
    fontWeight: TYPOGRAPHY.bold,
  },
  stepText: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textPrimary,
    flex: 1,
  },
  actions: {
    padding: SPACING.m,
  },
  primaryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.m,
    borderRadius: BORDER_RADIUS.medium,
    marginBottom: SPACING.s,
  },
  buttonText: {
    color: COLORS.textInverted,
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.semiBold,
    marginLeft: SPACING.s,
  },
  secondaryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    paddingVertical: SPACING.m,
    borderRadius: BORDER_RADIUS.medium,
    marginBottom: SPACING.s,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.semiBold,
    marginLeft: SPACING.s,
  },
  tertiaryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.grayLight,
    paddingVertical: SPACING.m,
    borderRadius: BORDER_RADIUS.medium,
  },
  tertiaryButtonText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.semiBold,
    marginLeft: SPACING.s,
  },
});

export default OrderConfirmationScreen;