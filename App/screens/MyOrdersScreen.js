import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import apiService from '../services/api';

const MyOrdersScreen = () => {
    const [orders, setOrders] = useState([
        { id: 1, order_number: 'ORD-98210', status: 'delivered', total_amount: 45.99, createdAt: new Date().toISOString(), items: [{product: {name: 'Product 1', image_url: 'https://via.placeholder.com/80'}}] },
        { id: 2, order_number: 'ORD-98205', status: 'in_transit', total_amount: 32.50, createdAt: new Date().toISOString(), items: [{product: {name: 'Product 2', image_url: 'https://via.placeholder.com/80'}}] },
        { id: 3, order_number: 'ORD-98198', status: 'pending', total_amount: 78.25, createdAt: new Date().toISOString(), items: [{product: {name: 'Product 3', image_url: 'https://via.placeholder.com/80'}}] }
    ]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    
    const navigation = useNavigation();

    // Status configuration for visual representation
    const getStatusConfig = (status) => {
        const configs = {
            pending: { color: '#FBBF24', label: 'Pending', icon: 'hourglass-top' },
            confirmed: { color: '#60A5FA', label: 'Confirmed', icon: 'check-circle' },
            processing: { color: '#3B82F6', label: 'Processing', icon: 'autorenew' },
            assigned: { color: '#1D4ED8', label: 'Assigned', icon: 'assignment-ind' },
            picked_up: { color: '#8B5CF6', label: 'Picked Up', icon: 'local-shipping' },
            in_transit: { color: '#EC4899', label: 'In Transit', icon: 'directions-car' },
            delivered: { color: '#10B981', label: 'Delivered', icon: 'local-mall' },
            cancelled: { color: '#EF4444', label: 'Cancelled', icon: 'cancel' },
            returned: { color: '#6B7280', label: 'Returned', icon: 'undo' }
        };
        return configs[status] || { color: '#6B7280', label: status, icon: 'help-outline' };
    };

    const loadOrders = async (pageNum = 1, isRefresh = false) => {
        try {
            if (isRefresh) {
                setLoading(true);
            } else if (pageNum > 1) {
                setIsLoadingMore(true);
            }

            const params = {
                page: pageNum,
                limit: 10,
                sortBy: 'createdAt',
                sortOrder: 'DESC'
            };

            const response = await apiService.orders.getOrders(params);
            
            if (response.data && response.data.data && response.data.data.orders) {
                const newOrders = response.data.data.orders;
                
                if (pageNum === 1 || isRefresh) {
                    setOrders(newOrders);
                } else {
                    setOrders(prev => [...prev, ...newOrders]);
                }
                
                // Check if there are more orders to load
                const total = response.data.data.pagination?.totalOrders || 0;
                const currentTotal = pageNum === 1 ? newOrders.length : orders.length + newOrders.length;
                setHasMore(currentTotal < total);
            } else {
                if (pageNum === 1) {
                    setOrders([]);
                }
            }
            
            setError(null);
        } catch (err) {
            console.error('Error loading orders:', err);
            setError(err.message || 'Failed to load orders');
            
            if (!isRefresh && pageNum === 1) {
                Alert.alert('Error', 'Could not load orders. Please try again later.');
            }
        } finally {
            setLoading(false);
            setIsLoadingMore(false);
            setRefreshing(false);
        }
    };

    // Simple refresh handler - no API calls
    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    const loadMoreOrders = () => {
        if (!isLoadingMore && hasMore) {
            loadOrders(page + 1);
            setPage(prev => prev + 1);
        }
    };

    const handleOrderPress = (order) => {
        navigation.navigate('OrderDetail', { order });
    };

    const OrderCard = ({ order }) => {
        const statusConfig = getStatusConfig(order.status);
        
        return (
            <TouchableOpacity 
                style={styles.orderCard}
                onPress={() => handleOrderPress(order)}
            >
                <View style={styles.orderHeader}>
                    <View style={styles.orderInfo}>
                        <Text style={styles.orderNumber}>#{order.order_number}</Text>
                        <Text style={styles.orderDate}>
                            {new Date(order.createdAt).toLocaleDateString()}
                        </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: `${statusConfig.color}20` }]}>
                        <MaterialIcons 
                            name={statusConfig.icon} 
                            size={16} 
                            color={statusConfig.color} 
                        />
                        <Text style={[styles.statusText, { color: statusConfig.color }]}>
                            {statusConfig.label}
                        </Text>
                    </View>
                </View>
                
                <View style={styles.orderSummary}>
                    <Text style={styles.itemCount}>
                        {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                    </Text>
                    <Text style={styles.orderTotal}>
                        ${order.total_amount ? parseFloat(order.total_amount).toFixed(2) : '0.00'}
                    </Text>
                </View>
                
                {order.delivery_address && (
                    <View style={styles.deliveryInfo}>
                        <MaterialIcons name="location-on" size={16} color="#64748B" />
                        <Text style={styles.deliveryAddress} numberOfLines={1}>
                            {order.delivery_address?.street}, {order.delivery_address?.city}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    const renderFooter = () => {
        if (!isLoadingMore) return null;
        
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#1152d4" />
            </View>
        );
    };

    if (loading && orders.length === 0) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1152d4" />
                <Text style={styles.loadingText}>Loading your orders...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Orders</Text>
                <Text style={styles.headerSubtitle}>
                    {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                </Text>
            </View>

            {/* Error Message */}
            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            {/* Orders List */}
            <FlatList
                data={orders}
                renderItem={({ item }) => <OrderCard order={item} />}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#1152d4']}
                        tintColor="#1152d4"
                    />
                }
                onEndReached={loadMoreOrders}
                onEndReachedThreshold={0.1}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialIcons name="shopping-bag" size={64} color="#D1D5DB" />
                        <Text style={styles.emptyTitle}>No Orders Yet</Text>
                        <Text style={styles.emptySubtitle}>
                            You haven't placed any orders yet. Start shopping to see your order history here.
                        </Text>
                        <TouchableOpacity 
                            style={styles.browseButton}
                            onPress={() => navigation.navigate('CustomerTabs', { screen: 'Home' })}
                        >
                            <Text style={styles.browseButtonText}>Browse Products</Text>
                        </TouchableOpacity>
                    </View>
                }
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
        backgroundColor: '#f6f6f8',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#64748b',
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: 'rgba(246, 246, 248, 0.8)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(226, 232, 240, 0.5)',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
    },
    listContent: {
        padding: 16,
        paddingBottom: 80,
    },
    orderCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    orderInfo: {
        flex: 1,
    },
    orderNumber: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: 2,
    },
    orderDate: {
        fontSize: 12,
        color: '#64748b',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    orderSummary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    itemCount: {
        fontSize: 14,
        color: '#64748b',
    },
    orderTotal: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1152d4',
    },
    deliveryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    deliveryAddress: {
        fontSize: 14,
        color: '#64748b',
        flex: 1,
    },
    footerLoader: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    errorContainer: {
        marginHorizontal: 16,
        padding: 12,
        backgroundColor: '#fee2e2',
        borderRadius: 8,
        marginBottom: 12,
    },
    errorText: {
        color: '#dc2626',
        textAlign: 'center',
        fontSize: 14,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 64,
        paddingHorizontal: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#64748b',
        marginTop: 16,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#9ca3af',
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 20,
    },
    browseButton: {
        backgroundColor: '#1152d4',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 24,
    },
    browseButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default MyOrdersScreen;