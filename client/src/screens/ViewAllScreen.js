import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import StockCard from '../components/StockCard';
import { getTopGainers, getTopLosers, getStockOverview } from '../api/stockService';

const ViewAllScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { type, watchlistName, stocks: watchlistStocks } = route.params;
  
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchStocks();
  }, [type]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStocks(stocks);
    } else {
      const filtered = stocks.filter(stock => 
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (stock.name && stock.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredStocks(filtered);
    }
  }, [searchQuery, stocks]);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      
      if (type === 'gainers') {
        const response = await getTopGainers();
        setStocks(response.data || []);
        setFilteredStocks(response.data || []);
      } else if (type === 'losers') {
        const response = await getTopLosers();
        setStocks(response.data || []);
        setFilteredStocks(response.data || []);
      } else if (type === 'watchlist' && watchlistStocks) {
        // Fetch details for watchlist stocks
        const stockDetails = await Promise.all(
          watchlistStocks.map(async (symbol) => {
            try {
              const response = await getStockOverview(symbol);
              return {
                symbol,
                name: response.data?.name || symbol,
                price: response.data?.currentPrice || 0,
                changePercent: 0,
              };
            } catch (error) {
              return {
                symbol,
                name: symbol,
                price: 0,
                changePercent: 0,
              };
            }
          })
        );
        setStocks(stockDetails);
        setFilteredStocks(stockDetails);
      }
    } catch (error) {
      console.error('Error fetching stocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStockPress = (stock) => {
    navigation.navigate('Product', { symbol: stock.symbol });
  };

  const getTitle = () => {
    if (type === 'gainers') return 'Top Gainers';
    if (type === 'losers') return 'Top Losers';
    if (type === 'watchlist') return watchlistName || 'Watchlist';
    return 'Stocks';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{getTitle()}</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍︎</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for stocks..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Stock List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <ScrollView style={styles.stockList}>
          {filteredStocks.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No stocks found</Text>
            </View>
          ) : (
            filteredStocks.map((stock, index) => (
              <StockCard
                key={index}
                stock={stock}
                onPress={() => handleStockPress(stock)}
                variant="list"
              />
            ))
          )}
        </ScrollView>
      )}

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    fontSize: 28,
    color: '#111827',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  stockList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  paginationButton: {
    flex: 1,
    backgroundColor: '#EBF5FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  paginationButtonDisabled: {
    backgroundColor: '#F3F4F6',
  },
  paginationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
});

export default ViewAllScreen;
