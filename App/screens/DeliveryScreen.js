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
import apiService from '../services/api';

const DeliveryScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('Active');
    const [showDetail, setShowDetail] = useState(false);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [isDeliveredDetail, setIsDeliveredDetail] = useState(false);
    
    // Loading and error states
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    
    // Delivery data from API
    const [activeDeliveries, setActiveDeliveries] = useState([]);
    const [deliveredOrders, setDeliveredOrders] = useState([]);
    const [totalEarnings, setTotalEarnings] = useState(0);

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

    // Load deliveries from API
    const loadDeliveries = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Fetch active deliveries (driver ID 1 for local dev)
            const activeResponse = await apiService.deliveries.getDeliveries({
                driverId: 1,
                status: 'in_transit'
            });
            
            if (activeResponse.data && activeResponse.data.data) {
                const formattedActive = activeResponse.data.data.deliveries.map(delivery => ({
                    id: delivery.id,
                    orderNumber: delivery.order?.order_number || 'N/A',
                    customerName: delivery.order?.customer?.name || 'Customer',
                    address: formatAddress(delivery.dropoff_location),
                    status: delivery.status,
                    isNext: false,
                    isReady: delivery.status === 'assigned',
                    _raw: delivery // Keep raw data for detail view
                }));
                setActiveDeliveries(formattedActive);
            }
            
            // Fetch delivered orders
            const deliveredResponse = await apiService.deliveries.getDeliveries({
                driverId: 1,
                status: 'delivered'
            });
            
            if (deliveredResponse.data && deliveredResponse.data.data) {
                const formattedDelivered = deliveredResponse.data.data.deliveries.map(delivery => ({
                    id: delivery.id,
                    orderNumber: delivery.order?.order_number || 'N/A',
                    customerName: delivery.order?.customer?.name || 'Customer',
                    address: formatAddress(delivery.dropoff_location),
                    earnings: delivery.earnings ? `$${delivery.earnings.toFixed(2)}` : '$0.00',
                    deliveryTime: new Date(delivery.actual_delivery_time || delivery.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    _raw: delivery // Keep raw data for detail view
                }));
                setDeliveredOrders(formattedDelivered);
                
                // Calculate total earnings
                const total = deliveredResponse.data.data.deliveries.reduce((sum, d) => sum + (d.earnings || 0), 0);
                setTotalEarnings(total);
            }
            
        } catch (err) {
            console.error('Error loading deliveries:', err);
            setError(err.message || 'Failed to load deliveries');
            // Use mock data as fallback
            setMockData();
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };
    
    // Format address from JSON or string
    const formatAddress = (address) => {
        if (!address) return 'Address not available';
        
        try {
            // If it's a JSON string, parse it
            const addr = typeof address === 'string' ? JSON.parse(address) : address;
            
            if (addr.street && addr.city) {
                return `${addr.street}, ${addr.city}`;
            } else if (typeof address === 'string') {
                return address;
            }
            return 'Address not available';
        } catch (e) {
            return typeof address === 'string' ? address : 'Address not available';
        }
    };
    
    // Set mock data as fallback
    const setMockData = () => {
        setActiveDeliveries([
            {
                id: 1,
                orderNumber: '98210',
                customerName: 'Sarah Jenkins',
                address: '452 Oak Avenue, Downtown Core',
                status: 'in-transit',
                isNext: true,
                _raw: {}
            },
            {
                id: 2,
                orderNumber: '98211',
                customerName: 'TechHub Office',
                address: '1200 Innovation Way, Suite 400',
                status: 'assigned',
                isReady: true,
                _raw: {}
            },
            {
                id: 3,
                orderNumber: '98215',
                customerName: 'Marco Rossi',
                address: '89 Sunset Blvd, Apt 4C',
                status: 'assigned',
                isReady: true,
                _raw: {}
            }
        ]);
        
        setDeliveredOrders([
            {
                id: 1,
                orderNumber: '98205',
                customerName: 'Michael Chen',
                address: '722 West End Ave, Apt 12B',
                earnings: '$18.50',
                deliveryTime: '11:42 AM',
                _raw: {}
            },
            {
                id: 2,
                orderNumber: '98198',
                customerName: 'Urban Eats Deli',
                address: '45 Market St, Commercial Entrance',
                earnings: '$24.00',
                deliveryTime: '10:15 AM',
                _raw: {}
            },
            {
                id: 3,
                orderNumber: '98182',
                customerName: 'Emily Watson',
                address: '12 Victoria Rd, Northside',
                earnings: '$12.75',
                deliveryTime: '09:30 AM',
                _raw: {}
            }
        ]);
        
        setTotalEarnings(55.25);
    };
    
    useEffect(() => {
        loadDeliveries();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadDeliveries();
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