// app/(tabs)/two.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '.screens/types';
import { StackNavigationProp } from '@react-navigation/stack';

type TwoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

const TwoScreen: React.FC = () => {
  const navigation = useNavigation<TwoScreenNavigationProp>();
  const [activeBets, setActiveBets] = useState([
    { id: '1', title: 'Who will win the game?', participants: ['Alice', 'Bob'], stakes: '50 points' },
    { id: '2', title: 'Will it rain tomorrow?', participants: ['Charlie', 'Dana'], stakes: '100 points' },
  ]);
  const [newBetTitle, setNewBetTitle] = useState('');
  const [newBetStakes, setNewBetStakes] = useState('');

  const handleCreateBet = () => {
    if (!newBetTitle || !newBetStakes) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const newBet = {
      id: String(activeBets.length + 1),
      title: newBetTitle,
      participants: [],
      stakes: newBetStakes,
    };

    setActiveBets([...activeBets, newBet]);
    setNewBetTitle('');
    setNewBetStakes('');
    Alert.alert('Success', 'Bet created successfully!');
  };

  const handleInviteFriend = (betId: string) => {
    Alert.alert('Invite Friend', `Invite a friend to join bet ${betId}`);
  };

  const handleViewLeaderboard = () => {
    navigation.navigate('Leaderboards');
  };

  const handleDepositMoney = () => {
    navigation.navigate('Deposit');
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={styles.topNavBar}>
        <Text style={styles.appName}>Social Stakes</Text>
        <View style={styles.topNavLinks}>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.topNavLink}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('FriendsList')}>
            <Text style={styles.topNavLink}>Friends</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleViewLeaderboard}>
            <Text style={styles.topNavLink}>Leaderboard</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('HelpCenter')}>
            <Text style={styles.topNavLink}>Help</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <Text style={styles.title}>Active Bets</Text>

        {/* Active Bets List */}
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

        {/* Create Bet Section */}
        <View style={styles.createBetContainer}>
          <Text style={styles.createBetTitle}>Create a New Bet</Text>
          <TextInput
            placeholder="Bet Title"
            value={newBetTitle}
            onChangeText={setNewBetTitle}
            style={styles.input}
          />
          <TextInput
            placeholder="Stakes (e.g., 50 points)"
            value={newBetStakes}
            onChangeText={setNewBetStakes}
            style={styles.input}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.createBetButton} onPress={handleCreateBet}>
            <Text style={styles.createBetButtonText}>Create Bet</Text>
          </TouchableOpacity>
        </View>

        {/* Deposit Money Button */}
        <TouchableOpacity style={styles.depositButton} onPress={handleDepositMoney}>
          <Text style={styles.depositButtonText}>Deposit Money</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.bottomNavLink}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ActiveBets')}>
          <Text style={styles.bottomNavLink}>Active Bets</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('CreateBet')}>
          <Text style={styles.bottomNavLink}>Create Bet</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <Text style={styles.bottomNavLink}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.bottomNavLink}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  topNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#333',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffcc00',
    fontFamily: 'RetroFont', // Add a retro font if available
  },
  topNavLinks: {
    flexDirection: 'row',
    gap: 20,
  },
  topNavLink: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
    padding: 20,
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
  createBetContainer: {
    marginTop: 20,
  },
  createBetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  createBetButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  createBetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  depositButton: {
    backgroundColor: '#ffc107',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  depositButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#333',
  },
  bottomNavLink: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default TwoScreen;