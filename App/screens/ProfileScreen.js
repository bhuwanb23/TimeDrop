import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    phone: '9876543210',
    email: 'john.doe@example.com',
  });
  
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'Home',
      address: '123 Main Street, Bangalore, Karnataka 560001',
      isDefault: true
    },
    {
      id: 2,
      type: 'Office',
      address: '456 Business Park, Bangalore, Karnataka 560002',
      isDefault: false
    }
  ]);
  
  const [orderHistory, setOrderHistory] = useState([
    { id: 'ORD-001', date: '2023-06-15', status: 'Delivered', amount: '₹2,499' },
    { id: 'ORD-002', date: '2023-06-10', status: 'Delivered', amount: '₹1,299' },
    { id: 'ORD-003', date: '2023-06-05', status: 'Processing', amount: '₹3,999' },
    { id: 'ORD-004', date: '2023-05-28', status: 'Delivered', amount: '₹899' },
  ]);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [newAddress, setNewAddress] = useState({ type: '', address: '' });
  const [showAddAddress, setShowAddAddress] = useState(false);
  const navigation = useNavigation();

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(profile);
  };

  const handleSave = () => {
    // Validation
    if (!editedProfile.name || !editedProfile.phone) {
      Alert.alert('Error', 'Name and phone number are required');
      return;
    }

    if (editedProfile.phone.length !== 10 || !/^\d+$/.test(editedProfile.phone)) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    if (editedProfile.email && !/^\S+@\S+\.\S+$/.test(editedProfile.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Here we would normally make an API call to update the profile
    // For now, we'll just update the local state
    setProfile(editedProfile);
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
  };

  const handleInputChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddAddress = () => {
    if (!newAddress.type || !newAddress.address) {
      Alert.alert('Error', 'Please fill in all address fields');
      return;
    }

    const address = {
      id: addresses.length + 1,
      type: newAddress.type,
      address: newAddress.address,
      isDefault: false
    };

    setAddresses(prev => [...prev, address]);
    setNewAddress({ type: '', address: '' });
    setShowAddAddress(false);
    Alert.alert('Success', 'Address added successfully!');
  };

  const handleSetDefaultAddress = (id) => {
    setAddresses(prev => 
      prev.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      }))
    );
    Alert.alert('Success', 'Default address updated!');
  };

  const handleDeleteAddress = (id) => {
    const address = addresses.find(addr => addr.id === id);
    if (address.isDefault) {
      Alert.alert('Error', 'Cannot delete default address. Please set another address as default first.');
      return;
    }
    
    setAddresses(prev => prev.filter(addr => addr.id !== id));
    Alert.alert('Success', 'Address deleted successfully!');
  };

  const handleViewOrder = (orderId) => {
    navigation.navigate('OrderTracking', { orderId });
  };

  const handleNotifications = () => {
    Alert.alert('Notifications', 'Notification settings functionality to be implemented');
  };

  const renderAddress = ({ item }) => (
    <View style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <Text style={styles.addressType}>{item.type}</Text>
        {item.isDefault && (
          <Text style={styles.defaultBadge}>Default</Text>
        )}
      </View>
      <Text style={styles.addressText}>{item.address}</Text>
      <View style={styles.addressActions}>
        {!item.isDefault && (
          <TouchableOpacity 
            style={styles.smallButton} 
            onPress={() => handleSetDefaultAddress(item.id)}
          >
            <Text style={styles.smallButtonText}>Set Default</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={[styles.smallButton, styles.deleteButton]} 
          onPress={() => handleDeleteAddress(item.id)}
        >
          <Text style={styles.smallButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderOrder = ({ item }) => (
    <TouchableOpacity 
      style={styles.orderCard} 
      onPress={() => handleViewOrder(item.id)}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>{item.id}</Text>
        <Text style={[styles.status, getStatusStyle(item.status)]}>{item.status}</Text>
      </View>
      <View style={styles.orderDetails}>
        <Text style={styles.orderDate}>{item.date}</Text>
        <Text style={styles.orderAmount}>{item.amount}</Text>
      </View>
    </TouchableOpacity>
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Slot Selected':
        return styles.slotSelectedStatus;
      case 'Processing':
        return styles.processingStatus;
      case 'Out for Delivery':
        return styles.outForDeliveryStatus;
      case 'Delivered':
        return styles.deliveredStatus;
      default:
        return styles.defaultStatus;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{profile.name.charAt(0)}</Text>
          </View>
        </View>
        <Text style={styles.userName}>{profile.name}</Text>
        <Text style={styles.userPhone}>{profile.phone}</Text>
      </View>
      
      {/* Profile Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          {!isEditing && (
            <TouchableOpacity onPress={handleEdit}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {isEditing ? (
          <View style={styles.editForm}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={editedProfile.name}
              onChangeText={(value) => handleInputChange('name', value)}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={editedProfile.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              keyboardType="phone-pad"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={editedProfile.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
            />
            
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.profileInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{profile.name}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.label}>Phone:</Text>
              <Text style={styles.value}>{profile.phone}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{profile.email || 'Not provided'}</Text>
            </View>
          </View>
        )}
      </View>
      
      {/* Address Book */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Address Book</Text>
          <TouchableOpacity onPress={() => setShowAddAddress(!showAddAddress)}>
            <Text style={styles.editText}>{showAddAddress ? 'Cancel' : 'Add'}</Text>
          </TouchableOpacity>
        </View>
        
        {showAddAddress && (
          <View style={styles.addAddressForm}>
            <TextInput
              style={styles.input}
              placeholder="Address Type (e.g., Home, Office)"
              value={newAddress.type}
              onChangeText={(value) => setNewAddress(prev => ({ ...prev, type: value }))}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Full Address"
              value={newAddress.address}
              onChangeText={(value) => setNewAddress(prev => ({ ...prev, address: value }))}
              multiline
              numberOfLines={3}
            />
            
            <TouchableOpacity style={[styles.button, styles.addButton]} onPress={handleAddAddress}>
              <Text style={styles.buttonText}>Add Address</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <FlatList
          data={addresses}
          renderItem={renderAddress}
          keyExtractor={(item) => item.id.toString()}
          style={styles.addressList}
        />
      </View>
      
      {/* Order History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order History</Text>
        <FlatList
          data={orderHistory}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          style={styles.orderList}
        />
      </View>
      
      {/* Settings */}
      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem} onPress={handleNotifications}>
          <Text style={styles.menuItemText}>Notification Settings</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Logout', 'Are you sure you want to logout?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Logout', onPress: () => navigation.navigate('Login') }
        ])}>
          <Text style={styles.menuItemText}>Logout</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#007AFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userPhone: {
    color: '#e0e0e0',
    fontSize: 16,
    marginTop: 5,
  },
  section: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  editText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileInfo: {
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  label: {
    flex: 0.3,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    flex: 0.7,
    fontSize: 16,
    color: '#666',
  },
  editForm: {
    marginTop: 10,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 0.48,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  saveButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addAddressForm: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: '#007AFF',
  },
  addressList: {
    marginTop: 10,
  },
  addressCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addressType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  defaultBadge: {
    backgroundColor: '#34C759',
    color: '#fff',
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  smallButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  smallButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderList: {
    marginTop: 10,
  },
  orderCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  slotSelectedStatus: {
    backgroundColor: '#FFEAA7',
    color: '#D35400',
  },
  processingStatus: {
    backgroundColor: '#74B9FF',
    color: '#0984E3',
  },
  outForDeliveryStatus: {
    backgroundColor: '#00B894',
    color: '#00A085',
  },
  deliveredStatus: {
    backgroundColor: '#00B894',
    color: '#00A085',
  },
  defaultStatus: {
    backgroundColor: '#DDDDDD',
    color: '#666666',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  menuSection: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  arrow: {
    fontSize: 20,
    color: '#999',
  },
});

export default ProfileScreen;