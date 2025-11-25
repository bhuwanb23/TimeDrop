import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const SlotSelectionScreen = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId } = route.params || {};

  // Mock available slots - in a real app, this would come from an API
  useEffect(() => {
    // Simulate API call to get available slots
    const mockSlots = [
      { id: 1, date: 'Today', time: '2:00 PM - 4:00 PM', available: true },
      { id: 2, date: 'Today', time: '4:00 PM - 6:00 PM', available: true },
      { id: 3, date: 'Tomorrow', time: '10:00 AM - 12:00 PM', available: true },
      { id: 4, date: 'Tomorrow', time: '12:00 PM - 2:00 PM', available: true },
      { id: 5, date: 'Tomorrow', time: '2:00 PM - 4:00 PM', available: false },
      { id: 6, date: 'Tomorrow', time: '4:00 PM - 6:00 PM', available: true },
    ];
    setAvailableSlots(mockSlots);
  }, []);

  const handleSelectSlot = (slot) => {
    if (!slot.available) {
      Alert.alert('Slot Unavailable', 'This slot is no longer available. Please select another slot.');
      return;
    }
    setSelectedSlot(slot);
  };

  const handleConfirmSlot = () => {
    if (!selectedSlot) {
      Alert.alert('No Slot Selected', 'Please select a delivery slot before confirming.');
      return;
    }

    // Here we would normally make an API call to confirm the slot
    // For now, we'll just show a success message and navigate back
    Alert.alert(
      'Slot Confirmed',
      `Your delivery slot has been confirmed for ${selectedSlot.date}, ${selectedSlot.time}`,
      [
        { text: 'OK', onPress: () => navigation.navigate('CustomerHome') }
      ]
    );
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const groupSlotsByDate = (slots) => {
    return slots.reduce((groups, slot) => {
      const date = slot.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(slot);
      return groups;
    }, {});
  };

  const groupedSlots = groupSlotsByDate(availableSlots);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Select Delivery Slot</Text>
      {orderId && <Text style={styles.orderId}>Order: {orderId}</Text>}
      
      <View style={styles.instructions}>
        <Text style={styles.instructionsText}>
          Please select a convenient delivery slot for your order. 
          You can change this slot anytime before the driver is assigned.
        </Text>
      </View>
      
      {Object.keys(groupedSlots).map(date => (
        <View key={date} style={styles.dateSection}>
          <Text style={styles.dateHeader}>{date}</Text>
          {groupedSlots[date].map(slot => (
            <TouchableOpacity
              key={slot.id}
              style={[
                styles.slotButton,
                selectedSlot?.id === slot.id ? styles.selectedSlot : null,
                !slot.available ? styles.unavailableSlot : null
              ]}
              onPress={() => handleSelectSlot(slot)}
              disabled={!slot.available}
            >
              <Text style={[
                styles.slotText,
                selectedSlot?.id === slot.id ? styles.selectedSlotText : null,
                !slot.available ? styles.unavailableSlotText : null
              ]}>
                {slot.time}
              </Text>
              {!slot.available && (
                <Text style={styles.unavailableText}>Unavailable</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      ))}
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.confirmButton, !selectedSlot ? styles.disabledButton : null]} 
          onPress={handleConfirmSlot}
          disabled={!selectedSlot}
        >
          <Text style={styles.buttonText}>Confirm Slot</Text>
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
  orderId: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  instructions: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    margin: 20,
    borderRadius: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#1976d2',
    textAlign: 'center',
  },
  dateSection: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  slotButton: {
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  selectedSlot: {
    backgroundColor: '#007AFF',
    borderColor: '#0056b3',
  },
  unavailableSlot: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ddd',
  },
  slotText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  selectedSlotText: {
    color: '#fff',
  },
  unavailableSlotText: {
    color: '#999',
  },
  unavailableText: {
    fontSize: 12,
    color: '#ff3b30',
    textAlign: 'center',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
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
  confirmButton: {
    backgroundColor: '#34C759',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SlotSelectionScreen;