import React from 'react';
import { View, StyleSheet } from 'react-native';

const Card = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({ card: { backgroundColor: '#fff', borderRadius: 8, padding: 16 } });
export default Card;