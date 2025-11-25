import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    phone: '9876543210',
    email: 'john.doe@example.com',
    address: '123 Main Street, Bangalore, Karnataka 560001',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
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

  const handleAddressBook = () => {
    Alert.alert('Address Book', 'Address book functionality to be implemented');
  };

  const handleOrderHistory = () => {
    Alert.alert('Order History', 'Order history functionality to be implemented');
  };

  const handleNotifications = () => {
    Alert.alert('Notifications', 'Notification settings functionality to be implemented');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Profile</Text>
      
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{profile.name.charAt(0)}</Text>
          </View>
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
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Address"
              value={editedProfile.address}
              onChangeText={(value) => handleInputChange('address', value)}
              multiline
              numberOfLines={3}
            />
            
            <View style={styles.buttonContainer}>
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
            
            <View style={styles.infoRow}>
              <Text style={styles.label}>Address:</Text>
              <Text style={styles.value}>{profile.address}</Text>
            </View>
            
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem} onPress={handleAddressBook}>
          <Text style={styles.menuItemText}>Address Book</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={handleOrderHistory}>
          <Text style={styles.menuItemText}>Order History</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
        
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
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  profileSection: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  profileInfo: {
    marginTop: 20,
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
  editButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editForm: {
    marginTop: 20,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
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
  menuSection: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 8,
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