import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import StockCard from '../components/StockCard';
import { getTopGainers, getTopLosers } from '../api/stockService';

const ExploreScreen = () => {
  const navigation = useNavigation();
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  const fetchData = async () => {
    try {
      const [gainersRes, losersRes] = await Promise.all([
        getTopGainers(),
        getTopLosers(),
      ]);
      
      setGainers(gainersRes.data || []);
      setLosers(losersRes.data || []);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleStockPress = (stock) => {
    navigation.navigate('Product', { symbol: stock.symbol });
  };

  const handleViewAll = (type) => {
    navigation.navigate('ViewAll', { type });
  };

  const handleSearchPress = () => {
    setIsSearchActive(true);
  };

  const handleSearchClose = () => {
    setIsSearchActive(false);
    setSearchText('');
  };

  const handleSearchSubmit = () => {
    setIsSearchActive(false);
  };

  const filterStocks = (stocks) => {
    if (!searchText.trim()) return stocks;
    return stocks.filter(stock =>
      (stock.name && stock.name.toLowerCase().includes(searchText.toLowerCase())) ||
      (stock.symbol && stock.symbol.toLowerCase().includes(searchText.toLowerCase()))
    );
  };

  const filteredGainers = filterStocks(gainers);
  const filteredLosers = filterStocks(losers);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.appName}>Stock App</Text>
        {isSearchActive ? (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search stocks..."
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearchSubmit}
              autoFocus={true}
            />
            <TouchableOpacity onPress={handleSearchClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={handleSearchPress}>
            <Text style={styles.searchIcon}>🔍︎</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.horizontalLine} />

      {/* Top Gainers Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Gainers</Text>
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => handleViewAll('gainers')}
        >
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
        </View>
        <View style={styles.grid}>
          {filteredGainers.slice(0, 2).map((stock, index) => (
            <View key={index} style={styles.gridItem}>
              <StockCard
                stock={stock}
                onPress={() => handleStockPress(stock)}
                variant="grid"
              />
            </View>
          ))}
        </View> 
      </View>

      {/* Top Losers Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Losers</Text>
          <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => handleViewAll('losers')}
        >
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
        </View>
        
        <View style={styles.grid}>
          {filteredLosers.slice(0, 2).map((stock, index) => (
            <View key={index} style={styles.gridItem}>
              <StockCard
                stock={stock}
                onPress={() => handleStockPress(stock)}
                variant="grid"
              />
            </View>
          ))}
        </View>

        
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    paddingTop: 40,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  searchIcon: {
    fontSize: 24,
  },
  horizontalLine: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
    marginTop:10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  gridItem: {
    width: '48%',
  },
  viewAllButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 8,
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    marginRight: 3,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#374151',
  },
});

export default ExploreScreen;
