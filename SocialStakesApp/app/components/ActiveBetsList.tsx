import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bet } from '../types';

interface ActiveBetsListProps {
  bets: Bet[];
  onInviteFriend: (betId: string) => void;
}

const ActiveBetsList: React.FC<ActiveBetsListProps> = ({ bets, onInviteFriend }) => {
  return (
    <View style={styles.container}>
      {bets.map((bet) => (
        <View key={bet.id} style={styles.betCard}>
          <Text style={styles.betTitle}>{bet.title}</Text>
          <Text style={styles.betStakes}>Stakes: {bet.stakes}</Text>
          <TouchableOpacity
            style={styles.inviteButton}
            onPress={() => onInviteFriend(bet.id)}
          >
            <Text style={styles.inviteButtonText}>Invite Friend</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  betCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  betTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  betStakes: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  inviteButton: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  inviteButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default ActiveBetsList; 