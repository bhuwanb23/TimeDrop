import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ title, onPress, variant, loading, disabled }) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled || loading}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;