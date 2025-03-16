// app/(tabs)/ProfileScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=random';

type UserStats = {
  totalBets: number;
  wonBets: number;
  totalPoints: number;
  winRate: number;
  rank: number;
};

const mockUserData = {
  username: 'JohnDoe',
  avatar: 'https://ui-avatars.com/api/?name=John+Doe',
  stats: {
    totalBets: 150,
    wonBets: 95,
    totalPoints: 25000,
    winRate: 63.3,
    rank: 42,
  },
};

const ProfileScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate data fetching
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const renderStatCard = (label: string, value: string | number) => (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Image source={{ uri: mockUserData.avatar }} style={styles.avatar} />
          <Text style={styles.username}>{mockUserData.username}</Text>
          <View style={styles.rankBadge}>
            <Ionicons name="trophy" size={16} color="#FFD700" />
            <Text style={styles.rankText}>Rank #{mockUserData.stats.rank}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          {renderStatCard('Total Bets', mockUserData.stats.totalBets)}
          {renderStatCard('Won Bets', mockUserData.stats.wonBets)}
          {renderStatCard('Win Rate', `${mockUserData.stats.winRate}%`)}
          {renderStatCard('Total Points', mockUserData.stats.totalPoints)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <Text style={styles.activityTitle}>Sports Bet #{item}</Text>
                <Text
                  style={[
                    styles.activityStatus,
                    item % 2 === 0 ? styles.wonStatus : styles.lostStatus,
                  ]}
                >
                  {item % 2 === 0 ? 'Won' : 'Lost'}
                </Text>
              </View>
              <Text style={styles.activityDescription}>
                {item % 2 === 0
                  ? 'Successfully predicted match outcome'
                  : 'Better luck next time!'}
              </Text>
              <View style={styles.activityFooter}>
                <Text style={styles.activityTime}>2 days ago</Text>
                <Text
                  style={[
                    styles.activityPoints,
                    item % 2 === 0 ? styles.wonPoints : styles.lostPoints,
                  ]}
                >
                  {item % 2 === 0 ? '+500' : '-200'} points
                </Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#666" />
          <Text style={styles.settingsText}>Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  rankText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  statCard: {
    backgroundColor: 'white',
    width: '48%',
    margin: '1%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  activityCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  activityStatus: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  wonStatus: {
    backgroundColor: '#e6f4ea',
    color: '#28a745',
  },
  lostStatus: {
    backgroundColor: '#fde8e8',
    color: '#dc3545',
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
  activityPoints: {
    fontSize: 14,
    fontWeight: '600',
  },
  wonPoints: {
    color: '#28a745',
  },
  lostPoints: {
    color: '#dc3545',
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingsText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});

export default ProfileScreen;