import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

const ProfileHeader = () => {
    return (
        <SafeAreaView style={styles.container}>
            {/* Top Navigation */}

            {/* Profile Header */}
            <View style={styles.header}>
                <View style={styles.profileRow}>
                    <View style={styles.imageWrapper}>
                        <Image
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3tOXa4FUP6D_drb6RJaL3SguqkDRA9uJPvAdaMW3ja3bzoFat3fOa8W_EDI1PI7xJQDDEKS8JI6M7WUmrqU7EOzF5s5FyX-uFeku1C473hKOFeSO2CgbwLlYHZiXk8DqaT6OIqA1CQ6hp4H58DcM-9BTCyl7bfLoiuoaRNB8WXEDwWEFo-4-PWJ0lXRoMqUmgO1vw3apEv6jwJXPZTiQ8aqaOnCMkdbPyEPOJuaiy_NgAAHuj3KhoSSwzF3FDoMj13RqxSwv0uNc' }}
                            style={styles.profileImage}
                        />
                        <View style={styles.editBadge}>
                            <MaterialIcons name="edit" size={14} color="#FFFFFF" />
                        </View>
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={styles.driverName}>Alex Rivera</Text>
                        <View style={styles.infoRow}>
                            <View style={styles.ratingBadge}>
                                <MaterialIcons name="star" size={14} color="#FBBF24" />
                                <Text style={styles.ratingText}>4.9 Stars</Text>
                            </View>
                            <Text style={styles.memberText}>• 2021</Text>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1E3A8A',
    },
    topNav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    navButton: {
        padding: 8,
    },
    navTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    navRight: {
        flexDirection: 'row',
        gap: 16,
    },
    header: {
        paddingTop: 25,
        paddingBottom: 24,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        backgroundColor: '#1E3A8A',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    imageWrapper: {
        position: 'relative',
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    textContainer: {
        flex: 1,
    },
    editBadge: {
        position: 'absolute',
        bottom: 16,
        right: 0,
        backgroundColor: '#1E618A',
        padding: 6,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#1E3A8A',
    },
    driverName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 6,
        letterSpacing: -0.3,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backdropFilter: 'blur(10px)',
    },
    ratingText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
    memberText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
    },
});

export default ProfileHeader;