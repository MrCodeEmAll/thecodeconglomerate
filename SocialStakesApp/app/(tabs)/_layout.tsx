// app/(tabs)/_layout.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import BottomNavBar from '../components/BottomNavBar';

const TabLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>
      <BottomNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
});

export default TabLayout;