import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const Input = ({ label, value, onChangeText, placeholder, error }) => {
  return (
    <View>
      {label && <Text>{label}</Text>}
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} />
      {error && <Text>{error}</Text>}
    </View>
  );
};

export default Input;