import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';

const DashboardScreen = () => {
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [statistics, setStatistics] = useState(null);
    const [error, setError] = useState(null);

    // Mock data - NO BACKEND CONNECTIONS
    const mockData = {
        todayEarnings: 184.50,
        completedTrips: 14,
        acceptanceRate: 98,
        rating: 4.95,
        recentActivity: [
            { id: 1, order_number: 'ORD-98210', earnings: 12.40, status: 'delivered', createdAt: new Date().toISOString() },
            { id: 2, order_number: 'ORD-98205', earnings: -35.00, status: 'expense', createdAt: new Date().toISOString() },
            { id: 3, order_number: 'ORD-98198', earnings: 18.25, status: 'delivered', createdAt: new Date().toISOString() }
        ]
    };

    // Use mock data only
    const stats = mockData;

    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#1E3A8A" />
                    <Text style={styles.loadingText}>Loading dashboard...</Text>
                </View>
            ) : error ? (
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={loadStatistics}>
                            <Text style={styles.retryButtonText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            ) : (
                <ScrollView 
                    style={styles.scrollView} 
                    contentContainerStyle={styles.scrollContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#1E3A8A']}
                            tintColor="#1E3A8A"
                        />
                    }
                >
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
                    {/* Beautiful Income Chart Card */}
                    <View style={styles.incomeCard}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.incomeLabel}>Today's Earnings</Text>
                            <MaterialIcons name="trending-up" size={18} color="#10B981" />
                        </View>
                        <View style={styles.incomeAmountContainer}>
                            <Text style={styles.incomeAmount}>${stats.todayEarnings.toFixed(2)}</Text>
                            <Text style={styles.incomeChange}>+12% vs avg</Text>
                        </View>
                        <View style={styles.chartContainer}>
                            <Svg height="50" width="100%" viewBox="0 0 300 40">
                                <Defs>
                                    <LinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <Stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                                        <Stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                                    </LinearGradient>
                                </Defs>
                                <Path
                                    d="M0,30 C25,25 50,10 75,15 C100,20 125,35 150,30 C175,25 200,5 225,10 C250,15 275,25 300,20"
                                    fill="none"
                                    stroke="#3B82F6"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                                <Path
                                    d="M0,30 C25,25 50,10 75,15 C100,20 125,35 150,30 C175,25 200,5 225,10 C250,15 275,25 300,20 L300,40 L0,40 Z"
                                    fill="url(#gradient)"
                                />
                            </Svg>
                        </View>
                    </View>

                    {/* Stats Cards */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statCard}>
                            <MaterialIcons name="check-circle" size={20} color="#10B981" />
                            <Text style={styles.statValue}>{stats.completedTrips}</Text>
                            <Text style={styles.statLabel}>Completed Trips</Text>
                        </View>
                        <View style={styles.statCard}>
                            <MaterialIcons name="schedule" size={20} color="#1E3A8A" />
                            <Text style={styles.statValue}>8h</Text>
                            <Text style={styles.statLabel}>Online Today</Text>
                        </View>
                    </View>

                    {/* Compact Metrics Row */}
                    <View style={styles.metricsRow}>
                        <View style={styles.metricItem}>
                            <View style={styles.metricIconContainer}>
                                <MaterialIcons name="verified-user" size={16} color="#1E3A8A" />
                            </View>
                            <View style={styles.metricTextContainer}>
                                <Text style={styles.metricValue} numberOfLines={1}>{stats.acceptanceRate}%</Text>
                                <Text style={styles.metricLabel} numberOfLines={1}>Acceptance</Text>
                            </View>
                        </View>
                        <View style={styles.metricItem}>
                            <View style={styles.metricIconContainer}>
                                <MaterialIcons name="star" size={16} color="#1E3A8A" />
                            </View>
                            <View style={styles.metricTextContainer}>
                                <Text style={styles.metricValue} numberOfLines={1}>{stats.rating}</Text>
                                <Text style={styles.metricLabel} numberOfLines={1}>Rating</Text>
                            </View>
                        </View>
                        <View style={styles.metricItem}>
                            <View style={styles.metricIconContainer}>
                                <MaterialIcons name="speed" size={16} color="#1E3A8A" />
                            </View>
                            <View style={styles.metricTextContainer}>
                                <Text style={styles.metricValue} numberOfLines={1}>2.4x</Text>
                                <Text style={styles.metricLabel} numberOfLines={1}>Efficiency</Text>
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
                            {stats.recentActivity && stats.recentActivity.map((activity, index) => (
                                <View key={activity.id || index} style={styles.activityItem}>
                                    <View style={styles.activityIcon}>
                                        <MaterialIcons 
                                            name={activity.status === 'delivered' ? 'check-circle' : 'local-gas-station'} 
                                            size={16} 
                                            color={activity.earnings > 0 ? '#10B981' : '#EF4444'} 
                                        />
                                    </View>
                                    <View style={styles.activityContent}>
                                        <Text style={styles.activityTitle}>
                                            {activity.status === 'delivered' ? 'Delivery Completed' : 'Fuel Expense'}
                                        </Text>
                                        <Text style={[styles.activityAmount, { color: activity.earnings > 0 ? '#1E3A8A' : '#EF4444' }]}>
                                            {activity.earnings > 0 ? '+' : ''}{activity.earnings.toFixed(2)}
                                        </Text>
                                    </View>
                                    <Text style={styles.activityTime}>
                                        {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
                </ScrollView>
            )}
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
    incomeCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    incomeLabel: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '600',
    },
    incomeAmountContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 8,
        marginBottom: 12,
    },
    incomeAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E3A8A',
    },
    incomeChange: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#10B981',
    },
    chartContainer: {
        height: 50,
        width: '100%',
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
        gap: 8,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E3A8A',
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
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    metricItem: {
        flex: 1,
        alignItems: 'center',
    },
    metricIconContainer: {
        width: 32,
        height: 32,
        backgroundColor: '#DBEAFE',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    metricTextContainer: {
        alignItems: 'center',
    },
    metricValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 2,
    },
    metricLabel: {
        fontSize: 10,
        color: '#94A3B8',
        fontWeight: '500',
        textAlign: 'center',
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