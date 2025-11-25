import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

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
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
  },
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  availabilityItem: {
    flex: 1,
    marginRight: 10,
  },
  statusButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  availableButton: {
    backgroundColor: '#00B894',
  },
  unavailableButton: {
    backgroundColor: '#E17055',
  },
  statusButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#E17055',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    margin: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  earningsInfo: {
    flex: 1,
  },
  earningsDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  earningsOrders: {
    fontSize: 14,
    color: '#666',
  },
  earningsAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00B894',
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  analyticsBox: {
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
  },
  analyticsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  analyticsLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
});

export default DriverProfileScreen;