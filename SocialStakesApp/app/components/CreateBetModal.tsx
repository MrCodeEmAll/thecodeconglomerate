import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import { format } from 'date-fns';
import { useBetStore } from '../store/betStore';
import { CreateBetData } from '../types/bet';

interface CreateBetModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const CATEGORIES = ['Sports', 'E-Sports', 'Politics', 'Entertainment', 'Custom'] as const;

export const CreateBetModal: React.FC<CreateBetModalProps> = ({ isVisible, onClose }) => {
  const [formData, setFormData] = useState<CreateBetData>({
    title: '',
    description: '',
    category: 'Sports',
    options: [{ text: '', odds: 1 }],
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    visibility: 'public',
  });

  const addBet = useBetStore((state) => state.addBet);

  const handleAddOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, { text: '', odds: 1 }],
    }));
  };

  const handleCreateBet = async () => {
    try {
      if (!formData.title || !formData.description) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      if (formData.options.some((opt) => !opt.text)) {
        Alert.alert('Error', 'Please provide all betting options');
        return;
      }

      // In a real app, this would be created on the backend
      const newBet = {
        _id: Date.now().toString(),
        ...formData,
        creator: {
          _id: 'current-user-id',
          username: 'Current User',
          email: 'user@example.com',
          stats: { totalBets: 0, wins: 0, losses: 0, winRate: 0 },
          balance: 1000,
        },
        participants: [],
        totalPool: 0,
        status: 'open',
        outcome: null,
        createdAt: new Date().toISOString(),
      };

      addBet(newBet);

      // Generate sharing link
      const shareLink = `socialstakes://bet/${newBet._id}`;
      
      try {
        await Share.share({
          message: `Join my bet: ${formData.title}\n${shareLink}`,
          title: 'Join My Bet on SocialStakes',
        });
      } catch (error) {
        console.error('Error sharing bet:', error);
      }

      onClose();
      setFormData({
        title: '',
        description: '',
        category: 'Sports',
        options: [{ text: '', odds: 1 }],
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        visibility: 'public',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to create bet. Please try again.');
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection={['down']}
      style={styles.modal}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Create New Bet</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, title: text }))
              }
              placeholder="Enter bet title"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, description: text }))
              }
              placeholder="Enter bet description"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                {CATEGORIES.map((category) => (
                  <Picker.Item key={category} label={category} value={category} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Options</Text>
            {formData.options.map((option, index) => (
              <View key={index} style={styles.optionContainer}>
                <TextInput
                  style={[styles.input, styles.optionInput]}
                  value={option.text}
                  onChangeText={(text) => {
                    const newOptions = [...formData.options];
                    newOptions[index].text = text;
                    setFormData((prev) => ({ ...prev, options: newOptions }));
                  }}
                  placeholder={`Option ${index + 1}`}
                />
                <TextInput
                  style={[styles.input, styles.oddsInput]}
                  value={option.odds.toString()}
                  onChangeText={(text) => {
                    const newOptions = [...formData.options];
                    newOptions[index].odds = parseFloat(text) || 1;
                    setFormData((prev) => ({ ...prev, options: newOptions }));
                  }}
                  placeholder="Odds"
                  keyboardType="numeric"
                />
              </View>
            ))}
            <TouchableOpacity style={styles.addButton} onPress={handleAddOption}>
              <Text style={styles.addButtonText}>+ Add Option</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Visibility</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.visibility}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, visibility: value }))
                }
              >
                <Picker.Item label="Public" value="public" />
                <Picker.Item label="Friends Only" value="friends" />
                <Picker.Item label="Private" value="private" />
              </Picker>
            </View>
          </View>

          <TouchableOpacity style={styles.createButton} onPress={handleCreateBet}>
            <Text style={styles.createButtonText}>Create & Share Bet</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  optionContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  optionInput: {
    flex: 3,
    marginRight: 8,
  },
  oddsInput: {
    flex: 1,
  },
  addButton: {
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#0066cc',
    fontWeight: '500',
  },
  createButton: {
    backgroundColor: '#0066cc',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateBetModal; 