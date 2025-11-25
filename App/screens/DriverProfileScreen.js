import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOW } from '../styles/DesignSystem';

const DriverProfileScreen = () => {
  const [driverInfo, setDriverInfo] = useState({
    name: 'Raj Kumar',
    phone: '9876543211',
    email: 'raj.kumar@example.com',
    licenseNumber: 'DL1234567890',
    vehicleNumber: 'KA-01-AB-1234',
    vehicleType: 'Bike',
  });
  
  const [availability, setAvailability] = useState({
    status: 'Available',
    startTime: '09:00',
    endTime: '18:00',
  });
  
  const [earningsHistory, setEarningsHistory] = useState([
    { date: '2023-06-15', amount: 1200, orders: 8 },
    { date: '2023-06-14', amount: 950, orders: 6 },
    { date: '2023-06-13', amount: 1100, orders: 7 },
    { date: '2023-06-12', amount: 800, orders: 5 },
  ]);
  
  const [performanceAnalytics, setPerformanceAnalytics] = useState({
    totalDeliveries: 150,
    onTimeRate: 92,
    avgRating: 4.7,
    cancellationRate: 2,
  });

  const handleSaveProfile = () => {
    Alert.alert('Success', 'Profile information saved successfully!');
  };

  const handleUpdateAvailability = () => {
    Alert.alert('Success', 'Availability settings updated successfully!');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => {
            // In a real app, this would clear the auth token and navigate to login
            Alert.alert('Logged Out', 'You have been successfully logged out.');
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Driver Profile</Text>
      </View>
      
      {/* Driver Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Driver Information</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={driverInfo.name}
            onChangeText={(text) => setDriverInfo({...driverInfo, name: text})}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={driverInfo.phone}
            onChangeText={(text) => setDriverInfo({...driverInfo, phone: text})}
            keyboardType="phone-pad"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={driverInfo.email}
            onChangeText={(text) => setDriverInfo({...driverInfo, email: text})}
            keyboardType="email-address"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>License Number</Text>
          <TextInput
            style={styles.input}
            value={driverInfo.licenseNumber}
            onChangeText={(text) => setDriverInfo({...driverInfo, licenseNumber: text})}
          />
        </View>
      </View>
      
      {/* Vehicle Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vehicle Details</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Vehicle Number</Text>
          <TextInput
            style={styles.input}
            value={driverInfo.vehicleNumber}
            onChangeText={(text) => setDriverInfo({...driverInfo, vehicleNumber: text})}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Vehicle Type</Text>
          <TextInput
            style={styles.input}
            value={driverInfo.vehicleType}
            onChangeText={(text) => setDriverInfo({...driverInfo, vehicleType: text})}
          />
        </View>
      </View>
      
      {/* Availability Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Availability Settings</Text>
        <View style={styles.availabilityRow}>
          <View style={styles.availabilityItem}>
            <Text style={styles.label}>Status</Text>
            <TouchableOpacity 
              style={[styles.statusButton, availability.status === 'Available' ? styles.availableButton : styles.unavailableButton]}
              onPress={() => setAvailability({...availability, status: availability.status === 'Available' ? 'Unavailable' : 'Available'})}
            >
              <Text style={styles.statusButtonText}>{availability.status}</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.availabilityRow}>
          <View style={styles.availabilityItem}>
            <Text style={styles.label}>Start Time</Text>
            <TextInput
              style={styles.input}
              value={availability.startTime}
              onChangeText={(text) => setAvailability({...availability, startTime: text})}
              placeholder="HH:MM"
            />
          </View>
          
          <View style={styles.availabilityItem}>
            <Text style={styles.label}>End Time</Text>
            <TextInput
              style={styles.input}
              value={availability.endTime}
              onChangeText={(text) => setAvailability({...availability, endTime: text})}
              placeholder="HH:MM"
            />
          </View>
        </View>
        
        <TouchableOpacity style={styles.saveButton} onPress={handleUpdateAvailability}>
          <Text style={styles.saveButtonText}>Update Availability</Text>
        </TouchableOpacity>
      </View>
      
      {/* Earnings History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Earnings History</Text>
        {earningsHistory.map((entry, index) => (
          <View key={index} style={styles.earningsRow}>
            <View style={styles.earningsInfo}>
              <Text style={styles.earningsDate}>{entry.date}</Text>
              <Text style={styles.earningsOrders}>{entry.orders} orders</Text>
            </View>
            <Text style={styles.earningsAmount}>₹{entry.amount}</Text>
          </View>
        ))}
      </View>
      
      {/* Performance Analytics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance Analytics</Text>
        <View style={styles.analyticsGrid}>
          <View style={styles.analyticsBox}>
            <Text style={styles.analyticsValue}>{performanceAnalytics.totalDeliveries}</Text>
            <Text style={styles.analyticsLabel}>Total Deliveries</Text>
          </View>
          
          <View style={styles.analyticsBox}>
            <Text style={styles.analyticsValue}>{performanceAnalytics.onTimeRate}%</Text>
            <Text style={styles.analyticsLabel}>On-Time Rate</Text>
          </View>
          
          <View style={styles.analyticsBox}>
            <Text style={styles.analyticsValue}>{performanceAnalytics.avgRating}</Text>
            <Text style={styles.analyticsLabel}>Avg Rating</Text>
          </View>
          
          <View style={styles.analyticsBox}>
            <Text style={styles.analyticsValue}>{performanceAnalytics.cancellationRate}%</Text>
            <Text style={styles.analyticsLabel}>Cancellation Rate</Text>
          </View>
        </View>
      </View>
      
      {/* Save Profile Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
        <Text style={styles.saveButtonText}>Save Profile</Text>
      </TouchableOpacity>
      
      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.m,
    paddingTop: 50,
  },
  headerTitle: {
    color: COLORS.textInverted,
    fontSize: TYPOGRAPHY.h2,
    fontWeight: TYPOGRAPHY.bold,
  },
  section: {
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.m,
    marginBottom: SPACING.s,
    borderRadius: BORDER_RADIUS.medium,
    ...SHADOW,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.h3,
    fontWeight: TYPOGRAPHY.bold,
    marginBottom: SPACING.m,
    color: COLORS.textPrimary,
  },
  inputGroup: {
    marginBottom: SPACING.m,
  },
  label: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.bold,
    marginBottom: SPACING.s,
    color: COLORS.textPrimary,
  },
  input: {
    height: 50,
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.small,
    paddingHorizontal: SPACING.m,
    backgroundColor: COLORS.grayLight,
    fontSize: TYPOGRAPHY.body,
  },
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.m,
  },
  availabilityItem: {
    flex: 1,
    marginRight: SPACING.s,
  },
  statusButton: {
    padding: SPACING.m,
    borderRadius: BORDER_RADIUS.small,
    alignItems: 'center',
  },
  availableButton: {
    backgroundColor: COLORS.secondary,
  },
  unavailableButton: {
    backgroundColor: COLORS.error,
  },
  statusButtonText: {
    color: COLORS.textInverted,
    fontWeight: TYPOGRAPHY.bold,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.m,
    borderRadius: BORDER_RADIUS.small,
    alignItems: 'center',
    marginTop: SPACING.s,
    marginHorizontal: SPACING.m,
  },
  saveButtonText: {
    color: COLORS.textInverted,
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.bold,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    padding: SPACING.m,
    borderRadius: BORDER_RADIUS.small,
    alignItems: 'center',
    margin: SPACING.m,
  },
  logoutButtonText: {
    color: COLORS.textInverted,
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.bold,
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.s,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  earningsInfo: {
    flex: 1,
  },
  earningsDate: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
  },
  earningsOrders: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  earningsAmount: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.secondary,
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  analyticsBox: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.small,
    padding: SPACING.m,
    alignItems: 'center',
    width: '48%',
    marginBottom: SPACING.s,
  },
  analyticsValue: {
    fontSize: TYPOGRAPHY.h3,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.primary,
  },
  analyticsLabel: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: SPACING.s,
    textAlign: 'center',
  },
});

export default DriverProfileScreen;