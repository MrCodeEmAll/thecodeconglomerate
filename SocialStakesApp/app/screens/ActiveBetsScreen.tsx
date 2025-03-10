// app/(tabs)/ActiveBetsScreen.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const ActiveBetsScreen: React.FC = () => {
  const [activeBets, setActiveBets] = useState([
    { id: '1', title: 'Who will win the game?', participants: ['Alice', 'Bob'], stakes: '50 points' },
    { id: '2', title: 'Will it rain tomorrow?', participants: ['Charlie', 'Dana'], stakes: '100 points' },
  ]);

  const handleInviteFriend = (betId: string) => {
    Alert.alert('Invite Friend', `Invite a friend to join bet ${betId}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Active Bets</Text>

      <FlatList
        data={activeBets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.betCard}>
            <Text style={styles.betTitle}>{item.title}</Text>
            <Text style={styles.betParticipants}>Participants: {item.participants.join(', ') || 'None'}</Text>
            <Text style={styles.betStakes}>Stakes: {item.stakes}</Text>
            <TouchableOpacity
              style={styles.inviteButton}
              onPress={() => handleInviteFriend(item.id)}
            >
              <Text style={styles.inviteButtonText}>Invite Friend</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  betCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  betTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  betParticipants: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  betStakes: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  inviteButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  inviteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ActiveBetsScreen;