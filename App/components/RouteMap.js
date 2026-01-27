import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'react-native';

const RouteMap = () => {
    // Sample map image - you'll need to replace this with actual map component
    const mapImageUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBk8ej8zUYptoJwl__2IikFjQPsy280pOszeI6PKU5rerIpsq2WIdzHcFUmnchsyDRpZGd4IJa5F4Kn6ZParZFLEP0VfWPU6mSITlqee5GEJQN8HzZ-iGSmI1hHdNqSFlsD47XEudu6peenDIxnqSikNSKEUvdhAuMVid8noD19hfuj7NAXE66lVT1W9roZ_Hb_JNWhG8zTkISs2P5WSHh7r99JQXQKBrdJFkMaDK-y1-av6Cn_eZxSIJoGBVK9BvG1PP50Qtlg1zc';

    return (
        <View style={styles.container}>
            {/* Map Background */}
            <View style={styles.mapContainer}>
                <Image
                    source={{ uri: mapImageUrl }}
                    style={styles.mapImage}
                    resizeMode="cover"
                />
                
                {/* Route Line Overlay */}
                <View style={styles.routeOverlay} pointerEvents="none">
                    <View style={styles.routeLinePrimary} />
                    <View style={styles.routeLineSecondary} />
                </View>

                {/* Marker */}
                <View style={styles.marker}>
                    <View style={styles.markerInner}>
                        <Text style={styles.markerText}>1</Text>
                    </View>
                </View>
            </View>

            {/* Right Controls */}
            <View style={styles.rightControls}>
                <View style={styles.zoomControls}>
                    <TouchableOpacity style={styles.zoomButton}>
                        <MaterialIcons name="add" size={20} color="#111318" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.zoomButton}>
                        <MaterialIcons name="remove" size={20} color="#111318" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.locationButton}>
                    <MaterialIcons name="my-location" size={20} color="#1152d4" />
                </TouchableOpacity>
            </View>

            {/* Top Route Modes */}
            <ScrollView 
                style={styles.modeSelector}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.modeSelectorContent}
            >
                <TouchableOpacity style={styles.activeModeButton}>
                    <MaterialIcons name="route" size={20} color="#FFFFFF" />
                    <Text style={styles.activeModeText}>Fastest (18 min)</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modeButton}>
                    <MaterialIcons name="eco" size={20} color="#111318" />
                    <Text style={styles.modeText}>Eco (22 min)</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e5e7eb',
    },
    mapContainer: {
        flex: 1,
        position: 'relative',
    },
    mapImage: {
        flex: 1,
        width: '100%',
    },
    routeOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    routeLinePrimary: {
        width: '100%',
        height: 8,
        backgroundColor: '#1152d4',
        position: 'absolute',
        top: '65%',
        left: 0,
        borderRadius: 4,
        opacity: 0.8,
    },
    routeLineSecondary: {
        width: '80%',
        height: 4,
        backgroundColor: '#9ca3af',
        position: 'absolute',
        top: '68%',
        right: 0,
        borderRadius: 2,
        borderStyle: 'dashed',
        opacity: 0.6,
    },
    marker: {
        position: 'absolute',
        left: '45%',
        top: '65%',
        zIndex: 3,
    },
    markerInner: {
        width: 32,
        height: 32,
        backgroundColor: '#1152d4',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#1152d4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    markerText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    rightControls: {
        position: 'absolute',
        right: 16,
        top: '50%',
        transform: [{ translateY: -48 }],
        gap: 12,
        zIndex: 10,
    },
    zoomControls: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        backdropFilter: 'blur(10px)',
    },
    zoomButton: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    },
    locationButton: {
        width: 48,
        height: 48,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        backdropFilter: 'blur(10px)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    modeSelector: {
        position: 'absolute',
        top: 24,
        left: 16,
        right: 16,
        zIndex: 5,
    },
    modeSelectorContent: {
        flexDirection: 'row',
        gap: 8,
    },
    activeModeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#1152d4',
        borderRadius: 24,
        shadowColor: '#1152d4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    activeModeText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    modeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 8,
        backdropFilter: 'blur(10px)',
    },
    modeText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111318',
    },
});

export default RouteMap;