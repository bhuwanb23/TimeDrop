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
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';

const DashboardScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <View style={styles.profileSection}>
                            <View style={styles.profileImageContainer}>
                                <Image
                                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZq1sgp2cTBBZ5PctsPAU2kfcTH3XYFqdlEkAChCRBsWD6TkJ87w1VgzJgGT4BQe8zlVQ3v9rbJ257aLUrZIfy61CcUi2m3nvinPRG0m6mUArHVyhyD-rlSfVt3bvroY2y9PqVB7KMx-dy6BmgV4zOM66xqoBWRozOAOrWpIBLBYeUIxTpo_lRJEkJqtJimc9XA0LTEZuUzTcpNzOkLDRYy9NYmNdbCHdVpLH8QSd8BpeeXY4x3DW5GLJNIuztvZzXOsba6uWXEOs' }}
                                    style={styles.profileImage}
                                />
                                <View style={styles.onlineIndicator}></View>
                            </View>
                            <View>
                                <Text style={styles.driverName}>Alex Thompson</Text>
                                <View style={styles.ratingContainer}>
                                    <MaterialIcons name="star" size={14} color="#FFD700" />
                                    <Text style={styles.ratingText}>4.95 Rating</Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.menuButton}>
                            <MaterialIcons name="menu" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.statusCard}>
                        <View>
                            <Text style={styles.statusText}>Current Status</Text>
                            <Text style={styles.statusValue}>Online & Active</Text>
                        </View>
                        <TouchableOpacity style={styles.offlineButton}>
                            <Text style={styles.offlineButtonText}>GO OFFLINE</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Main Content */}
                <View style={styles.mainContent}>
                    {/* Daily Income Card */}
                    <View style={styles.incomeCard}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.incomeLabel}>Daily Income</Text>
                            <MaterialIcons name="payments" size={20} color="#1E3A8A" />
                        </View>
                        <View style={styles.incomeAmountContainer}>
                            <Text style={styles.incomeAmount}>$184.50</Text>
                            <Text style={styles.incomeChange}>+12% vs avg</Text>
                        </View>
                        <View style={styles.chartContainer}>
                            <Svg height="64" width="100%" viewBox="0 0 400 60">
                                <Defs>
                                    <LinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <Stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                                        <Stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                                    </LinearGradient>
                                </Defs>
                                <Path
                                    d="M0,45 C40,42 60,15 100,20 C140,25 180,50 220,45 C260,40 300,10 340,15 C380,20 400,35 400,35"
                                    fill="none"
                                    stroke="#3B82F6"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <Path
                                    d="M0,45 C40,42 60,15 100,20 C140,25 180,50 220,45 C260,40 300,10 340,15 C380,20 400,35 400,35 L400,60 L0,60 Z"
                                    fill="url(#gradient)"
                                />
                            </Svg>
                        </View>
                        <View style={styles.chartLabels}>
                            <Text style={styles.chartLabel}>7 Days Ago</Text>
                            <Text style={styles.chartLabel}>Today</Text>
                        </View>
                    </View>

                    {/* Metrics Grid */}
                    <View style={styles.metricsGrid}>
                        <View style={styles.metricCard}>
                            <MaterialIcons name="route" size={24} color="#1E3A8A" style={styles.metricIcon} />
                            <Text style={styles.metricValue}>14</Text>
                            <Text style={styles.metricLabel}>Completed Trips</Text>
                        </View>
                        <View style={styles.metricCard}>
                            <MaterialIcons name="verified-user" size={24} color="#1E3A8A" style={styles.metricIcon} />
                            <Text style={styles.metricValue}>98%</Text>
                            <Text style={styles.metricLabel}>Acceptance Rate</Text>
                            <View style={styles.sparklineContainer}>
                                <Svg height="16" width="100%" viewBox="0 0 100 20">
                                    <Path
                                        d="M0,10 L15,8 L30,12 L45,5 L60,7 L75,3 L90,6 L100,5"
                                        fill="none"
                                        stroke="#1E3A8A"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        opacity="0.6"
                                    />
                                </Svg>
                            </View>
                        </View>
                    </View>

                    {/* Recent Activity */}
                    <View style={styles.activitySection}>
                        <View style={styles.activityHeader}>
                            <Text style={styles.activityTitle}>Recent Activity</Text>
                            <TouchableOpacity>
                                <Text style={styles.seeAllButton}>See All</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.activityList}>
                            <View style={styles.activityItem}>
                                <View style={styles.activityIconContainer}>
                                    <MaterialIcons name="check-circle" size={20} color="#1E3A8A" />
                                </View>
                                <View style={styles.activityContent}>
                                    <View style={styles.activityTopRow}>
                                        <Text style={styles.activityText}>Delivery Completed</Text>
                                        <Text style={styles.activityAmount}>+$12.40</Text>
                                    </View>
                                    <Text style={styles.activitySubtext}>244 Oak St • 14:20 PM</Text>
                                </View>
                            </View>
                            <View style={styles.activityItem}>
                                <View style={styles.activityIconContainer}>
                                    <MaterialIcons name="local-gas-station" size={20} color="#1E3A8A" />
                                </View>
                                <View style={styles.activityContent}>
                                    <View style={styles.activityTopRow}>
                                        <Text style={styles.activityText}>Fuel Expense</Text>
                                        <Text style={styles.activityAmountNegative}>-$35.00</Text>
                                    </View>
                                    <Text style={styles.activitySubtext}>Shell Station • 12:45 PM</Text>
                                </View>
                            </View>
                            <View style={styles.activityItem}>
                                <View style={styles.activityIconContainer}>
                                    <MaterialIcons name="check-circle" size={20} color="#1E3A8A" />
                                </View>
                                <View style={styles.activityContent}>
                                    <View style={styles.activityTopRow}>
                                        <Text style={styles.activityText}>Delivery Completed</Text>
                                        <Text style={styles.activityAmount}>+$18.25</Text>
                                    </View>
                                    <Text style={styles.activitySubtext}>892 Maple Ave • 11:30 AM</Text>
                                </View>
                            </View>
                            <View style={styles.activityItem}>
                                <View style={styles.activityIconContainer}>
                                    <MaterialIcons name="stars" size={20} color="#1E3A8A" />
                                </View>
                                <View style={styles.activityContent}>
                                    <View style={styles.activityTopRow}>
                                        <Text style={styles.activityText}>Weekly Bonus</Text>
                                        <Text style={styles.activityAmount}>+$50.00</Text>
                                    </View>
                                    <Text style={styles.activitySubtext}>High Performance • 09:00 AM</Text>
                                </View>
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
        paddingBottom: 20, // Space for device navbar only
    },
    header: {
        backgroundColor: '#1E3A8A',
        paddingTop: 12,
        paddingBottom: 24,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        paddingHorizontal: 24,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    profileImageContainer: {
        position: 'relative',
    },
    profileImage: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 14,
        height: 14,
        backgroundColor: '#10B981',
        borderRadius: 7,
        borderWidth: 2,
        borderColor: '#1E3A8A',
    },
    driverName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        lineHeight: 22,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        opacity: 0.8,
    },
    ratingText: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: '500',
    },
    menuButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        padding: 16,
        backdropFilter: 'blur(10px)',
    },
    statusText: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statusValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: 2,
    },
    offlineButton: {
        backgroundColor: '#10B981',
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderRadius: 999,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    offlineButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    mainContent: {
        paddingHorizontal: 24,
        marginTop: -24, // Overlap with header
    },
    incomeCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
        borderLeftWidth: 4,
        borderLeftColor: '#1E3A8A',
        marginBottom: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
        zIndex: 10,
    },
    incomeLabel: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    incomeAmountContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 8,
        marginBottom: 16,
        zIndex: 10,
    },
    incomeAmount: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#1E3A8A',
    },
    incomeChange: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#10B981',
    },
    chartContainer: {
        width: '100%',
        height: 64,
        marginTop: 4,
        overflow: 'visible',
    },
    chartLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    chartLabel: {
        fontSize: 9,
        color: '#94A3B8',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    metricsGrid: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
    metricCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    metricIcon: {
        marginBottom: 8,
    },
    metricValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 4,
    },
    metricLabel: {
        fontSize: 10,
        color: '#94A3B8',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        textAlign: 'center',
    },
    sparklineContainer: {
        width: '100%',
        height: 16,
        marginTop: 4,
        paddingHorizontal: 8,
    },
    activitySection: {
        marginBottom: 24,
    },
    activityHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    activityTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E3A8A',
    },
    seeAllButton: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E3A8A',
    },
    activityList: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
        overflow: 'hidden',
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    activityIconContainer: {
        width: 40,
        height: 40,
        backgroundColor: '#DBEAFE',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    activityContent: {
        flex: 1,
    },
    activityTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    activityText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000000',
    },
    activityAmount: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1E3A8A',
    },
    activityAmountNegative: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#EF4444',
    },
    activitySubtext: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 2,
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        paddingHorizontal: 32,
        paddingVertical: 12,
        paddingBottom: 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 50,
    },
    navButton: {
        alignItems: 'center',
        gap: 4,
    },
    navLabelActive: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#1E3A8A',
    },
    navLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#94A3B8',
    },
});

export default DashboardScreen;