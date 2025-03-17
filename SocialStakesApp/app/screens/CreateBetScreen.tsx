// app/components/CreateBetSection.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { betsAPI } from '../services/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { CreateBetData, BetOption } from '../types/bet';

type BetCategory = 'Sports' | 'E-Sports' | 'Politics' | 'Entertainment' | 'Custom';
type BetVisibility = 'public' | 'friends' | 'private';

const CreateBetScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stake, setStake] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']); // Minimum 2 options
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [invitedFriends, setInvitedFriends] = useState<string[]>([]);
  const [friendEmail, setFriendEmail] = useState('');
  const [category, setCategory] = useState<BetCategory>('Sports');
  const [visibility, setVisibility] = useState<BetVisibility>('public');

  const categories: BetCategory[] = ['Sports', 'E-Sports', 'Politics', 'Entertainment', 'Custom'];
  const visibilityOptions: BetVisibility[] = ['public', 'friends', 'private'];

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleOptionChange = (text: string, index: number) => {
    const newOptions = [...options];
    newOptions[index] = text;
    setOptions(newOptions);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) {
      Alert.alert('Error', 'Minimum 2 options required');
      return;
    }
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleAddFriend = () => {
    if (!friendEmail) return;
    if (invitedFriends.includes(friendEmail)) {
      Alert.alert('Error', 'Friend already invited');
      return;
    }
    setInvitedFriends([...invitedFriends, friendEmail]);
    setFriendEmail('');
  };

  const handleRemoveFriend = (email: string) => {
    setInvitedFriends(invitedFriends.filter(f => f !== email));
  };

  const handleCreateBet = async () => {
    if (!title || !description || !stake || options.some(opt => !opt)) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const betOptions: BetOption[] = options.map(opt => ({ text: opt, odds: 1 }));
      const betData: CreateBetData = {
        title,
        description,
        category,
        options: betOptions,
        expiresAt: expiryDate,
        visibility,
      };

      await betsAPI.createBet(betData);
      Alert.alert('Success', 'Bet created successfully!');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create bet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Create a New Bet</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter bet title"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your bet"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  category === cat && styles.categoryButtonActive,
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[
                  styles.categoryButtonText,
                  category === cat && styles.categoryButtonTextActive,
                ]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Visibility</Text>
          <View style={styles.visibilityContainer}>
            {visibilityOptions.map((vis) => (
              <TouchableOpacity
                key={vis}
                style={[
                  styles.visibilityButton,
                  visibility === vis && styles.visibilityButtonActive,
                ]}
                onPress={() => setVisibility(vis)}
              >
                <Text style={[
                  styles.visibilityButtonText,
                  visibility === vis && styles.visibilityButtonTextActive,
                ]}>{vis.charAt(0).toUpperCase() + vis.slice(1)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Stake Amount ($)</Text>
          <TextInput
            style={styles.input}
            value={stake}
            onChangeText={setStake}
            placeholder="Enter stake amount"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Options</Text>
          {options.map((option, index) => (
            <View key={index} style={styles.optionContainer}>
              <TextInput
                style={[styles.input, styles.optionInput]}
                value={option}
                onChangeText={(text) => handleOptionChange(text, index)}
                placeholder={`Option ${index + 1}`}
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveOption(index)}
              >
                <Ionicons name="close-circle" size={24} color="#ff4444" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={handleAddOption}>
            <Text style={styles.addButtonText}>+ Add Option</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Expiry Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{expiryDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={expiryDate}
              mode="date"
              display="default"
              onChange={(event: any, selectedDate?: Date) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setExpiryDate(selectedDate);
                }
              }}
              minimumDate={new Date()}
            />
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Invite Friends</Text>
          <View style={styles.inviteContainer}>
            <TextInput
              style={[styles.input, styles.emailInput]}
              value={friendEmail}
              onChangeText={setFriendEmail}
              placeholder="Enter friend's email"
              keyboardType="email-address"
            />
            <TouchableOpacity
              style={styles.inviteButton}
              onPress={handleAddFriend}
            >
              <Text style={styles.inviteButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          {invitedFriends.map((email, index) => (
            <View key={index} style={styles.friendItem}>
              <Text style={styles.friendEmail}>{email}</Text>
              <TouchableOpacity
                onPress={() => handleRemoveFriend(email)}
              >
                <Ionicons name="close-circle" size={20} color="#ff4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateBet}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.createButtonText}>Create Bet</Text>
          )}
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
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionInput: {
    flex: 1,
    marginRight: 8,
  },
  removeButton: {
    padding: 4,
  },
  addButton: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  dateButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  inviteContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  emailInput: {
    flex: 1,
    marginRight: 8,
  },
  inviteButton: {
    backgroundColor: '#0066cc',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  inviteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  friendEmail: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  createButton: {
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  visibilityContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  visibilityButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  visibilityButtonActive: {
    backgroundColor: '#0066cc',
    borderColor: '#0066cc',
  },
  visibilityButtonText: {
    fontSize: 16,
    color: '#333',
  },
  visibilityButtonTextActive: {
    color: '#fff',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoryButtonActive: {
    backgroundColor: '#0066cc',
    borderColor: '#0066cc',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#333',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
});

export default CreateBetScreen;