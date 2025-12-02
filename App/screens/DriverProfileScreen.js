import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOW } from '../styles/DesignSystem';
import Icon from 'react-native-vector-icons/Ionicons';

const DriverProfileScreen = () => {
  const navigation = useNavigation();
  const [driverInfo, setDriverInfo] = useState({
    name: 'John Driver',
    phone: '9876543215',
    email: 'john.driver@example.com',
    licenseNumber: 'DL1234567890',
    vehicleNumber: 'DL 01 AB 1234',
    vehicleType: 'Bike',
  });
  
  const [availability, setAvailability] = useState({
    status: 'Available',
    startTime: '09:00',
    endTime: '18:00',
  });
  
  const [notifications, setNotifications] = useState({
    pushEnabled: true,
    emailEnabled: false,
    smsEnabled: true,
  });
  
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

  const renderStatCard = (title, value, icon, color) => (
    <View style={styles.statCard}>
      <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
        <Icon name={icon} size={20} color={color} />
      </View>
      <View style={styles.statInfo}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Driver Profile</Text>
        </View>
        
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{driverInfo.name.charAt(0)}</Text>
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <Icon name="camera-outline" size={16} color={COLORS.textInverted} />
            </TouchableOpacity>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{driverInfo.name}</Text>
            <Text style={styles.profileVehicle}>{driverInfo.vehicleType} • {driverInfo.vehicleNumber}</Text>
            <View style={styles.statusContainer}>
              <View style={[styles.statusIndicator, availability.status === 'Available' ? styles.availableIndicator : styles.unavailableIndicator]} />
              <Text style={styles.statusText}>{availability.status}</Text>
            </View>
          </View>
        </View>
        
        {/* Performance Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance</Text>
          <View style={styles.statsContainer}>
            {renderStatCard('Deliveries', performanceAnalytics.totalDeliveries, 'cube-outline', COLORS.primary)}
            {renderStatCard('On-Time %', `${performanceAnalytics.onTimeRate}%`, 'time-outline', COLORS.success)}
            {renderStatCard('Rating', performanceAnalytics.avgRating, 'star-outline', COLORS.warning)}
          </View>
        </View>
        
        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={driverInfo.name}
              onChangeText={(text) => setDriverInfo({...driverInfo, name: text})}
              placeholder="Enter your full name"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={driverInfo.phone}
              onChangeText={(text) => setDriverInfo({...driverInfo, phone: text})}
              keyboardType="phone-pad"
              placeholder="Enter phone number"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={driverInfo.email}
              onChangeText={(text) => setDriverInfo({...driverInfo, email: text})}
              keyboardType="email-address"
              placeholder="Enter email address"
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
              placeholder="Enter vehicle number"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Vehicle Type</Text>
            <TextInput
              style={styles.input}
              value={driverInfo.vehicleType}
              onChangeText={(text) => setDriverInfo({...driverInfo, vehicleType: text})}
              placeholder="Enter vehicle type"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>License Number</Text>
            <TextInput
              style={styles.input}
              value={driverInfo.licenseNumber}
              onChangeText={(text) => setDriverInfo({...driverInfo, licenseNumber: text})}
              placeholder="Enter license number"
            />
          </View>
        </View>
        
        {/* Availability Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Availability</Text>
          <View style={styles.availabilityRow}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.statusToggle}>
              <Text style={styles.statusText}>{availability.status}</Text>
              <Switch
                trackColor={{ false: COLORS.grayLight, true: COLORS.primaryLight }}
                thumbColor={availability.status === 'Available' ? COLORS.primary : COLORS.textLight}
                onValueChange={(value) => setAvailability({...availability, status: value ? 'Available' : 'Unavailable'})}
                value={availability.status === 'Available'}
              />
            </View>
          </View>
          
          <View style={styles.availabilityRow}>
            <View style={styles.timeInputContainer}>
              <Text style={styles.label}>Start Time</Text>
              <TextInput
                style={styles.timeInput}
                value={availability.startTime}
                onChangeText={(text) => setAvailability({...availability, startTime: text})}
                placeholder="HH:MM"
              />
            </View>
            
            <View style={styles.timeInputContainer}>
              <Text style={styles.label}>End Time</Text>
              <TextInput
                style={styles.timeInput}
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
        
        {/* Notification Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Preferences</Text>
          <View style={styles.notificationOption}>
            <Text style={styles.notificationLabel}>Push Notifications</Text>
            <Switch
              trackColor={{ false: COLORS.grayLight, true: COLORS.primaryLight }}
              thumbColor={notifications.pushEnabled ? COLORS.primary : COLORS.textLight}
              onValueChange={(value) => setNotifications({...notifications, pushEnabled: value})}
              value={notifications.pushEnabled}
            />
          </View>
          
          <View style={styles.notificationOption}>
            <Text style={styles.notificationLabel}>Email Notifications</Text>
            <Switch
              trackColor={{ false: COLORS.grayLight, true: COLORS.primaryLight }}
              thumbColor={notifications.emailEnabled ? COLORS.primary : COLORS.textLight}
              onValueChange={(value) => setNotifications({...notifications, emailEnabled: value})}
              value={notifications.emailEnabled}
            />
          </View>
          
          <View style={styles.notificationOption}>
            <Text style={styles.notificationLabel}>SMS Notifications</Text>
            <Switch
              trackColor={{ false: COLORS.grayLight, true: COLORS.primaryLight }}
              thumbColor={notifications.smsEnabled ? COLORS.primary : COLORS.textLight}
              onValueChange={(value) => setNotifications({...notifications, smsEnabled: value})}
              value={notifications.smsEnabled}
            />
          </View>
        </View>
        
        {/* Actions */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.actionButton} onPress={handleSaveProfile}>
            <Icon name="save-outline" size={16} color={COLORS.primary} />
            <Text style={styles.actionButtonText}>Save Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
            <Icon name="help-circle-outline" size={16} color={COLORS.info} />
            <Text style={styles.actionButtonText}>Help & Support</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={handleLogout}>
            <Icon name="log-out-outline" size={16} color={COLORS.error} />
            <Text style={[styles.actionButtonText, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.s,
    backgroundColor: COLORS.cardBackground,
    ...SHADOW,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
  },
  profileHeader: {
    flexDirection: 'row',
    padding: SPACING.s,
    backgroundColor: COLORS.cardBackground,
    margin: SPACING.s,
    borderRadius: BORDER_RADIUS.small,
    ...SHADOW,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.textInverted,
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.bold,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: SPACING.s,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  profileVehicle: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.xs,
  },
  availableIndicator: {
    backgroundColor: COLORS.success,
  },
  unavailableIndicator: {
    backgroundColor: COLORS.error,
  },
  statusText: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  section: {
    margin: SPACING.s,
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.small,
    padding: SPACING.s,
    ...SHADOW,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.s,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.small,
    padding: SPACING.xs,
    marginHorizontal: SPACING.xs,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.xs,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
  },
  statTitle: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  inputGroup: {
    marginBottom: SPACING.s,
  },
  label: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    fontWeight: TYPOGRAPHY.medium,
  },
  input: {
    height: 40,
    backgroundColor: COLORS.grayLight,
    borderRadius: BORDER_RADIUS.small,
    paddingHorizontal: SPACING.s,
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textPrimary,
  },
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  statusToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInputContainer: {
    flex: 1,
    marginRight: SPACING.xs,
  },
  timeInput: {
    height: 40,
    backgroundColor: COLORS.grayLight,
    borderRadius: BORDER_RADIUS.small,
    paddingHorizontal: SPACING.s,
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textPrimary,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.s,
    borderRadius: BORDER_RADIUS.small,
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  saveButtonText: {
    color: COLORS.textInverted,
    fontSize: TYPOGRAPHY.caption,
    fontWeight: TYPOGRAPHY.semiBold,
  },
  notificationOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  notificationLabel: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textPrimary,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.s,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.small,
    marginBottom: SPACING.xs,
  },
  actionButtonText: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.semiBold,
    marginLeft: SPACING.s,
  },
  logoutButton: {
    backgroundColor: COLORS.errorLight,
  },
  logoutText: {
    color: COLORS.error,
  },
});

export default DriverProfileScreen;