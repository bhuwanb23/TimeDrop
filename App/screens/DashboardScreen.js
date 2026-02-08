import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

const DashboardScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Compact Header */}
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <View style={styles.profileSection}>
                            <View style={styles.profileImageContainer}>
                                <Image
                                    source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80' }}
                                    style={styles.profileImage}
                                />
                                <View style={styles.onlineIndicator}></View>
                            </View>
                            <View style={styles.profileInfo}>
                                <Text style={styles.driverName} numberOfLines={1}>Alex Thompson</Text>
                                <View style={styles.ratingContainer}>
                                    <MaterialIcons name="star" size={12} color="#FFD700" />
                                    <Text style={styles.ratingText}>4.95</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.headerActions}>
                            <TouchableOpacity style={styles.statusButton}>
                                <Text style={styles.statusText}>Online</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuButton}>
                                <MaterialIcons name="menu" size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Main Content */}
                <View style={styles.mainContent}>
                    {/* Compact Stats Cards */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statCard}>
                            <Text style={styles.statValue}>$184.50</Text>
                            <Text style={styles.statLabel}>Today's Earnings</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statValue}>14</Text>
                            <Text style={styles.statLabel}>Completed Trips</Text>
                        </View>
                    </View>

                    {/* Quick Metrics */}
                    <View style={styles.metricsRow}>
                        <View style={styles.metricItem}>
                            <MaterialIcons name="route" size={18} color="#1E3A8A" />
                            <View style={styles.metricTextContainer}>
                                <Text style={styles.metricValue}>98%</Text>
                                <Text style={styles.metricLabel}>Acceptance</Text>
                            </View>
                        </View>
                        <View style={styles.metricItem}>
                            <MaterialIcons name="star" size={18} color="#1E3A8A" />
                            <View style={styles.metricTextContainer}>
                                <Text style={styles.metricValue}>4.95</Text>
                                <Text style={styles.metricLabel}>Rating</Text>
                            </View>
                        </View>
                        <View style={styles.metricItem}>
                            <MaterialIcons name="schedule" size={18} color="#1E3A8A" />
                            <View style={styles.metricTextContainer}>
                                <Text style={styles.metricValue}>8h</Text>
                                <Text style={styles.metricLabel}>Online Today</Text>
                            </View>
                        </View>
                    </View>

                    {/* Recent Activity */}
                    <View style={styles.activitySection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Recent Activity</Text>
                            <TouchableOpacity>
                                <Text style={styles.seeAllText}>See All</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.activityList}>
                            <View style={styles.activityItem}>
                                <View style={styles.activityIcon}>
                                    <MaterialIcons name="check-circle" size={16} color="#10B981" />
                                </View>
                                <View style={styles.activityContent}>
                                    <Text style={styles.activityTitle}>Delivery Completed</Text>
                                    <Text style={styles.activityAmount}>+$12.40</Text>
                                </View>
                                <Text style={styles.activityTime}>2:20 PM</Text>
                            </View>
                            <View style={styles.activityItem}>
                                <View style={styles.activityIcon}>
                                    <MaterialIcons name="local-gas-station" size={16} color="#EF4444" />
                                </View>
                                <View style={styles.activityContent}>
                                    <Text style={styles.activityTitle}>Fuel Expense</Text>
                                    <Text style={styles.activityAmountNegative}>-$35.00</Text>
                                </View>
                                <Text style={styles.activityTime}>12:45 PM</Text>
                            </View>
                            <View style={styles.activityItem}>
                                <View style={styles.activityIcon}>
                                    <MaterialIcons name="check-circle" size={16} color="#10B981" />
                                </View>
                                <View style={styles.activityContent}>
                                    <Text style={styles.activityTitle}>Delivery Completed</Text>
                                    <Text style={styles.activityAmount}>+$18.25</Text>
                                </View>
                                <Text style={styles.activityTime}>11:30 AM</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    header: {
        backgroundColor: '#1E3A8A',
        paddingTop: 12,
        paddingBottom: 16,
        paddingHorizontal: 16,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    profileImageContainer: {
        position: 'relative',
        marginRight: 12,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 10,
        height: 10,
        backgroundColor: '#10B981',
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#1E3A8A',
    },
    profileInfo: {
        flex: 1,
    },
    driverName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 11,
        color: '#FFFFFF',
        fontWeight: '500',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statusButton: {
        backgroundColor: '#10B981',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '600',
    },
    menuButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E3A8A',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 11,
        color: '#64748B',
        fontWeight: '500',
        textAlign: 'center',
    },
    metricsRow: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    metricItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    metricTextContainer: {
        flex: 1,
    },
    metricValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000000',
    },
    metricLabel: {
        fontSize: 10,
        color: '#94A3B8',
        fontWeight: '500',
    },
    activitySection: {
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E3A8A',
    },
    seeAllText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1E3A8A',
    },
    activityList: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        overflow: 'hidden',
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    activityIcon: {
        width: 32,
        height: 32,
        backgroundColor: '#DBEAFE',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    activityContent: {
        flex: 1,
    },
    activityTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 2,
    },
    activityAmount: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1E3A8A',
    },
    activityAmountNegative: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#EF4444',
    },
    activityTime: {
        fontSize: 11,
        color: '#94A3B8',
    },
});

export default DashboardScreen;