import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const RouteBottomSheet = ({ deliveries = [], error, onRetry }) => {
    // Calculate remaining stops and time
    const remainingStops = deliveries.length;
    const estimatedTime = remainingStops > 0 ? `${remainingStops * 30}M` : '0M'; // Mock calculation: 30 min per stop
    
    return (
        <View 
            style={[styles.container, { 
                height: '60%',
            }]}
        >
            {/* Drag Indicator */}
            <View style={styles.indicatorContainer}>
                <View style={styles.indicator} />
            </View>

            {/* Header Section - Redesigned */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.headerTitle}>Delivery Route</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statBadge}>
                            <Ionicons name="cube" size={14} color="#1152d4" />
                            <Text style={styles.statText}>{remainingStops} Orders</Text>
                        </View>
                        <View style={styles.statDot} />
                        <View style={styles.statBadge}>
                            <Ionicons name="time" size={14} color="#1152d4" />
                            <Text style={styles.statText}>{estimatedTime}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.optimizedBadge}>
                    <Ionicons name="flash" size={14} color="#1152d4" />
                    <Text style={styles.optimizedText}>OPTIMIZED</Text>
                </View>
            </View>

            {/* Customer Orders List - Redesigned */}
            {error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : deliveries.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="route-outline" size={48} color="#94A3B8" />
                    <Text style={styles.emptyText}>No active deliveries</Text>
                    <Text style={styles.emptySubtext}>Check back later for new routes</Text>
                </View>
            ) : (
                <ScrollView style={styles.ordersContainer} showsVerticalScrollIndicator={false}>
                    {deliveries.map((delivery, index) => (
                        <TouchableOpacity key={delivery.id} style={styles.orderCard}>
                            {/* Order Number Badge */}
                            <View style={[
                                styles.orderNumberBadge,
                                index === 0 && styles.orderNumberBadgeActive
                            ]}>
                                <Text style={[
                                    styles.orderNumberText,
                                    index === 0 && styles.orderNumberTextActive
                                ]}>
                                    {index + 1}
                                </Text>
                            </View>

                            {/* Order Content */}
                            <View style={styles.orderContent}>
                                {/* Customer Info Row */}
                                <View style={styles.customerRow}>
                                    <View style={styles.customerInfo}>
                                        <View style={styles.avatarCircle}>
                                            <Ionicons 
                                                name="person-circle" 
                                                size={32} 
                                                color={index === 0 ? '#1152d4' : '#94a3b8'} 
                                            />
                                        </View>
                                        <View style={styles.customerDetails}>
                                            <Text style={styles.customerName}>
                                                {delivery.customerName || `Customer ${index + 1}`}
                                            </Text>
                                            <Text style={styles.customerPhone}>
                                                <Ionicons name="call" size={12} color="#64748B" />
                                                {' '}(555) {100 + index}-20{20 + index}
                                            </Text>
                                        </View>
                                    </View>
                                    {index === 0 && (
                                        <View style={styles.nextBadge}>
                                            <Ionicons name="navigate" size={12} color="#1d4ed8" />
                                            <Text style={styles.nextBadgeText}>NEXT</Text>
                                        </View>
                                    )}
                                </View>

                                {/* Order Details */}
                                <View style={styles.orderDetails}>
                                    <View style={styles.detailRow}>
                                        <Ionicons name="ticket-outline" size={16} color="#64748B" />
                                        <Text style={styles.orderNumber}>{delivery.orderNumber}</Text>
                                        <View style={styles.priorityBadge}>
                                            <Ionicons 
                                                name={delivery.priority === 'high' ? 'flame' : 'checkmark-circle'} 
                                                size={12} 
                                                color={delivery.priority === 'high' ? '#f59e0b' : '#10b981'} 
                                            />
                                            <Text style={styles.priorityText}>
                                                {delivery.priority === 'high' ? 'HIGH' : 'STANDARD'}
                                            </Text>
                                        </View>
                                    </View>
                                    
                                    <View style={styles.detailRow}>
                                        <Ionicons name="location-outline" size={16} color="#64748B" />
                                        <Text style={styles.addressText} numberOfLines={2}>
                                            {delivery.address}
                                        </Text>
                                    </View>
                                </View>

                                {/* Action Buttons */}
                                <View style={styles.actionButtons}>
                                    <TouchableOpacity style={styles.callButton}>
                                        <Ionicons name="call-outline" size={18} color="#1152d4" />
                                        <Text style={styles.callButtonText}>Call</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.navigateButton}>
                                        <Ionicons name="navigate-outline" size={18} color="#FFFFFF" />
                                        <Text style={styles.navigateButtonText}>Navigate</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}

            {/* Bottom Action Buttons - Redesigned */}
            <View style={styles.bottomActions}>
                <TouchableOpacity style={styles.startButton}>
                    <Ionicons name="navigate-circle" size={24} color="#FFFFFF" />
                    <Text style={styles.startButtonText}>START DELIVERY</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.refreshButton}>
                    <Ionicons name="refresh-outline" size={24} color="#64748B" />
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
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
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
        paddingVertical: 12,
        paddingTop: 16,
        flexShrink: 0,
    },
    indicator: {
        height: 5,
        width: 48,
        backgroundColor: 'rgba(148, 163, 184, 0.5)',
        borderRadius: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        flexShrink: 0,
    },
    headerLeft: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111318',
        letterSpacing: -0.3,
        marginBottom: 8,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    statBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748B',
    },
    statDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#cbd5e1',
    },
    optimizedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(17, 82, 212, 0.08)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(17, 82, 212, 0.15)',
        gap: 6,
        alignSelf: 'flex-start',
    },
    optimizedText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#1152d4',
        letterSpacing: 0.5,
    },
    ordersContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    orderCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    orderNumberBadge: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        marginTop: 4,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    orderNumberBadgeActive: {
        backgroundColor: '#1152d4',
        borderColor: '#1152d4',
        shadowColor: '#1152d4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    orderNumberText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#94a3b8',
    },
    orderNumberTextActive: {
        color: '#FFFFFF',
    },
    orderContent: {
        flex: 1,
    },
    customerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    customerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatarCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(17, 82, 212, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    customerDetails: {
        gap: 4,
    },
    customerName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111318',
        letterSpacing: -0.2,
    },
    customerPhone: {
        fontSize: 12,
        fontWeight: '500',
        color: '#64748B',
        flexDirection: 'row',
        alignItems: 'center',
    },
    nextBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#dbeafe',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 6,
    },
    nextBadgeText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#1d4ed8',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    orderDetails: {
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        gap: 8,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    orderNumber: {
        fontSize: 13,
        fontWeight: '600',
        color: '#475569',
        flex: 1,
    },
    priorityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
    },
    priorityText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#f59e0b',
        letterSpacing: 0.5,
    },
    addressText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#64748B',
        flex: 1,
        lineHeight: 18,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    callButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#eff6ff',
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#bfdbfe',
    },
    callButtonText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1152d4',
    },
    navigateButton: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#1152d4',
        paddingVertical: 10,
        borderRadius: 10,
        shadowColor: '#1152d4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    navigateButtonText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '700',
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
        paddingVertical: 40,
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
        borderRadius: 10,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    bottomActions: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        flexShrink: 0,
    },
    startButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: '#1152d4',
        paddingVertical: 14,
        borderRadius: 14,
        shadowColor: '#1152d4',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 6,
    },
    startButtonText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    refreshButton: {
        width: 52,
        height: 52,
        backgroundColor: '#f1f5f9',
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
});

export default RouteBottomSheet;