import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { betsAPI } from '../services/api';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Bet } from '../types/bet';
import { useAuth } from '../contexts/AuthContext';

interface RouteParams {
  betId: string;
}

const BetDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const [bet, setBet] = useState<Bet | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<number>(-1);
  const [betAmount, setBetAmount] = useState('');

  const { betId } = route.params as RouteParams;

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
    if (selectedOption === -1 || !betAmount) {
      Alert.alert('Error', 'Please select an option and enter bet amount');
      return;
    }

    try {
      if (!user?._id) {
        Alert.alert('Error', 'Please sign in to join bets');
        return;
      }
      
      if (!bet?.options[selectedOption]) {
        Alert.alert('Error', 'Invalid option selected');
        return;
      }

      await betsAPI.joinBet(
        betId,
        bet.options[selectedOption].text,
        parseFloat(betAmount)
      );
      Alert.alert('Success', 'Successfully joined the bet!');
      fetchBetDetails(); // Refresh bet details
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to join bet');
    }
  };

  const handleResolveBet = async (outcomeIndex: number) => {
    try {
      if (!bet?.options[outcomeIndex]) {
        Alert.alert('Error', 'Invalid option selected');
        return;
      }

      await betsAPI.resolveBet(betId, bet.options[outcomeIndex].text);
      Alert.alert('Success', 'Bet resolved successfully!');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to resolve bet');
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

  const isCreator = bet.creator._id === user?._id;
  const canJoin = bet.status === 'open' && !isCreator;
  const canResolve = isCreator && bet.status === 'open';

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
                selectedOption === index && styles.selectedOption,
              ]}
              onPress={() => setSelectedOption(index)}
              disabled={!canJoin}
            >
              <Text style={styles.optionText}>{option.text}</Text>
              <Text style={styles.oddsText}>Odds: {option.odds}x</Text>
            </TouchableOpacity>
          ))}
        </View>

        {canJoin && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Join Bet</Text>
            <View style={styles.joinSection}>
              <TextInput
                style={[styles.input, styles.amountInput]}
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
          </View>
        )}

        {canResolve && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resolve Bet</Text>
            {bet.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.resolveButton}
                onPress={() => handleResolveBet(index)}
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
                Choice: {bet.options[participant.selectedOption].text}
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
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  amountInput: {
    flex: 1,
  },
  joinButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resolveButton: {
    backgroundColor: '#0066cc',
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
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  participantChoice: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  participantAmount: {
    fontSize: 14,
    color: '#666',
  },
});

export default BetDetailsScreen; 