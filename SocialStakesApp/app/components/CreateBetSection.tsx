import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

interface CreateBetSectionProps {
  onCreateBet: (title: string, stakes: string) => void;
}

const CreateBetSection: React.FC<CreateBetSectionProps> = ({ onCreateBet }) => {
  const [title, setTitle] = useState('');
  const [stakes, setStakes] = useState('');

  const handleSubmit = () => {
    if (title && stakes) {
      onCreateBet(title, stakes);
      setTitle('');
      setStakes('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Create New Bet</Text>
      <TextInput
        style={styles.input}
        placeholder="What's the bet about?"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Stakes (e.g., 100 points)"
        value={stakes}
        onChangeText={setStakes}
      />
      <TouchableOpacity
        style={[styles.button, (!title || !stakes) && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!title || !stakes}
      >
        <Text style={styles.buttonText}>Create Bet</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateBetSection; 