import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { formatCurrency, formatPercentage, getPercentageColor, getStockDomain } from '../utils/formatters';
import { getTimeSeries } from '../api/stockService';

const StockCard = ({ stock, onPress, variant = 'grid' }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [0] }]
  });
  
  const changeColor = getPercentageColor(stock.changePercent || stock.change);
  const domain = getStockDomain(stock.symbol);
  const logoUrl = `http://localhost:3000/api/stocks/logo/${domain}`;

  useEffect(() => {
    fetchChartData();
  }, [stock.symbol]);

  const fetchChartData = async () => {
    try {
      const response = await getTimeSeries(stock.symbol, '1m');
      const timeSeriesData = response.data?.data || [];
      setChartData({
        labels: [],
        datasets: [{
          data: timeSeriesData.map(item => item.price),
          strokeWidth: 2,
        }]
      });
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setChartData({
        labels: [],
        datasets: [{ data: [0] }]
      });
    }
  };

  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: 'transparent',
    backgroundGradientTo: 'transparent',
    decimalPlaces: 0,
    color: (opacity = 1) => changeColor,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontSize: 10,
    },
    propsForDots: {
      r: '0',
    }
  };

  if (variant === 'list') {
    return (
      <TouchableOpacity style={styles.listCard} onPress={onPress}>
        <View style={styles.listLeft}>
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: logoUrl }}
              style={styles.logo}
              defaultSource={require('../../assets/placeholder.png')}
            />
          </View>
          <View style={styles.listInfo}>
            <Text style={styles.companyName} numberOfLines={1} ellipsizeMode="tail">
              {stock.name || stock.symbol}
            </Text>
            <Text style={styles.symbol}>{stock.symbol}</Text>
          </View>
        </View>
        <View style={styles.listRight}>
          <Text style={styles.price}>{formatCurrency(stock.price)}</Text>
          <Text style={[styles.change, { color: changeColor }]}>
            {formatPercentage(stock.changePercent || stock.change)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.gridCard} onPress={onPress}>
      <View style={styles.cardHeader}>
        <View style={styles.headerContent}>
          <Text style={styles.companyName} numberOfLines={2} ellipsizeMode="tail">
            {stock.name || stock.symbol}
          </Text>
          <Text style={styles.symbol}>{stock.symbol}</Text>
        </View>
      </View>
      
      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={Dimensions.get('window').width * 0.42} 
          height={60}
          chartConfig={chartConfig}
          bezier
          withDots={false}
          withShadow={false}
          withInnerLines={false}
          withOuterLines={false}
          withHorizontalLabels={false}
          withVerticalLabels={false}
          withHorizontalLines={false}
          withVerticalLines={false}
          style={styles.chart}
          getDotProps={() => ({
            r: '0',
            strokeWidth: '0',
          })}
          segments={2}
        />
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.price}>{formatCurrency(stock.price)}</Text>
        <Text style={[styles.changeText, { color: changeColor }]}>
          {formatPercentage(stock.changePercent || stock.change)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gridCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    minHeight: 180,
  },
  listCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 12,
    flex: 1,
  },
  headerContent: {
    flex: 1,
    marginBottom: 4,
  },
  listLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  listRight: {
    alignItems: 'flex-end',
    minWidth: 80,
    justifyContent: 'center',
  },
  listInfo: {
    marginLeft: 12,
    flex: 1,
    marginRight: 8,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  symbol: {
    fontSize: 14,
    color: '#6B7280',
  },
  chartContainer: {
    height: 80,
    marginVertical: 12,
    alignItems: 'center',
    width: '100%', 
    overflow: 'hidden', 
  },
  
  chart: {
    marginVertical: 0,
    paddingVertical: 0,
    marginLeft: -15, 
    marginRight: -15, 
  },
  
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  change: {
    fontSize: 14,
    fontWeight: '600',
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default StockCard;
