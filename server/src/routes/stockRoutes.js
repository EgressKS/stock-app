const express = require('express');
const router = express.Router();
const {
  getStockOverview,
  getTimeSeries,
  getTopGainers,
  getTopLosers,
  getCompanyLogo,
} = require('../controllers/stockController');
const {
  getAllWatchlists,
  addToWatchlist,
  removeFromWatchlist,
  createWatchlist,
  deleteWatchlist,
} = require('../controllers/watchlistController');

// Stock routes
router.get('/stocks/overview/:symbol', getStockOverview);
router.get('/stocks/time-series/:symbol/:range', getTimeSeries);
router.get('/stocks/gainers', getTopGainers);
router.get('/stocks/losers', getTopLosers);
router.get('/stocks/logo/:symbol', getCompanyLogo);

// Watchlist routes
router.get('/watchlist', getAllWatchlists);
router.post('/watchlist/add', addToWatchlist);
router.delete('/watchlist/remove/:symbol', removeFromWatchlist);
router.post('/watchlist/create', createWatchlist);
router.delete('/watchlist/:name', deleteWatchlist);

module.exports = router;
