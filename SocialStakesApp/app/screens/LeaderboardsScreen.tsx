 // app/(tabs)/LeaderboardsScreen.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const LeaderboardsScreen: React.FC = () => {
  const leaderboardData = [
    { id: '1', name: 'Alice', points: 500 },
    { id: '2', name: 'Bob', points: 450 },
    { id: '3', name: 'Charlie', points: 400 },
    { id: '4', name: 'Dana', points: 350 },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>

      <FlatList
        data={leaderboardData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.leaderboardItem}>
            <Text style={styles.leaderboardName}>{item.name}</Text>
            <Text style={styles.leaderboardPoints}>{item.points} points</Text>
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
  leaderboardItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leaderboardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  leaderboardPoints: {
    fontSize: 16,
    color: '#666',
  },
});

export default LeaderboardsScreen;