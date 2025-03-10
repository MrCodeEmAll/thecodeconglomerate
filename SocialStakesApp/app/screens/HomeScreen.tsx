// app/(tabs)/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Social Stakes</Text>
      <Text style={styles.subtitle}>Your Betting Hub</Text>

      <View style={styles.statsContainer}>
        <Text style={styles.stat}>Balance: $500</Text>
        <Text style={styles.stat}>Wins: 12</Text>
        <Text style={styles.stat}>Losses: 5</Text>
      </View>

      <TouchableOpacity style={styles.depositButton} onPress={() => navigation.navigate('Deposit')}>
        <Text style={styles.depositButtonText}>Deposit Money</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  statsContainer: {
    marginBottom: 20,
  },
  stat: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  depositButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  depositButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;