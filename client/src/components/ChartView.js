import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const ChartView = ({ data, range }) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No chart data available</Text>
      </View>
    );
  }

  const screenWidth = Dimensions.get('window').width;
  
  // Prepare data for the chart
  const chartData = data.slice(-50);
  const prices = chartData.map(d => d.price);
  const labels = chartData.map((d, i) => i % 10 === 0 ? '' : '');

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceChange = prices[prices.length - 1] - prices[0];
  const chartColor = priceChange >= 0 ? '#10B981' : '#EF4444';

  return (
    <View style={styles.container}>
      <LineChart
        data={{
          labels: labels,
          datasets: [{
            data: prices,
          }],
        }}
        width={screenWidth - 32}
        height={220}
        chartConfig={{
          backgroundColor: '#FFFFFF',
          backgroundGradientFrom: '#FFFFFF',
          backgroundGradientTo: '#FFFFFF',
          decimalPlaces: 2,
          color: (opacity = 1) => chartColor,
          labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '0',
          },
          propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: '#E5E7EB',
            strokeWidth: 1,
          },
        }}
        bezier
        style={styles.chart}
        withVerticalLines={false}
        withHorizontalLines={true}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLabels={false}
        withHorizontalLabels={true}
        fromZero={false}
        segments={4}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  emptyContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    marginVertical: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
});

export default ChartView;
