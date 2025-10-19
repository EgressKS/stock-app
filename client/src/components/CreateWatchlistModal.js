import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import { createWatchlist } from '../api/stockService';
import useWatchlistStore from '../store/watchlistStore';

const CreateWatchlistModal = ({ visible, onClose }) => {
  const [watchlistName, setWatchlistName] = useState('');
  const [loading, setLoading] = useState(false);
  const { refreshWatchlists } = useWatchlistStore();

  const handleCreate = async () => {
    if (!watchlistName.trim()) {
      alert('Please enter a watchlist name');
      return;
    }

    try {
      setLoading(true);
      await createWatchlist(watchlistName.trim());
      await refreshWatchlists();
      alert(`Watchlist "${watchlistName.trim()}" created successfully!`);
      setLoading(false);
      setWatchlistName('');
      onClose();
    } catch (error) {
      setLoading(false);
      console.error('Error creating watchlist:', error);
      alert(error.error || 'Failed to create watchlist');
    }
  };

  const handleCancel = () => {
    setWatchlistName('');
    onClose();
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={handleCancel}
      onBackButtonPress={handleCancel}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <View style={styles.modalContent}>
        <Text style={styles.title}>Create New Watchlist</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Watchlist Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 'Tech Stocks', 'Dividend Payers'"
            placeholderTextColor="#9CA3AF"
            value={watchlistName}
            onChangeText={setWatchlistName}
            autoFocus
          />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={handleCancel}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.createButton} 
            onPress={handleCreate}
            disabled={loading || !watchlistName.trim()}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.createButtonText}>Create</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    color: '#111827',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  createButton: {
    flex: 1,
    backgroundColor: '#1E3A8A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default CreateWatchlistModal;
