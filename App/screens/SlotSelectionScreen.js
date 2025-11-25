import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOW } from '../styles/DesignSystem';

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
      <View style={styles.slotContent}>
        <Icon 
          name={selectedSlot?.id === item.id ? "radio-button-on-outline" : "radio-button-off-outline"} 
          size={20} 
          color={selectedSlot?.id === item.id ? COLORS.textInverted : (item.available ? COLORS.primary : COLORS.gray)} 
          style={styles.slotIcon}
        />
        <Text style={[
          styles.slotText,
          selectedSlot?.id === item.id ? styles.selectedSlotText : null,
          !item.available ? styles.unavailableSlotText : null
        ]}>
          {item.time}
        </Text>
      </View>
      {!item.available && (
        <View style={styles.unavailableBadge}>
          <Text style={styles.unavailableText}>Unavailable</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
            <Icon name="arrow-back-outline" size={24} color={COLORS.textInverted} />
          </TouchableOpacity>
          <Text style={styles.title}>Delivery Slots</Text>
          <View style={styles.placeholder} />
        </View>
        {orderId && <Text style={styles.orderId}>Order: {orderId}</Text>}
      </View>
      
      <View style={styles.content}>
        {/* Date Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="calendar-outline" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Select Date</Text>
          </View>
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
          <View style={styles.sectionHeader}>
            <Icon name="time-outline" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Available Time Slots</Text>
          </View>
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
            <View style={styles.loadingContainer}>
              <Icon name="hourglass-outline" size={30} color={COLORS.textSecondary} />
              <Text style={styles.noSlotsText}>Loading available slots...</Text>
            </View>
          )}
        </View>
        
        {/* Selected Slot Preview */}
        {selectedSlot && (
          <View style={styles.selectedSlotPreview}>
            <View style={styles.previewHeader}>
              <Icon name="checkmark-circle-outline" size={20} color={COLORS.secondary} />
              <Text style={styles.previewTitle}>Selected Slot</Text>
            </View>
            <View style={styles.previewContent}>
              <Text style={styles.previewDate}>{selectedDate?.display}</Text>
              <Text style={styles.previewTime}>{selectedSlot.time}</Text>
            </View>
          </View>
        )}
        
        {/* Actions */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
            <Icon name="close-outline" size={20} color={COLORS.textInverted} />
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          
          {orderId && (
            <TouchableOpacity style={[styles.button, styles.rescheduleButton]} onPress={handleReschedule}>
              <Icon name="refresh-outline" size={20} color={COLORS.textInverted} />
              <Text style={styles.buttonText}>Reschedule</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.button, styles.confirmButton, !selectedSlot ? styles.disabledButton : null]} 
            onPress={handleConfirmSlot}
            disabled={!selectedSlot}
          >
            <Icon name="checkmark-outline" size={20} color={COLORS.textInverted} />
            <Text style={styles.buttonText}>
              {orderId ? 'Confirm' : 'Select'}
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
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: TYPOGRAPHY.h2,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textInverted,
  },
  placeholder: {
    width: 24,
  },
  orderId: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textInverted,
    opacity: 0.8,
    marginTop: 10,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: COLORS.cardBackground,
    margin: SPACING.m,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.m,
    ...SHADOW,
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
  subTitle: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.m,
    textAlign: 'center',
    fontWeight: TYPOGRAPHY.medium,
  },
  dateList: {
    flexGrow: 0,
  },
  dateItem: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.l,
    borderRadius: BORDER_RADIUS.medium,
    marginRight: SPACING.s,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  selectedDate: {
    backgroundColor: COLORS.primary,
  },
  dateText: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.semiBold,
  },
  selectedDateText: {
    color: COLORS.textInverted,
  },
  slotList: {
    flex: 1,
  },
  slotListContent: {
    paddingBottom: SPACING.s,
  },
  slotItem: {
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.m,
    borderRadius: BORDER_RADIUS.medium,
    marginBottom: SPACING.s,
    borderWidth: 1,
    borderColor: COLORS.primary,
    ...SHADOW,
  },
  selectedSlot: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
  },
  unavailableSlot: {
    backgroundColor: COLORS.grayLight,
    borderColor: COLORS.gray,
  },
  slotContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slotIcon: {
    marginRight: SPACING.m,
  },
  slotText: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.semiBold,
  },
  selectedSlotText: {
    color: COLORS.textInverted,
  },
  unavailableSlotText: {
    color: COLORS.textLight,
  },
  unavailableBadge: {
    backgroundColor: COLORS.error,
    borderRadius: BORDER_RADIUS.small,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.s,
    alignSelf: 'flex-start',
    marginTop: SPACING.s,
  },
  unavailableText: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textInverted,
    fontWeight: TYPOGRAPHY.semiBold,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: SPACING.l,
  },
  noSlotsText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: SPACING.s,
  },
  selectedSlotPreview: {
    backgroundColor: COLORS.cardBackground,
    margin: SPACING.m,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.m,
    ...SHADOW,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.m,
  },
  previewTitle: {
    fontSize: TYPOGRAPHY.h3,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
    marginLeft: SPACING.s,
  },
  previewContent: {
    alignItems: 'center',
  },
  previewDate: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  previewTime: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.m,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.m,
    borderRadius: BORDER_RADIUS.medium,
    flex: 0.3,
  },
  cancelButton: {
    backgroundColor: COLORS.error,
  },
  rescheduleButton: {
    backgroundColor: COLORS.accent,
  },
  confirmButton: {
    backgroundColor: COLORS.secondary,
  },
  disabledButton: {
    backgroundColor: COLORS.gray,
  },
  buttonText: {
    color: COLORS.textInverted,
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: TYPOGRAPHY.semiBold,
    marginHorizontal: SPACING.xs,
  },
});

export default SlotSelectionScreen;