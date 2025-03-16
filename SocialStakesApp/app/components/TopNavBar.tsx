import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TopNavBarProps {
  onViewLeaderboard: () => void;
}

const TopNavBar: React.FC<TopNavBarProps> = ({ onViewLeaderboard }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Social Stakes</Text>
      <TouchableOpacity onPress={onViewLeaderboard}>
        <Ionicons name="trophy-outline" size={24} color="#007bff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default TopNavBar; 