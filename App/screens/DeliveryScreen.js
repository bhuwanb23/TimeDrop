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
    
    // Mock delivery data - NO BACKEND CONNECTIONS - Using Chennai, India locations
    const [activeDeliveries, setActiveDeliveries] = useState([
        {
            id: 1,
            orderNumber: 'ORD-98210',
            customerName: 'Rajesh Kumar',
            address: '45 Anna Salai, Teynampet, Chennai, Tamil Nadu 600018',
            status: 'in_transit',
            isNext: true,
            isReady: true,
            items: ['Wireless Bluetooth Headphones', 'Smart Watch Series 7'],
            totalAmount: '₹3,999.00',
            pickupLocation: 'Phoenix MarketCity, Velachery, Chennai',
            coordinates: {
                latitude: 13.0358,
                longitude: 80.2497
            },
            _raw: {
                id: 1,
                order_number: 'ORD-98210',
                pickup_location: { address: 'Phoenix MarketCity, Velachery, Chennai' },
                dropoff_location: { address: '45 Anna Salai, Teynampet, Chennai' },
                status: 'in_transit'
            }
        },
        {
            id: 2,
            orderNumber: 'ORD-98215',
            customerName: 'Priya Sharma',
            address: '23 Mount Road, Guindy, Chennai, Tamil Nadu 600032',
            status: 'assigned',
            isNext: false,
            isReady: true,
            items: ['Organic Cotton T-Shirt', 'Running Shoes Pro'],
            totalAmount: '₹1,299.00',
            pickupLocation: 'Express Avenue Mall, Royapettah, Chennai',
            coordinates: {
                latitude: 13.0067,
                longitude: 80.2206
            },
            _raw: {
                id: 2,
                order_number: 'ORD-98215',
                pickup_location: { address: 'Express Avenue Mall, Royapettah, Chennai' },
                dropoff_location: { address: '23 Mount Road, Guindy, Chennai' },
                status: 'assigned'
            }
        },
        {
            id: 3,
            orderNumber: 'ORD-98220',
            customerName: 'Arjun Mehta',
            address: '78 East Coast Road, Adyar, Chennai, Tamil Nadu 600020',
            status: 'pending',
            isNext: false,
            isReady: false,
            items: ['Professional Camera Lens', 'Gaming Mouse RGB'],
            totalAmount: '₹8,499.00',
            pickupLocation: 'Citi Centre Mall, Chintadripet, Chennai',
            coordinates: {
                latitude: 13.0067,
                longitude: 80.2497
            },
            _raw: {
                id: 3,
                order_number: 'ORD-98220',
                pickup_location: { address: 'Citi Centre Mall, Chintadripet, Chennai' },
                dropoff_location: { address: '78 East Coast Road, Adyar, Chennai' },
                status: 'pending'
            }
        },
        {
            id: 4,
            orderNumber: 'ORD-98225',
            customerName: 'Lakshmi Iyer',
            address: '156 NSC Bose Road, Sowcarpet, Chennai, Tamil Nadu 600079',
            status: 'assigned',
            isNext: false,
            isReady: true,
            items: ['Yoga Mat Premium', 'Stainless Steel Water Bottle'],
            totalAmount: '₹549.00',
            pickupLocation: 'VR Chennai, Velachery',
            coordinates: {
                latitude: 12.9716,
                longitude: 80.2431
            },
            _raw: {
                id: 4,
                order_number: 'ORD-98225',
                pickup_location: { address: 'VR Chennai, Velachery' },
                dropoff_location: { address: '156 NSC Bose Road, Sowcarpet, Chennai' },
                status: 'assigned'
            }
        }
    ]);
    
    const [deliveredOrders, setDeliveredOrders] = useState([
        {
            id: 10,
            orderNumber: 'ORD-98201',
            customerName: 'Venkatesh Prasad',
            address: '67 Cathedral Road, Gopalapuram, Chennai, Tamil Nadu 600086',
            earnings: '₹145.00',
            deliveryTime: '10:30 AM',
            items: ['Minimalist Desk Lamp'],
            _raw: { id: 10, order_number: 'ORD-98201', earnings: 145.00 }
        },
        {
            id: 11,
            orderNumber: 'ORD-98205',
            customerName: 'Kavitha Reddy',
            address: '34 OMR Road, Thoraipakkam, Chennai, Tamil Nadu 600097',
            earnings: '₹220.00',
            deliveryTime: '11:45 AM',
            items: ['Leather Wallet', 'Portable Bluetooth Speaker'],
            _raw: { id: 11, order_number: 'ORD-98205', earnings: 220.00 }
        },
        {
            id: 12,
            orderNumber: 'ORD-98208',
            customerName: 'Suresh Krishnan',
            address: '89 Luz Church Road, Mylapore, Chennai, Tamil Nadu 600004',
            earnings: '₹178.00',
            deliveryTime: '01:15 PM',
            items: ['Bestseller Novel Collection'],
            _raw: { id: 12, order_number: 'ORD-98208', earnings: 178.00 }
        },
        {
            id: 13,
            orderNumber: 'ORD-98212',
            customerName: 'Meera Nair',
            address: '12 Besant Nagar Beach Road, Besant Nagar, Chennai, Tamil Nadu 600090',
            earnings: '₹265.00',
            deliveryTime: '02:45 PM',
            items: ['Smart Watch Series 7'],
            _raw: { id: 13, order_number: 'ORD-98212', earnings: 265.00 }
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
        backgroundColor: '#ECFDF5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#064E3B',
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
        color: '#064E3B',
    },
    queueCount: {
        fontSize: 12,
        fontWeight: '500',
        color: '#059669',
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