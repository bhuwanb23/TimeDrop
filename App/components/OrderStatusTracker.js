import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const OrderStatusTracker = ({ status, timeline }) => {
    // Status configuration for visual representation
    const getStatusConfig = (status) => {
        const configs = {
            pending: { color: '#FBBF24', label: 'Pending', icon: 'hourglass-top' },
            confirmed: { color: '#60A5FA', label: 'Confirmed', icon: 'check-circle' },
            processing: { color: '#3B82F6', label: 'Processing', icon: 'autorenew' },
            assigned: { color: '#1D4ED8', label: 'Assigned', icon: 'assignment-ind' },
            picked_up: { color: '#8B5CF6', label: 'Picked Up', icon: 'local-shipping' },
            in_transit: { color: '#EC4899', label: 'In Transit', icon: 'directions-car' },
            delivered: { color: '#10B981', label: 'Delivered', icon: 'local-mall' },
            cancelled: { color: '#EF4444', label: 'Cancelled', icon: 'cancel' },
            returned: { color: '#6B7280', label: 'Returned', icon: 'undo' }
        };
        return configs[status] || { color: '#6B7280', label: status, icon: 'help-outline' };
    };

    const getStatusTimeline = () => {
        return [
            { status: 'pending', label: 'Order Placed' },
            { status: 'confirmed', label: 'Order Confirmed' },
            { status: 'processing', label: 'Processing' },
            { status: 'assigned', label: 'Assigned to Driver' },
            { status: 'picked_up', label: 'Picked Up' },
            { status: 'in_transit', label: 'Out for Delivery' },
            { status: 'delivered', label: 'Delivered' }
        ];
    };

    const timelineSteps = timeline || getStatusTimeline();
    const currentStatusIndex = timelineSteps.findIndex(t => t.status === status);
    
    return (
        <View style={styles.container}>
            <View style={styles.timelineContainer}>
                {timelineSteps.map((step, index) => {
                    const isCompleted = index <= currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;
                    const statusConfig = getStatusConfig(step.status);
                    
                    return (
                        <View key={step.status} style={styles.timelineStep}>
                            <View style={[
                                styles.timelineDot,
                                isCompleted && styles.timelineDotCompleted,
                                isCurrent && styles.timelineDotCurrent
                            ]}>
                                {isCompleted ? (
                                    <MaterialIcons 
                                        name="check" 
                                        size={16} 
                                        color={isCurrent ? "#ffffff" : statusConfig.color} 
                                    />
                                ) : (
                                    <MaterialIcons 
                                        name={step.status === 'delivered' ? 'local-mall' : 'fiber-manual-record'} 
                                        size={12} 
                                        color="#CBD5E1" 
                                    />
                                )}
                            </View>
                            <Text style={[
                                styles.timelineLabel,
                                isCompleted && styles.timelineLabelCompleted,
                                isCurrent && styles.timelineLabelCurrent
                            ]}>
                                {step.label}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#ffffff',
        margin: 16,
        borderRadius: 12,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    timelineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    timelineStep: {
        alignItems: 'center',
        flex: 1,
    },
    timelineDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#E2E8F0',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
    },
    timelineDotCompleted: {
        backgroundColor: '#10B981',
    },
    timelineDotCurrent: {
        backgroundColor: '#1152d4',
    },
    timelineLabel: {
        fontSize: 10,
        color: '#94A3B8',
        marginTop: 8,
        textAlign: 'center',
        maxWidth: 60,
    },
    timelineLabelCompleted: {
        color: '#64748B',
        fontWeight: '500',
    },
    timelineLabelCurrent: {
        color: '#1152d4',
        fontWeight: '600',
    },
});

export default OrderStatusTracker;