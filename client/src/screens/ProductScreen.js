import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import ChartView from '../components/ChartView';
import AddToWatchlistModal from '../components/AddToWatchlistModal';
import { getStockOverview, getTimeSeries } from '../api/stockService';
import { formatCurrency, formatPercentage, formatNumber, getPercentageColor } from '../utils/formatters';
import useWatchlistStore from '../store/watchlistStore';

const TIME_RANGES = ['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL'];

const ProductScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { symbol } = route.params;
  
  const [overview, setOverview] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [selectedRange, setSelectedRange] = useState('1M');
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  
  const { isStockInWatchlist } = useWatchlistStore();
  const isInWatchlist = isStockInWatchlist(symbol);

  useEffect(() => {
    fetchStockData();
  }, [symbol]);

  useEffect(() => {
    fetchTimeSeries(selectedRange);
  }, [selectedRange]);

  const fetchStockData = async () => {
    try {
      setLoading(true);
      const overviewRes = await getStockOverview(symbol);
      setOverview(overviewRes.data);
    } catch (error) {
      console.error('Error fetching stock overview:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeSeries = async (range) => {
    try {
      const rangeMap = {
        '1D': '1d',
        '1W': '1w',
        '1M': '1m',
        '3M': '3m',
        '6M': '6m',
        '1Y': '1y',
        'ALL': 'all',
      };
      
      const timeSeriesRes = await getTimeSeries(symbol, rangeMap[range]);
      setChartData(timeSeriesRes.data?.data || []);
    } catch (error) {
      console.error('Error fetching time series:', error);
    }
  };

  const handleRangeSelect = (range) => {
    setSelectedRange(range);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!overview) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Stock data not available</Text>
      </View>
    );
  }

  const changePercent = chartData.length > 0 
    ? ((chartData[chartData.length - 1]?.price - chartData[0]?.price) / chartData[0]?.price * 100)
    : 0;

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Details Screen</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.bookmarkIcon}>{isInWatchlist ? '★' : '☆'}</Text>
          </TouchableOpacity>
        </View>

        {/* Stock Info */}
        <View style={styles.stockInfo}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>{symbol.charAt(0)}</Text>
          </View>
          <View style={styles.stockDetails}>
            <Text style={styles.companyName}>{overview.name}</Text>
            <Text style={styles.stockSymbol}>{symbol}:{overview.exchange}</Text>
          </View>
          <View style={styles.priceInfo}>
            <Text style={styles.price}>{formatCurrency(overview.currentPrice)}</Text>
            <Text style={[styles.change, { color: getPercentageColor(changePercent) }]}>
              {formatPercentage(changePercent)}
            </Text>
          </View>
        </View>

        {/* Chart */}
        <ChartView data={chartData} range={selectedRange} />

        {/* Time Range Selector */}
        <View style={styles.rangeSelector}>
          {TIME_RANGES.map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.rangeButton,
                selectedRange === range && styles.rangeButtonActive,
              ]}
              onPress={() => handleRangeSelect(range)}
            >
              <Text
                style={[
                  styles.rangeText,
                  selectedRange === range && styles.rangeTextActive,
                ]}
              >
                {range}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{overview.description}</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Industry:</Text>
              <Text style={styles.infoValue}>{overview.industry}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Sector:</Text>
              <Text style={styles.infoValue}>{overview.sector}</Text>
            </View>
          </View>
        </View>

        {/* Key Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Market Cap</Text>
              <Text style={styles.statValue}>{formatCurrency(overview.marketCap)}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>P/E Ratio</Text>
              <Text style={styles.statValue}>{overview.peRatio || 'N/A'}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Dividend Yield</Text>
              <Text style={styles.statValue}>{overview.dividendYield ? `${(parseFloat(overview.dividendYield) * 100).toFixed(2)}%` : 'N/A'}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>52 Week High</Text>
              <Text style={styles.statValue}>{formatCurrency(overview.week52High)}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>52 Week Low</Text>
              <Text style={styles.statValue}>{formatCurrency(overview.week52Low)}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Volume</Text>
              <Text style={styles.statValue}>{formatNumber(chartData[chartData.length - 1]?.volume || 0)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <AddToWatchlistModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        symbol={symbol}
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
  errorText: {
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    fontSize: 28,
    color: '#111827',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  bookmarkIcon: {
    fontSize: 28,
    color: '#111827',
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  logoPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#6B7280',
  },
  stockDetails: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  stockSymbol: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10B981',
  },
  change: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  rangeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  rangeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  rangeButtonActive: {
    backgroundColor: '#2563EB',
  },
  rangeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  rangeTextActive: {
    color: '#FFFFFF',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
  },
  infoItem: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
});

export default ProductScreen;
