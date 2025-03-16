import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type Bet = {
  id: string;
  title: string;
  amount: number;
  description: string;
  participants: number;
  timeLeft: string;
  status: 'active' | 'completed' | 'lost';
};

const BetsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate data fetching
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const activeBets: Bet[] = [
    {
      id: '1',
      title: 'Manchester United vs Liverpool',
      amount: 500,
      description: 'Manchester United to win',
      participants: 234,
      timeLeft: '2 days',
      status: 'active',
    },
    {
      id: '2',
      title: 'NBA Finals Game 1',
      amount: 1000,
      description: 'Total points over 220.5',
      participants: 567,
      timeLeft: '5 hours',
      status: 'active',
    },
  ];

  const betHistory: Bet[] = [
    {
      id: '3',
      title: 'F1 Monaco GP',
      amount: 750,
      description: 'Max Verstappen to win',
      participants: 890,
      timeLeft: 'Completed',
      status: 'completed',
    },
    {
      id: '4',
      title: 'Wimbledon Finals',
      amount: 300,
      description: 'Djokovic vs Alcaraz - Straight sets',
      participants: 445,
      timeLeft: 'Completed',
      status: 'lost',
    },
  ];

  const renderBetCard = (bet: Bet) => {
    const statusColor = {
      active: '#007bff',
      completed: '#28a745',
      lost: '#dc3545',
    }[bet.status];

    return (
      <TouchableOpacity key={bet.id} style={styles.betCard}>
        <View style={styles.betHeader}>
          <Text style={styles.betTitle}>{bet.title}</Text>
          <Text style={[styles.betAmount, { color: statusColor }]}>
            {bet.amount} Points
          </Text>
        </View>
        <Text style={styles.betDescription}>{bet.description}</Text>
        <View style={styles.betFooter}>
          <Text style={styles.betParticipants}>
            <Ionicons name="people" size={16} /> {bet.participants} participants
          </Text>
          <Text style={styles.betTimeLeft}>
            <Ionicons name="time" size={16} /> {bet.timeLeft}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'active' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('active')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'active' && styles.activeTabText,
            ]}
          >
            Active Bets
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'history' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('history')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'history' && styles.activeTabText,
            ]}
          >
            History
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === 'active'
          ? activeBets.map(renderBetCard)
          : betHistory.map(renderBetCard)}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  activeTab: {
    backgroundColor: '#007bff',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  activeTabText: {
    color: 'white',
  },
  scrollView: {
    flex: 1,
    padding: 10,
  },
  betCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  betHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  betTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  betAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  betDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  betFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  betParticipants: {
    fontSize: 14,
    color: '#666',
  },
  betTimeLeft: {
    fontSize: 14,
    color: '#666',
  },
});

export default BetsScreen; 