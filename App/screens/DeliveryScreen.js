import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Animated,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeliveryHeader from '../components/DeliveryHeader';
import RouteCard from '../components/RouteCard';
import DeliveryCard from '../components/DeliveryCard';
import QRScannerButton from '../components/QRScannerButton';
import EarningsCard from '../components/EarningsCard';
import DeliveredCard from '../components/DeliveredCard';
import DownloadButton from '../components/DownloadButton';
import DeliveryDetail from '../components/DeliveryDetail';

const DeliveryScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('Active');
    const [showDetail, setShowDetail] = useState(false);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [isDeliveredDetail, setIsDeliveredDetail] = useState(false);
    
    // Loading and error states
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    
    // Mock delivery data - NO BACKEND CONNECTIONS
    const [activeDeliveries, setActiveDeliveries] = useState([
        {
            id: 1,
            orderNumber: 'ORD-98210',
            customerName: 'John Doe',
            address: '123 Main St, San Francisco, CA',
            status: 'in_transit',
            isNext: true,
            isReady: true,
            _raw: {
                id: 1,
                order_number: 'ORD-98210',
                pickup_location: { address: '456 Warehouse Ave' },
                dropoff_location: { address: '123 Main St, San Francisco, CA' },
                status: 'in_transit'
            }
        },
        {
            id: 2,
            orderNumber: 'ORD-98215',
            customerName: 'Jane Smith',
            address: '789 Oak Rd, San Francisco, CA',
            status: 'assigned',
            isNext: false,
            isReady: true,
            _raw: {
                id: 2,
                order_number: 'ORD-98215',
                pickup_location: { address: '321 Storage Blvd' },
                dropoff_location: { address: '789 Oak Rd, San Francisco, CA' },
                status: 'assigned'
            }
        },
        {
            id: 3,
            orderNumber: 'ORD-98220',
            customerName: 'Bob Wilson',
            address: '555 Pine St, San Francisco, CA',
            status: 'pending',
            isNext: false,
            isReady: false,
            _raw: {
                id: 3,
                order_number: 'ORD-98220',
                pickup_location: { address: '888 Depot Ln' },
                dropoff_location: { address: '555 Pine St, San Francisco, CA' },
                status: 'pending'
            }
        }
    ]);
    
    const [deliveredOrders, setDeliveredOrders] = useState([
        {
            id: 10,
            orderNumber: 'ORD-98201',
            customerName: 'Alice Brown',
            address: '222 Elm St, San Francisco, CA',
            earnings: '$12.40',
            deliveryTime: '10:30 AM',
            _raw: { id: 10, order_number: 'ORD-98201', earnings: 12.40 }
        },
        {
            id: 11,
            orderNumber: 'ORD-98205',
            customerName: 'Charlie Davis',
            address: '333 Cedar Ave, San Francisco, CA',
            earnings: '$18.75',
            deliveryTime: '11:45 AM',
            _raw: { id: 11, order_number: 'ORD-98205', earnings: 18.75 }
        },
        {
            id: 12,
            orderNumber: 'ORD-98208',
            customerName: 'Eva Martinez',
            address: '444 Birch Blvd, San Francisco, CA',
            earnings: '$15.20',
            deliveryTime: '01:15 PM',
            _raw: { id: 12, order_number: 'ORD-98208', earnings: 15.20 }
        }
    ]);
    
    const [totalEarnings, setTotalEarnings] = useState(46.35);

    const handleShowDetail = (delivery, isDelivered = false) => {
        // Use raw delivery data if available, otherwise use formatted data
        const deliveryData = delivery._raw || delivery;
        setSelectedDelivery(deliveryData);
        setIsDeliveredDetail(isDelivered);
        setShowDetail(true);
    };

    const handleCloseDetail = () => {
        setShowDetail(false);
        setSelectedDelivery(null);
    };

    // Simple refresh handler - no API calls
    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <DeliveryHeader activeTab={activeTab} setActiveTab={setActiveTab} />
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#1E3A8A" />
                    <Text style={styles.loadingText}>Loading deliveries...</Text>
                </View>
            ) : (
                <ScrollView 
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    bounces={true}
                    overScrollMode="always"
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#1E3A8A']}
                            tintColor="#1E3A8A"
                        />
                    }
                >
                {activeTab === 'Active' ? (
                    <>
                        <RouteCard navigation={navigation} />
                        
                        {/* Compact Queue Header */}
                        <View style={styles.queueHeader}>
                            <Text style={styles.queueTitle}>Today's Queue</Text>
                            <Text style={styles.queueCount}>{activeDeliveries.length}</Text>
                        </View>

                        {/* Compact Delivery Cards */}
                        <View style={styles.deliveryList}>
                            {activeDeliveries.map((delivery, index) => (
                                <Animated.View
                                    key={delivery.id}
                                    style={styles.deliveryItem}
                                >
                                    <DeliveryCard
                                        orderNumber={delivery.orderNumber}
                                        customerName={delivery.customerName}
                                        address={delivery.address}
                                        status={delivery.status}
                                        isNext={delivery.isNext}
                                        isReady={delivery.isReady}
                                        onPressDetails={() => handleShowDetail(delivery, false)}
                                    />
                                </Animated.View>
                            ))}
                        </View>
                    </>
                ) : (
                    <>
                        <EarningsCard earnings={`$${totalEarnings.toFixed(2)}`} percentage="+12%" />
                        
                        {/* Compact Recent Deliveries Header */}
                        <View style={styles.queueHeader}>
                            <Text style={styles.queueTitle}>Recent Deliveries</Text>
                            <Text style={styles.queueCount}>{deliveredOrders.length}</Text>
                        </View>

                        {/* Compact Delivered Cards */}
                        <View style={styles.deliveryList}>
                            {deliveredOrders.map((delivery, index) => (
                                <View key={delivery.id} style={styles.deliveredItem}>
                                    <DeliveredCard
                                        orderNumber={delivery.orderNumber}
                                        customerName={delivery.customerName}
                                        address={delivery.address}
                                        earnings={delivery.earnings}
                                        deliveryTime={delivery.deliveryTime}
                                        onPressDetails={() => handleShowDetail(delivery, true)}
                                    />
                                </View>
                            ))}
                        </View>
                    </>
                )}
                </ScrollView>
            )}
            
            {/* Floating Button - QR Scanner for Active, Download for Delivered */}
            <View style={styles.qrButtonContainer}>
                {activeTab === 'Active' ? (
                    <QRScannerButton />
                ) : (
                    <DownloadButton onPress={() => console.log('Download pressed')} />
                )}
            </View>

            {/* Delivery Detail Modal */}
            <DeliveryDetail
                visible={showDetail}
                onClose={handleCloseDetail}
                deliveryData={selectedDelivery}
                isDelivered={isDeliveredDetail}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f8',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#64748B',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    queueHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingTop: 16,
        paddingBottom: 8,
    },
    queueTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    queueCount: {
        fontSize: 12,
        fontWeight: '500',
        color: '#64748B',
    },
    deliveryList: {
        paddingHorizontal: 12,
        paddingBottom: 40,
        gap: 6,
    },
    deliveryItem: {
        marginBottom: 6,
    },
    deliveredItem: {
        marginBottom: 6,
    },
    qrButtonContainer: {
        position: 'absolute',
        bottom: 100,
        right: 16,
        zIndex: 20,
    },
});

export default DeliveryScreen;