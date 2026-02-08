import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeliveryHeader from '../components/DeliveryHeader';
import RouteCard from '../components/RouteCard';
import DeliveryCard from '../components/DeliveryCard';
import QRScannerButton from '../components/QRScannerButton';
import EarningsCard from '../components/EarningsCard';
import DeliveredCard from '../components/DeliveredCard';
import DownloadButton from '../components/DownloadButton';

const DeliveryScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('Active');
    
    // Sample delivery data for Active tab
    const activeDeliveries = [
        {
            id: 1,
            orderNumber: '98210',
            customerName: 'Sarah Jenkins',
            address: '452 Oak Avenue, Downtown Core',
            status: 'in-transit',
            isNext: true,
        },
        {
            id: 2,
            orderNumber: '98211',
            customerName: 'TechHub Office',
            address: '1200 Innovation Way, Suite 400',
            status: 'ready',
            isReady: true,
        },
        {
            id: 3,
            orderNumber: '98215',
            customerName: 'Marco Rossi',
            address: '89 Sunset Blvd, Apt 4C',
            status: 'ready',
            isReady: true,
        }
    ];

    // Sample delivery data for Delivered tab
    const deliveredOrders = [
        {
            id: 1,
            orderNumber: '98205',
            customerName: 'Michael Chen',
            address: '722 West End Ave, Apt 12B',
            earnings: '$18.50',
            deliveryTime: '11:42 AM',
        },
        {
            id: 2,
            orderNumber: '98198',
            customerName: 'Urban Eats Deli',
            address: '45 Market St, Commercial Entrance',
            earnings: '$24.00',
            deliveryTime: '10:15 AM',
        },
        {
            id: 3,
            orderNumber: '98182',
            customerName: 'Emily Watson',
            address: '12 Victoria Rd, Northside',
            earnings: '$12.75',
            deliveryTime: '09:30 AM',
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <DeliveryHeader activeTab={activeTab} setActiveTab={setActiveTab} />
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={true}
                overScrollMode="always"
            >
                {activeTab === 'Active' ? (
                    <>
                        <RouteCard navigation={navigation} />
                        
                        {/* Compact Queue Header */}
                        <View style={styles.queueHeader}>
                            <Text style={styles.queueTitle}>Today's Queue</Text>
                            <Text style={styles.queueCount}>4 Deliveries</Text>
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
                                    />
                                </Animated.View>
                            ))}
                        </View>
                    </>
                ) : (
                    <>
                        <EarningsCard earnings="$142.50" percentage="+12%" />
                        
                        {/* Compact Recent Deliveries Header */}
                        <View style={styles.queueHeader}>
                            <Text style={styles.queueTitle}>Recent Deliveries</Text>
                            <Text style={styles.queueCount}>8 Completed</Text>
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
                                    />
                                </View>
                            ))}
                        </View>
                    </>
                )}
            </ScrollView>
            
            {/* Floating Button - QR Scanner for Active, Download for Delivered */}
            <View style={styles.qrButtonContainer}>
                {activeTab === 'Active' ? (
                    <QRScannerButton />
                ) : (
                    <DownloadButton onPress={() => console.log('Download pressed')} />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f8',
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
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 12,
    },
    queueTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000000',
    },
    queueCount: {
        fontSize: 13,
        fontWeight: '500',
        color: '#64748B',
    },
    deliveryList: {
        paddingHorizontal: 12,
        paddingBottom: 40,
        gap: 8,
    },
    deliveryItem: {
        marginBottom: 8,
    },
    deliveredItem: {
        marginBottom: 8,
    },
    qrButtonContainer: {
        position: 'absolute',
        bottom: 100,
        right: 16,
        zIndex: 20,
    },
});

export default DeliveryScreen;