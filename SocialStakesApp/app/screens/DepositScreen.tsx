// app/(tabs)/DepositScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const DepositScreen: React.FC = () => {
  const [amount, setAmount] = useState('');

  const handleDeposit = () => {
    if (!amount) {
      Alert.alert('Error', 'Please enter an amount.');
      return;
    }

    Alert.alert('Success', `Deposited $${amount} successfully!`);
    setAmount('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deposit Money</Text>

      <TextInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.depositButton} onPress={handleDeposit}>
        <Text style={styles.depositButtonText}>Deposit</Text>
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
  depositButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  depositButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DepositScreen;