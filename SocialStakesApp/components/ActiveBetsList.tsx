// app/components/ActiveBetsList.tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Animated } from 'react-native';

type Bet = {
  id: string;
  title: string;
  participants: string[];
  stakes: string;
};

type ActiveBetsListProps = {
  bets: Bet[];
  onInviteFriend: (betId: string) => void;
};

const ActiveBetsList: React.FC<ActiveBetsListProps> = ({ bets, onInviteFriend }) => {
  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <FlatList
      data={bets}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Animated.View style={[styles.betCard, { opacity: fadeAnim }]}>
          <Text style={styles.betTitle}>{item.title}</Text>
          <Text style={styles.betParticipants}>Participants: {item.participants.join(', ') || 'None'}</Text>
          <Text style={styles.betStakes}>Stakes: {item.stakes}</Text>
          <TouchableOpacity
            style={styles.inviteButton}
            onPress={() => onInviteFriend(item.id)}
          >
            <Text style={styles.inviteButtonText}>Invite Friend</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    />
  );
};

const styles = StyleSheet.create({
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

export default ActiveBetsList;