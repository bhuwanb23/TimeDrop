import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const SlotSelectionScreen = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dates, setDates] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId } = route.params || {};

  // Generate dates for the next 7 days
  useEffect(() => {
    const generateDates = () => {
      const datesArray = [];
      const today = new Date();
      
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);
        datesArray.push({
          date: date,
          dateString: date.toISOString().split('T')[0],
          display: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
        });
      }
      
      setDates(datesArray);
      setSelectedDate(datesArray[0]);
    };
    
    generateDates();
  }, []);

  // Mock available slots - in a real app, this would come from an API
  useEffect(() => {
    if (selectedDate) {
      // Simulate API call to get available slots for selected date
      const mockSlots = [
        { id: 1, time: '9:00 AM - 11:00 AM', available: true },
        { id: 2, time: '11:00 AM - 1:00 PM', available: true },
        { id: 3, time: '1:00 PM - 3:00 PM', available: false },
        { id: 4, time: '3:00 PM - 5:00 PM', available: true },
        { id: 5, time: '5:00 PM - 7:00 PM', available: true },
        { id: 6, time: '7:00 PM - 9:00 PM', available: false },
      ];
      setAvailableSlots(mockSlots);
    }
  }, [selectedDate]);

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSelectSlot = (slot) => {
    if (!slot.available) {
      Alert.alert('Slot Unavailable', 'This time slot is no longer available. Please select another slot.');
      return;
    }
    setSelectedSlot(slot);
  };

  const handleConfirmSlot = () => {
    if (!selectedSlot) {
      Alert.alert('No Slot Selected', 'Please select a delivery time slot before confirming.');
      return;
    }

    // Here we would normally make an API call to confirm the slot
    // For now, we'll just show a success message and navigate back
    Alert.alert(
      'Slot Confirmed',
      `Your delivery slot has been confirmed for ${selectedDate.display}, ${selectedSlot.time}`,
      [
        { 
          text: 'OK', 
          onPress: () => {
            // In a real app, we would update the order status
            navigation.navigate('OrderTracking', { orderId });
          }
        }
      ]
    );
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleReschedule = () => {
    Alert.alert(
      'Reschedule Delivery',
      'Are you sure you want to reschedule this delivery?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reschedule', onPress: () => {
            // In a real app, this would trigger the rescheduling process
            Alert.alert('Reschedule Requested', 'Your rescheduling request has been submitted. You will be notified when a new slot is available.');
          }
        }
      ]
    );
  };

  const renderDateItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.dateItem,
        selectedDate?.dateString === item.dateString ? styles.selectedDate : null
      ]}
      onPress={() => handleSelectDate(item)}
    >
      <Text style={[
        styles.dateText,
        selectedDate?.dateString === item.dateString ? styles.selectedDateText : null
      ]}>
        {item.display}
      </Text>
    </TouchableOpacity>
  );

  const renderSlotItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.slotItem,
        selectedSlot?.id === item.id ? styles.selectedSlot : null,
        !item.available ? styles.unavailableSlot : null
      ]}
      onPress={() => handleSelectSlot(item)}
      disabled={!item.available}
    >
      <Text style={[
        styles.slotText,
        selectedSlot?.id === item.id ? styles.selectedSlotText : null,
        !item.available ? styles.unavailableSlotText : null
      ]}>
        {item.time}
      </Text>
      {!item.available && (
        <Text style={styles.unavailableText}>Unavailable</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Delivery Slot</Text>
        {orderId && <Text style={styles.orderId}>Order: {orderId}</Text>}
      </View>
      
      <View style={styles.content}>
        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <FlatList
            data={dates}
            renderItem={renderDateItem}
            keyExtractor={(item) => item.dateString}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dateList}
          />
        </View>
        
        {/* Time Slot Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Time Slots</Text>
          <Text style={styles.subTitle}>{selectedDate?.display}</Text>
          
          {availableSlots.length > 0 ? (
            <FlatList
              data={availableSlots}
              renderItem={renderSlotItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.slotList}
              contentContainerStyle={styles.slotListContent}
            />
          ) : (
            <Text style={styles.noSlotsText}>Loading available slots...</Text>
          )}
        </View>
        
        {/* Selected Slot Preview */}
        {selectedSlot && (
          <View style={styles.selectedSlotPreview}>
            <Text style={styles.previewTitle}>Selected Slot</Text>
            <View style={styles.previewContent}>
              <Text style={styles.previewDate}>{selectedDate?.display}</Text>
              <Text style={styles.previewTime}>{selectedSlot.time}</Text>
            </View>
          </View>
        )}
        
        {/* Actions */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          
          {orderId && (
            <TouchableOpacity style={[styles.button, styles.rescheduleButton]} onPress={handleReschedule}>
              <Text style={styles.buttonText}>Reschedule</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.button, styles.confirmButton, !selectedSlot ? styles.disabledButton : null]} 
            onPress={handleConfirmSlot}
            disabled={!selectedSlot}
          >
            <Text style={styles.buttonText}>
              {orderId ? 'Confirm Slot' : 'Select Slot'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  orderId: {
    fontSize: 16,
    color: '#e0e0e0',
    marginTop: 5,
  },
  content: {
    flex: 1,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  subTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  dateList: {
    flexGrow: 0,
  },
  dateItem: {
    backgroundColor: '#f0f8ff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  selectedDate: {
    backgroundColor: '#007AFF',
  },
  dateText: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  selectedDateText: {
    color: '#fff',
  },
  slotList: {
    flex: 1,
  },
  slotListContent: {
    paddingBottom: 10,
  },
  slotItem: {
    backgroundColor: '#f0f8ff',
    padding: 20,
    borderRadius: 8,
    marginBottom: 15,
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
    fontWeight: 'bold',
    textAlign: 'center',
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
  noSlotsText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    padding: 20,
  },
  selectedSlotPreview: {
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
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  previewContent: {
    alignItems: 'center',
  },
  previewDate: {
    fontSize: 14,
    color: '#666',
  },
  previewTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  button: {
    flex: 0.3,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  rescheduleButton: {
    backgroundColor: '#FF9500',
  },
  confirmButton: {
    backgroundColor: '#34C759',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SlotSelectionScreen;