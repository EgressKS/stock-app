import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import useWatchlistStore from '../store/watchlistStore';

const AddToWatchlistModal = ({ visible, onClose, symbol }) => {
  const [selectedWatchlist, setSelectedWatchlist] = useState('');
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { watchlists, addStock, getWatchlistNames } = useWatchlistStore();
  const watchlistNames = getWatchlistNames();

  useEffect(() => {
    if (watchlistNames.length > 0 && !selectedWatchlist) {
      setSelectedWatchlist(watchlistNames[0]);
    }
  }, [watchlistNames]);

  const handleSave = async () => {
    if (!isCreatingNew && !selectedWatchlist) {
      alert('Please select a watchlist or create a new one');
      return;
    }

    try {
      setLoading(true);
      
      if (isCreatingNew && newWatchlistName.trim()) {
        await addStock(newWatchlistName.trim(), symbol, true);
        alert(`${symbol} added to "${newWatchlistName.trim()}" successfully!`);
      } else if (selectedWatchlist) {
        await addStock(selectedWatchlist, symbol, false);
        alert(`${symbol} added to "${selectedWatchlist}" successfully!`);
      }
      
      setLoading(false);
      setNewWatchlistName('');
      setIsCreatingNew(false);
      onClose();
    } catch (error) {
      setLoading(false);
      console.error('Error adding to watchlist:', error);
      alert('Failed to add stock to watchlist');
    }
  };

  const handleCancel = () => {
    setNewWatchlistName('');
    setIsCreatingNew(false);
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
        <Text style={styles.title}>Add to Watchlist</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Select Watchlist</Text>
          <View style={styles.watchlistOptions}>
            {watchlistNames.map((name, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.watchlistOption,
                  selectedWatchlist === name && styles.watchlistOptionSelected,
                ]}
                onPress={() => {
                  setSelectedWatchlist(name);
                  setIsCreatingNew(false);
                  setNewWatchlistName('');
                }}
              >
                <Text
                  style={[
                    styles.watchlistOptionText,
                    selectedWatchlist === name && styles.watchlistOptionTextSelected,
                  ]}
                >
                  {name}
                </Text>
                {selectedWatchlist === name && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
            {watchlistNames.length === 0 && (
              <Text style={styles.noWatchlistsText}>
                No watchlists yet. Create one below.
              </Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Or Create New Watchlist</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 'EV Stocks'"
            placeholderTextColor="#9CA3AF"
            value={newWatchlistName}
            onChangeText={(text) => {
              setNewWatchlistName(text);
              setIsCreatingNew(text.trim().length > 0);
            }}
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
            style={[
              styles.saveButton,
              (!isCreatingNew && !selectedWatchlist) && styles.saveButtonDisabled
            ]} 
            onPress={handleSave}
            disabled={loading || (!isCreatingNew && !selectedWatchlist)}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
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
  watchlistOptions: {
    gap: 8,
  },
  watchlistOption: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  watchlistOptionSelected: {
    backgroundColor: '#EBF5FF',
    borderColor: '#2563EB',
  },
  watchlistOptionText: {
    fontSize: 16,
    color: '#374151',
  },
  watchlistOptionTextSelected: {
    color: '#2563EB',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 18,
    color: '#2563EB',
    fontWeight: '700',
  },
  noWatchlistsText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    padding: 16,
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
  saveButton: {
    flex: 1,
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default AddToWatchlistModal;
