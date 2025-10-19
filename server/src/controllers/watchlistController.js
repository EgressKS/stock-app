const { asyncHandler, successResponse } = require('../middleware/errorHandler');

// In-memory storage for demo purposes
let watchlists = {
  'Tech Giants': ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'META', 'NVDA', 'TSLA', 'NFLX', 'ADBE', 'CRM', 'ORCL', 'IBM'],
  'Growth Stocks': ['TSLA', 'NVDA', 'SQ', 'SHOP', 'ROKU'],
  'Dividend Payers': ['JNJ', 'PG', 'KO', 'PEP', 'MCD', 'WMT', 'VZ', 'T'],
};

// Get all watchlists
const getAllWatchlists = asyncHandler(async (req, res) => {
  const formattedWatchlists = Object.entries(watchlists).map(([name, stocks]) => ({
    name,
    stockCount: stocks.length,
    stocks,
  }));

  successResponse(res, formattedWatchlists, 'Watchlists retrieved successfully');
});

// Add stock to watchlist
const addToWatchlist = asyncHandler(async (req, res) => {
  const { watchlistName, symbol, createNew } = req.body;

  if (!symbol) {
    const error = new Error('Stock symbol is required');
    error.statusCode = 400;
    throw error;
  }

  let targetWatchlist = watchlistName;

  // Create new watchlist if requested
  if (createNew && watchlistName) {
    if (!watchlists[watchlistName]) {
      watchlists[watchlistName] = [];
    }
    targetWatchlist = watchlistName;
  }

  // Default to first watchlist if none specified
  if (!targetWatchlist) {
    targetWatchlist = Object.keys(watchlists)[0] || 'My Favorites';
    if (!watchlists[targetWatchlist]) {
      watchlists[targetWatchlist] = [];
    }
  }

  // Check if watchlist exists
  if (!watchlists[targetWatchlist]) {
    const error = new Error('Watchlist not found');
    error.statusCode = 404;
    throw error;
  }

  // Add symbol if not already present
  const upperSymbol = symbol.toUpperCase();
  if (!watchlists[targetWatchlist].includes(upperSymbol)) {
    watchlists[targetWatchlist].push(upperSymbol);
  }

  successResponse(res, {
    watchlistName: targetWatchlist,
    symbol: upperSymbol,
    stocks: watchlists[targetWatchlist],
  }, 'Stock added to watchlist successfully');
});

// Remove stock from watchlist
const removeFromWatchlist = asyncHandler(async (req, res) => {
  const { symbol } = req.params;
  const { watchlistName } = req.body;

  if (!watchlistName) {
    const error = new Error('Watchlist name is required');
    error.statusCode = 400;
    throw error;
  }

  if (!watchlists[watchlistName]) {
    const error = new Error('Watchlist not found');
    error.statusCode = 404;
    throw error;
  }

  const upperSymbol = symbol.toUpperCase();
  watchlists[watchlistName] = watchlists[watchlistName].filter(s => s !== upperSymbol);

  successResponse(res, {
    watchlistName,
    symbol: upperSymbol,
    remainingStocks: watchlists[watchlistName],
  }, 'Stock removed from watchlist successfully');
});

// Create new watchlist
const createWatchlist = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    const error = new Error('Watchlist name is required');
    error.statusCode = 400;
    throw error;
  }

  if (watchlists[name]) {
    const error = new Error('Watchlist already exists');
    error.statusCode = 409;
    throw error;
  }

  watchlists[name] = [];

  successResponse(res, {
    name,
    stocks: [],
  }, 'Watchlist created successfully', 201);
});

// Delete watchlist
const deleteWatchlist = asyncHandler(async (req, res) => {
  const { name } = req.params;

  if (!name) {
    const error = new Error('Watchlist name is required');
    error.statusCode = 400;
    throw error;
  }

  if (!watchlists[name]) {
    const error = new Error('Watchlist not found');
    error.statusCode = 404;
    throw error;
  }

  delete watchlists[name];

  successResponse(res, {
    name,
  }, 'Watchlist deleted successfully');
});

module.exports = {
  getAllWatchlists,
  addToWatchlist,
  removeFromWatchlist,
  createWatchlist,
  deleteWatchlist,
};
