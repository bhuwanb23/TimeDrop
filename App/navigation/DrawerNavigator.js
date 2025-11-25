import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import CustomerApp from '../App'; // This will need to be adjusted

const Drawer = createDrawerNavigator();

// Custom Drawer Content Component
function CustomDrawerContent({ navigation }) {
  return (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>Delivery App</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.drawerItem} 
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.drawerItemText}>Home</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.drawerItem} 
        onPress={() => navigation.navigate('Orders')}
      >
        <Text style={styles.drawerItemText}>My Orders</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.drawerItem} 
        onPress={() => navigation.navigate('Profile')}
      >
        <Text style={styles.drawerItemText}>Profile</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.drawerItem} 
        onPress={() => navigation.navigate('Notifications')}
      >
        <Text style={styles.drawerItemText}>Notifications</Text>
      </TouchableOpacity>
      
      <View style={styles.drawerSeparator} />
      
      <TouchableOpacity 
        style={styles.drawerItem} 
        onPress={() => navigation.navigate('Settings')}
      >
        <Text style={styles.drawerItemText}>Settings</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.drawerItem} 
        onPress={() => navigation.navigate('Help')}
      >
        <Text style={styles.drawerItemText}>Help & Support</Text>
      </TouchableOpacity>
    </View>
  );
}

// Main Drawer Navigator Component
function DrawerNavigator() {
  return (
    <Drawer.Navigator 
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        drawerStyle: {
          backgroundColor: '#f5f5f5',
          width: 240,
        },
        drawerActiveBackgroundColor: '#007AFF',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#333',
      }}
    >
      {/* We'll need to restructure how screens are organized */}
      <Drawer.Screen 
        name="Main" 
        component={CustomerApp} // This is a placeholder
        options={{ 
          drawerLabel: 'Home',
          title: 'Delivery App'
        }} 
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  drawerHeader: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 50,
  },
  drawerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  drawerItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  drawerItemText: {
    fontSize: 16,
    color: '#333',
  },
  drawerSeparator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
});

export default DrawerNavigator;