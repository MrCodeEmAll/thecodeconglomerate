// app/(tabs)/HelpCenterScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HelpCenterScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Help Center</Text>
      <Text style={styles.subtitle}>Get help and support here.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
});

export default HelpCenterScreen;