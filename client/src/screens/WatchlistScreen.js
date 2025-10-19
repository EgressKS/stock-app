import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import WatchlistCard from '../components/WatchlistCard';
import CreateWatchlistModal from '../components/CreateWatchlistModal';
import useWatchlistStore from '../store/watchlistStore';

const WatchlistScreen = () => {
  const navigation = useNavigation();
  const { watchlists, loading, loadWatchlists } = useWatchlistStore();
  const [createModalVisible, setCreateModalVisible] = useState(false);

  useEffect(() => {
    loadWatchlists();
  }, []);

  const handleWatchlistPress = (watchlist) => {
    navigation.navigate('ViewAll', { 
      type: 'watchlist',
      watchlistName: watchlist.name,
      stocks: watchlist.stocks,
    });
  };

  const { deleteWatchlist } = useWatchlistStore();

  const handleAddWatchlist = () => {
    setCreateModalVisible(true);
  };

  const handleMenuPress = (watchlist) => {
    Alert.alert(
      'Delete Watchlist',
      `Are you sure you want to delete "${watchlist.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteWatchlist(watchlist.name);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete watchlist. Please try again.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Watchlists</Text>
      </View>
      <View style={styles.horizontalLine} />
      

      <ScrollView style={styles.content}>
        {watchlists.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No watchlists yet</Text>
            <Text style={styles.emptySubtext}>
              Create a watchlist to track your favorite stocks
            </Text>
          </View>
        ) : (
          watchlists.map((watchlist, index) => (
            <WatchlistCard
              key={index}
              watchlist={watchlist}
              onPress={() => handleWatchlistPress(watchlist)}
              onMenuPress={() => handleMenuPress(watchlist)}
            />
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={handleAddWatchlist}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      <CreateWatchlistModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 25,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop:20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  horizontalLine: {
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 20,
    marginTop:-10,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 15,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1E3A8A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '300',
  },
});

export default WatchlistScreen;
