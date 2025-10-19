import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllWatchlists, addToWatchlist as apiAddToWatchlist, removeFromWatchlist as apiRemoveFromWatchlist, deleteWatchlist as apiDeleteWatchlist } from '../api/stockService';

const WATCHLIST_STORAGE_KEY = '@stock_app_watchlists';

const useWatchlistStore = create((set, get) => ({
  watchlists: [],
  loading: false,
  error: null,

  // Load watchlists from AsyncStorage on app start
  loadWatchlists: async () => {
    try {
      set({ loading: true, error: null });
      
      // Try to get from local storage first
      const storedData = await AsyncStorage.getItem(WATCHLIST_STORAGE_KEY);
      if (storedData) {
        const parsed = JSON.parse(storedData);
        set({ watchlists: parsed, loading: false });
      } else {
        // Fetch from API if no local data
        const response = await getAllWatchlists();
        const watchlists = response.data || [];
        set({ watchlists, loading: false });
        await AsyncStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlists));
      }
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error('Error loading watchlists:', error);
    }
  },

  // Refresh watchlists from API
  refreshWatchlists: async () => {
    try {
      set({ loading: true, error: null });
      const response = await getAllWatchlists();
      const watchlists = response.data || [];
      set({ watchlists, loading: false });
      await AsyncStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlists));
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error('Error refreshing watchlists:', error);
    }
  },

  // Add stock to watchlist
  addStock: async (watchlistName, symbol, createNew = false) => {
    try {
      set({ error: null });
      await apiAddToWatchlist(watchlistName, symbol, createNew);
      await get().refreshWatchlists();
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Remove stock from watchlist
  removeStock: async (symbol, watchlistName) => {
    try {
      set({ error: null });
      await apiRemoveFromWatchlist(symbol, watchlistName);
      await get().refreshWatchlists();
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Check if stock is in any watchlist
  isStockInWatchlist: (symbol) => {
    const { watchlists } = get();
    return watchlists.some(wl => wl.stocks.includes(symbol.toUpperCase()));
  },

  // Delete watchlist
  deleteWatchlist: async (watchlistName) => {
    try {
      set({ error: null });
      await apiDeleteWatchlist(watchlistName);
      await get().refreshWatchlists();
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Get watchlist names
  getWatchlistNames: () => {
    const { watchlists } = get();
    return watchlists.map(wl => wl.name);
  },
}));

export default useWatchlistStore;
