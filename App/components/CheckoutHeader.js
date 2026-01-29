import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const CheckoutHeader = ({ currentStep, onStepPress, onBack }) => {
    const steps = [
        { id: 1, title: 'Shipping', icon: '1' },
        { id: 2, title: 'Payment', icon: '2' },
        { id: 3, title: 'Review', icon: '3' }
    ];

    const getStepStatus = (stepId) => {
        if (stepId < currentStep) return 'completed';
        if (stepId === currentStep) return 'active';
        return 'upcoming';
    };

    const getStepStyle = (status) => {
        switch (status) {
            case 'completed':
                return {
                    container: styles.stepCompleted,
                    text: styles.stepTextCompleted,
                    title: styles.stepTitleCompleted
                };
            case 'active':
                return {
                    container: styles.stepActive,
                    text: styles.stepTextActive,
                    title: styles.stepTitleActive
                };
            default:
                return {
                    container: styles.stepUpcoming,
                    text: styles.stepTextUpcoming,
                    title: styles.stepTitleUpcoming
                };
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <MaterialIcons name="arrow-back-ios" size={20} color="#0f172a" />
                </TouchableOpacity>
                <Text style={styles.title}>Checkout</Text>
                <View style={styles.placeholder} />
            </View>
            
            <View style={styles.stepperContainer}>
                <View style={styles.progressLineContainer}>
                    <View 
                        style={[
                            styles.progressLine, 
                            { width: `${(currentStep - 1) * 50}%` }
                        ]} 
                    />
                </View>
                
                <View style={styles.stepsContainer}>
                    {steps.map((step, index) => {
                        const status = getStepStatus(step.id);
                        const stepStyle = getStepStyle(status);
                        
                        return (
                            <View key={step.id} style={styles.stepWrapper}>
                                <TouchableOpacity 
                                    style={stepStyle.container}
                                    onPress={() => onStepPress && onStepPress(step.id)}
                                    disabled={status === 'upcoming'}
                                >
                                    {status === 'completed' ? (
                                        <MaterialIcons 
                                            name="check" 
                                            size={16} 
                                            color="#ffffff" 
                                        />
                                    ) : (
                                        <Text style={stepStyle.text}>{step.icon}</Text>
                                    )}
                                </TouchableOpacity>
                                <Text style={stepStyle.title}>{step.title}</Text>
                            </View>
                        );
                    })}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(246, 246, 248, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(226, 232, 240, 0.5)',
        zIndex: 50,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        paddingTop: 40,
    },
    backButton: {
        padding: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
        flex: 1,
        textAlign: 'center',
        paddingRight: 32,
    },
    placeholder: {
        width: 40,
    },
    stepperContainer: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        position: 'relative',
    },
    progressLineContainer: {
        position: 'absolute',
        top: 30,
        left: 40,
        right: 40,
        height: 2,
        backgroundColor: '#e2e8f0',
        zIndex: -1,
    },
    progressLine: {
        height: '100%',
        backgroundColor: '#10b981',
        borderRadius: 1,
    },
    stepsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    stepWrapper: {
        alignItems: 'center',
        gap: 8,
    },
    stepCompleted: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#10b981',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: 'rgba(246, 246, 248, 0.8)',
    },
    stepActive: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#1152d4',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: 'rgba(246, 246, 248, 0.8)',
    },
    stepUpcoming: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#e2e8f0',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: 'rgba(246, 246, 248, 0.8)',
    },
    stepTextCompleted: {
        fontSize: 14,
        fontWeight: '700',
        color: '#ffffff',
    },
    stepTextActive: {
        fontSize: 14,
        fontWeight: '700',
        color: '#ffffff',
    },
    stepTextUpcoming: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748b',
    },
    stepTitleCompleted: {
        fontSize: 12,
        fontWeight: '500',
        color: '#10b981',
    },
    stepTitleActive: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1152d4',
    },
    stepTitleUpcoming: {
        fontSize: 12,
        fontWeight: '500',
        color: '#64748b',
    },
});

export default CheckoutHeader;