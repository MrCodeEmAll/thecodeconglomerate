import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [stakes, setStakes] = useState([]);
  const [trendingStakes, setTrendingStakes] = useState([]);
  const [selectedStake, setSelectedStake] = useState(null);
  const [currentTab, setCurrentTab] = useState('home');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [newStake, setNewStake] = useState({
    title: '',
    description: '',
    amount: '',
  });

  useEffect(() => {
    fetchStakes();
    fetchTrendingStakes();
  }, []);

  const fetchStakes = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/stakes');
      const data = await response.json();
      setStakes(data);
    } catch (error) {
      console.error('Error fetching stakes:', error);
    }
  };

  const fetchTrendingStakes = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/stakes/trending');
      const data = await response.json();
      setTrendingStakes(data);
    } catch (error) {
      console.error('Error fetching trending stakes:', error);
    }
  };

  const createStake = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/stakes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStake),
      });
      const data = await response.json();
      setStakes([...stakes, data]);
      setShowCreateModal(false);
      setNewStake({ title: '', description: '', amount: '' });
    } catch (error) {
      console.error('Error creating stake:', error);
    }
  };

  const joinStake = async (stakeId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/stakes/${stakeId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ participant: 'Demo User' }),
      });
      const data = await response.json();
      setStakes(stakes.map(s => s.id === stakeId ? data : s));
      setSelectedStake(data);
    } catch (error) {
      console.error('Error joining stake:', error);
    }
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'home':
        return (
          <ScrollView style={styles.content}>
            <Text style={styles.sectionTitle}>Trending Bets</Text>
            {trendingStakes.map((stake) => (
              <TouchableOpacity 
                key={stake.id} 
                style={styles.stakeItem}
                onPress={() => {
                  setSelectedStake(stake);
                  setShowStakeModal(true);
                }}
              >
                <Text style={styles.stakeTitle}>{stake.title}</Text>
                <Text style={styles.stakeDetails}>
                  ${stake.amount} • {stake.participants.length} participants
                </Text>
                <Text style={styles.stakeDescription}>{stake.description}</Text>
              </TouchableOpacity>
            ))}
            
            <Text style={styles.sectionTitle}>All Bets</Text>
            {stakes.map((stake) => (
              <TouchableOpacity 
                key={stake.id} 
                style={styles.stakeItem}
                onPress={() => {
                  setSelectedStake(stake);
                  setShowStakeModal(true);
                }}
              >
                <Text style={styles.stakeTitle}>{stake.title}</Text>
                <Text style={styles.stakeDetails}>
                  ${stake.amount} • {stake.participants.length} participants
                </Text>
                <Text style={styles.stakeDescription}>{stake.description}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        );
      case 'create':
        return (
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Create New Bet</Text>
            <TextInput
              style={styles.input}
              placeholder="Bet Title"
              value={newStake.title}
              onChangeText={(text) => setNewStake({...newStake, title: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={newStake.description}
              onChangeText={(text) => setNewStake({...newStake, description: text})}
              multiline
            />
            <TextInput
              style={styles.input}
              placeholder="Amount ($)"
              value={newStake.amount}
              onChangeText={(text) => setNewStake({...newStake, amount: text})}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.button} onPress={createStake}>
              <Text style={styles.buttonText}>Create Bet</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Social Stakes</Text>
      
      {renderContent()}

      <Modal visible={showStakeModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedStake && (
              <>
                <Text style={styles.modalTitle}>{selectedStake.title}</Text>
                <Text style={styles.modalDescription}>{selectedStake.description}</Text>
                <Text style={styles.modalAmount}>${selectedStake.amount}</Text>
                <Text style={styles.modalSubtitle}>Participants:</Text>
                {selectedStake.participants.map((participant, index) => (
                  <Text key={index} style={styles.modalParticipant}>• {participant}</Text>
                ))}
                <TouchableOpacity 
                  style={styles.joinButton} 
                  onPress={() => joinStake(selectedStake.id)}
                >
                  <Text style={styles.buttonText}>Join Bet</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowStakeModal(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={[styles.navItem, currentTab === 'home' && styles.navItemActive]} 
          onPress={() => setCurrentTab('home')}
        >
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navItem, currentTab === 'create' && styles.navItemActive]} 
          onPress={() => setCurrentTab('create')}
        >
          <Text style={styles.navText}>Create Bet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 60,
    marginBottom: 20,
    color: '#2196F3',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stakeItem: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  stakeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  stakeDetails: {
    color: '#666',
    marginBottom: 5,
  },
  stakeDescription: {
    color: '#444',
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  navItem: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  navItemActive: {
    backgroundColor: '#f0f0f0',
  },
  navText: {
    color: '#2196F3',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  modalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 15,
  },
  modalSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  modalParticipant: {
    fontSize: 16,
    color: '#444',
    marginBottom: 5,
  },
  joinButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButton: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#666',
    fontWeight: '600',
  },
}); 