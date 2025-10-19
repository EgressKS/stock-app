import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const WatchlistCard = ({ watchlist, onPress, onMenuPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.content}>
        <View>
          <Text style={styles.name}>{watchlist.name}</Text>
          <Text style={styles.stockCount}>{watchlist.stockCount} stocks</Text>
        </View>
        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={(e) => {
            e.stopPropagation();
            onMenuPress && onMenuPress();
          }}
        >
          <Text style={styles.menuIcon}>⋯</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  stockCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 24,
    color: '#6B7280',
    fontWeight: '700',
  },
});

export default WatchlistCard;
