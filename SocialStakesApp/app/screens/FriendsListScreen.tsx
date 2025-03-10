import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FriendsListScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends List</Text>
      <View style={styles.friendCard}>
        <Text style={styles.friendName}>Friend Name</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  friendCard: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  friendName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FriendsListScreen; 