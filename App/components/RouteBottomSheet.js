import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const RouteBottomSheet = ({ deliveries = [], error, onRetry }) => {
    // Calculate remaining stops and time
    const remainingStops = deliveries.length;
    const estimatedTime = remainingStops > 0 ? `${remainingStops * 30}M` : '0M'; // Mock calculation: 30 min per stop
    
    return (
        <View 
            style={[styles.container, { 
                height: '50%', // Match HTML max-h-[50%]
            }]}
        >
            {/* Drag Indicator */}
            <View style={styles.indicatorContainer}>
                <View style={styles.indicator} />
            </View>

            {/* Header Section */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Today's Route</Text>
                    <Text style={styles.headerSubtitle}>
                        {remainingStops} STOPS REMAINING • {estimatedTime}
                    </Text>
                </View>
                <View style={styles.optimizedBadge}>
                    <MaterialIcons name="bolt" size={14} color="#1152d4" />
                    <Text style={styles.optimizedText}>OPTIMIZED</Text>
                </View>
            </View>

            {/* Stops List */}
            {error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : deliveries.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <MaterialIcons name="route" size={48} color="#94A3B8" />
                    <Text style={styles.emptyText}>No active deliveries</Text>
                    <Text style={styles.emptySubtext}>Check back later for new routes</Text>
                </View>
            ) : (
                <ScrollView style={styles.stopsContainer}>
                    {deliveries.map((delivery, index) => (
                        <View key={delivery.id} style={styles.stopItem}>
                            <View style={styles.stopIndicator}>
                                <View style={index === 0 ? styles.stopNumberContainer : styles.stopNumberContainerInactive}>
                                    <Text style={index === 0 ? styles.stopNumber : styles.stopNumberInactive}>
                                        {index + 1}
                                    </Text>
                                </View>
                                {index < deliveries.length - 1 && (
                                    <View style={index === 0 ? styles.stopLineGradient : styles.stopLineInactive} />
                                )}
                            </View>
                            <View style={styles.stopContent}>
                                <View style={styles.stopHeader}>
                                    <View style={styles.stopTitleContainer}>
                                        <Text style={styles.stopTitle} numberOfLines={1}>
                                            {delivery.customerName || `Stop ${index + 1}`}
                                        </Text>
                                        {index === 0 && (
                                            <MaterialIcons name="priority-high" size={16} color="#f59e0b" />
                                        )}
                                        {delivery.priority === 'high' && index !== 0 && (
                                            <MaterialIcons name="bolt" size={16} color="#1152d4" />
                                        )}
                                    </View>
                                    {index === 0 && (
                                        <View style={styles.nextBadge}>
                                            <Text style={styles.nextBadgeText}>NEXT</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.stopDetails}>
                                    {delivery.orderNumber || 'N/A'} • {delivery.address}
                                </Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}

            {/* Bottom Action Buttons */}
            <View style={styles.bottomActions}>
                <TouchableOpacity style={styles.startButton}>
                    <MaterialIcons name="navigation" size={24} color="#FFFFFF" style={{fontWeight: 'bold'}} />
                    <Text style={styles.startButtonText}>START NAVIGATION</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.listButton}>
                    <MaterialIcons name="list" size={24} color="#64748B" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 40, // 2.5rem in HTML
        borderTopRightRadius: 40, // 2.5rem in HTML
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -15 },
        shadowOpacity: 0.12,
        shadowRadius: 40,
        elevation: 20,
        zIndex: 30,
        overflow: 'hidden',
    },
    indicatorContainer: {
        alignItems: 'center',
        paddingVertical: 8,
        paddingTop: 16,
        flexShrink: 0,
    },
    indicator: {
        height: 6,
        width: 56,
        backgroundColor: 'rgba(148, 163, 184, 0.6)',
        borderRadius: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        flexShrink: 0,
    },
    headerTitle: {
        fontSize: 21,
        fontWeight: '800',
        color: '#111318',
        letterSpacing: -0.3,
        marginBottom: 2,
    },
    headerSubtitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#94a3b8',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    optimizedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(17, 82, 212, 0.1)',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(17, 82, 212, 0.2)',
        gap: 6,
    },
    optimizedText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#1152d4',
        letterSpacing: 0.5,
    },
    stopsContainer: {
        flex: 1,
        paddingHorizontal: 24,
    },
    stopItem: {
        flexDirection: 'row',
        paddingVertical: 20,
        position: 'relative',
    },
    stopIndicator: {
        alignItems: 'center',
        marginRight: 20,
        position: 'relative',
    },
    stopNumberContainer: {
        width: 36,
        height: 36,
        backgroundColor: '#1152d4',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
        shadowColor: '#1152d4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    stopNumberContainerInactive: {
        width: 36,
        height: 36,
        backgroundColor: '#f1f5f9',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    stopNumber: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    stopNumberInactive: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#94a3b8',
    },
    stopLineGradient: {
        position: 'absolute',
        width: 2,
        top: 36,
        bottom: 0,
        backgroundColor: '#1152d4',
        borderRadius: 1,
        left: 17,
    },
    stopLineInactive: {
        position: 'absolute',
        width: 2,
        top: 36,
        bottom: 0,
        backgroundColor: '#e2e8f0',
        borderRadius: 1,
        left: 17,
    },
    stopContent: {
        flex: 1,
    },
    stopHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    stopTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    stopTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#111318',
        flex: 1,
    },
    nextBadge: {
        backgroundColor: '#dbeafe',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    nextBadgeText: {
        fontSize: 9,
        fontWeight: '800',
        color: '#1d4ed8',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    stopDetails: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748B',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111318',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#64748B',
        marginTop: 8,
        textAlign: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    errorText: {
        fontSize: 14,
        color: '#EF4444',
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: '#1152d4',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    bottomActions: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 24,
        paddingVertical: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        flexShrink: 0,
    },
    startButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        backgroundColor: '#1152d4',
        paddingVertical: 16,
        borderRadius: 16,
        shadowColor: '#1152d4',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 25,
        elevation: 8,
    },
    startButtonText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    listButton: {
        width: 56,
        height: 56,
        backgroundColor: '#f1f5f9',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
});

export default RouteBottomSheet;