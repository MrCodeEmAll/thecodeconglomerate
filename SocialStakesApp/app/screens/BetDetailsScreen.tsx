import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { betsAPI } from '../services/api';
import { useRoute, useNavigation } from '@react-navigation/native';

const BetDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [bet, setBet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState('');
  const [betAmount, setBetAmount] = useState('');

  const betId = route.params?.betId;

  useEffect(() => {
    fetchBetDetails();
  }, [betId]);

  const fetchBetDetails = async () => {
    try {
      const response = await betsAPI.getBetDetails(betId);
      setBet(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load bet details');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinBet = async () => {
    if (!selectedOption || !betAmount) {
      Alert.alert('Error', 'Please select an option and enter bet amount');
      return;
    }

    try {
      await betsAPI.joinBet(betId, selectedOption, parseFloat(betAmount));
      Alert.alert('Success', 'Successfully joined the bet!');
      fetchBetDetails(); // Refresh bet details
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to join bet');
    }
  };

  const handleResolveBet = async (outcome) => {
    try {
      await betsAPI.resolveBet(betId, outcome);
      Alert.alert('Success', 'Bet resolved successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to resolve bet');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  if (!bet) {
    return (
      <View style={styles.errorContainer}>
        <Text>Bet not found</Text>
      </View>
    );
  }

  const isCreator = bet.creator._id === 'currentUserId'; // Replace with actual user ID check
  const canJoin = bet.status === 'open' && !isCreator;
  const canResolve = isCreator && bet.status === 'in_progress';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>{bet.title}</Text>
          <Text style={styles.creator}>Created by {bet.creator.username}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{bet.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <Text style={styles.detail}>Category: {bet.category}</Text>
          <Text style={styles.detail}>Status: {bet.status}</Text>
          <Text style={styles.detail}>Total Pool: ${bet.totalPool}</Text>
          <Text style={styles.detail}>
            Expires: {new Date(bet.expiresAt).toLocaleString()}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Options</Text>
          {bet.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedOption === option.text && styles.selectedOption,
              ]}
              onPress={() => setSelectedOption(option.text)}
              disabled={!canJoin}
            >
              <Text style={styles.optionText}>{option.text}</Text>
              <Text style={styles.oddsText}>Odds: {option.odds}x</Text>
            </TouchableOpacity>
          ))}
        </View>

        {canJoin && (
          <View style={styles.joinSection}>
            <TextInput
              style={styles.amountInput}
              value={betAmount}
              onChangeText={setBetAmount}
              placeholder="Enter bet amount"
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.joinButton}
              onPress={handleJoinBet}
            >
              <Text style={styles.joinButtonText}>Join Bet</Text>
            </TouchableOpacity>
          </View>
        )}

        {canResolve && (
          <View style={styles.resolveSection}>
            <Text style={styles.sectionTitle}>Resolve Bet</Text>
            {bet.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.resolveButton}
                onPress={() => handleResolveBet(option.text)}
              >
                <Text style={styles.resolveButtonText}>
                  Select "{option.text}" as Winner
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Participants</Text>
          {bet.participants.map((participant, index) => (
            <View key={index} style={styles.participantItem}>
              <Text style={styles.participantName}>
                {participant.user.username}
              </Text>
              <Text style={styles.participantChoice}>
                Choice: {participant.choice}
              </Text>
              <Text style={styles.participantAmount}>
                Amount: ${participant.amount}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  creator: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
  detail: {
    fontSize: 16,
    color: '#444',
    marginBottom: 8,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#e6f0ff',
    borderColor: '#0066cc',
    borderWidth: 1,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  oddsText: {
    fontSize: 14,
    color: '#666',
  },
  joinSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 8,
  },
  amountInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  joinButton: {
    backgroundColor: '#0066cc',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resolveSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 8,
  },
  resolveButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  resolveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  participantItem: {
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 8,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  participantChoice: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  participantAmount: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});

export default BetDetailsScreen; 