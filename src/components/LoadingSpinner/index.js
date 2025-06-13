import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import styles from './styles';

const LoadingSpinner = ({ size = 'large', color = '#007BFF', text }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
      }
    </View>
  );
};

export default LoadingSpinner;