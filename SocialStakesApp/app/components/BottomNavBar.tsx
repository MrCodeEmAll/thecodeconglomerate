import React from 'react';
import { View, StyleSheet } from 'react-native';

const BottomNavBar: React.FC = () => {
  return <View style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});

export default BottomNavBar; 