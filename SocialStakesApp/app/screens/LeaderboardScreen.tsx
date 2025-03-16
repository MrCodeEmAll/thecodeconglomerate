import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type LeaderboardUser = {
  id: string;
  rank: number;
  username: string;
  points: number;
  winRate: number;
  avatar: string;
};

const LeaderboardScreen: React.FC = () => {
  const [timeFrame, setTimeFrame] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate data fetching
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const leaderboardData: LeaderboardUser[] = [
    {
      id: '1',
      rank: 1,
      username: 'BetMaster',
      points: 15000,
      winRate: 75.5,
      avatar: 'https://ui-avatars.com/api/?name=Bet+Master',
    },
    {
      id: '2',
      rank: 2,
      username: 'LuckyStreak',
      points: 12500,
      winRate: 68.2,
      avatar: 'https://ui-avatars.com/api/?name=Lucky+Streak',
    },
    {
      id: '3',
      rank: 3,
      username: 'SportsPro',
      points: 10800,
      winRate: 65.0,
      avatar: 'https://ui-avatars.com/api/?name=Sports+Pro',
    },
    // Add more users as needed
  ];

  const renderTimeFrameButton = (type: 'weekly' | 'monthly' | 'allTime', label: string) => (
    <TouchableOpacity
      style={[styles.timeFrameButton, timeFrame === type && styles.activeTimeFrame]}
      onPress={() => setTimeFrame(type)}
    >
      <Text style={[styles.timeFrameText, timeFrame === type && styles.activeTimeFrameText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderLeaderboardItem = (user: LeaderboardUser) => (
    <View key={user.id} style={styles.leaderboardItem}>
      <View style={styles.rankContainer}>
        <Text style={styles.rankText}>#{user.rank}</Text>
      </View>
      <Image source={{ uri: user.avatar }} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.winRate}>{user.winRate}% Win Rate</Text>
      </View>
      <View style={styles.pointsContainer}>
        <Text style={styles.points}>{user.points}</Text>
        <Text style={styles.pointsLabel}>PTS</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <View style={styles.timeFrameContainer}>
          {renderTimeFrameButton('weekly', 'Weekly')}
          {renderTimeFrameButton('monthly', 'Monthly')}
          {renderTimeFrameButton('allTime', 'All Time')}
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {leaderboardData.map(renderLeaderboardItem)}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  timeFrameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 4,
  },
  timeFrameButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTimeFrame: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timeFrameText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTimeFrameText: {
    color: '#007bff',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  winRate: {
    fontSize: 12,
    color: '#666',
  },
  pointsContainer: {
    alignItems: 'center',
  },
  points: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#666',
  },
});

export default LeaderboardScreen; 