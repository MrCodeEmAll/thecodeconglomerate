// app/(tabs)/CreateBetScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const CreateBetScreen: React.FC = () => {
  const [title, setTitle] = useState('');
  const [stakes, setStakes] = useState('');

  const handleCreateBet = () => {
    if (!title || !stakes) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    Alert.alert('Success', 'Bet created successfully!');
    setTitle('');
    setStakes('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a New Bet</Text>

      <TextInput
        placeholder="Bet Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Stakes (e.g., 50 points)"
        value={stakes}
        onChangeText={setStakes}
        style={styles.input}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.createButton} onPress={handleCreateBet}>
        <Text style={styles.createButtonText}>Create Bet</Text>
      </TouchableOpacity>
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  createButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateBetScreen;