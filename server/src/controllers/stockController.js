const axios = require('axios');
const NodeCache = require('node-cache');
const apiConfig = require('../config/apiConfig');
const { asyncHandler, successResponse } = require('../middleware/errorHandler');

const cache = new NodeCache({ stdTTL: apiConfig.cache.ttl });

// Get stock overview
const getStockOverview = asyncHandler(async (req, res) => {
  const { symbol } = req.params;
  const cacheKey = `overview_${symbol.toUpperCase()}`;

  // Check cache first
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return successResponse(res, cachedData, 'Stock overview retrieved from cache');
  }

  const response = await axios.get(`${apiConfig.alphaVantage.baseURL}/query`, {
    params: {
      function: 'OVERVIEW',
      symbol: symbol.toUpperCase(),
      apikey: apiConfig.alphaVantage.apiKey,
    },
  });

  if (!response.data || response.data.Note) {
    throw new Error('API rate limit exceeded. Please try again later.');
  }

  if (!response.data.Symbol) {
    throw new Error('Stock symbol not found');
  }

  const formattedData = {
    symbol: response.data.Symbol,
    name: response.data.Name,
    description: response.data.Description,
    exchange: response.data.Exchange,
    sector: response.data.Sector,
    industry: response.data.Industry,
    marketCap: response.data.MarketCapitalization,
    peRatio: response.data.PERatio,
    dividendYield: response.data.DividendYield,
    week52High: response.data['52WeekHigh'],
    week52Low: response.data['52WeekLow'],
    beta: response.data.Beta,
    eps: response.data.EPS,
    currentPrice: response.data['50DayMovingAverage'],
  };

  cache.set(cacheKey, formattedData);
  successResponse(res, formattedData, 'Stock overview retrieved successfully');
});

// Get time series data
const getTimeSeries = asyncHandler(async (req, res) => {
  const { symbol, range } = req.params;
  const cacheKey = `timeseries_${symbol.toUpperCase()}_${range}`;

  // Check cache
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return successResponse(res, cachedData, 'Time series data retrieved from cache');
  }

  let functionType, interval, outputSize;
  
  switch (range) {
    case '1d':
      functionType = 'TIME_SERIES_INTRADAY';
      interval = '5min';
      outputSize = 'compact';
      break;
    case '1w':
    case '1m':
    case '3m':
      functionType = 'TIME_SERIES_DAILY';
      outputSize = 'compact';
      break;
    case '6m':
      functionType = 'TIME_SERIES_WEEKLY';
      outputSize = 'compact';
      break;
    case '1y':
    case 'all':
      functionType = 'TIME_SERIES_MONTHLY';
      outputSize = 'full';
      break;
    default:
      functionType = 'TIME_SERIES_DAILY';
      outputSize = 'compact';
  }

  const params = {
    function: functionType,
    symbol: symbol.toUpperCase(),
    apikey: apiConfig.alphaVantage.apiKey,
    outputsize: outputSize,
  };

  if (interval) {
    params.interval = interval;
  }

  const response = await axios.get(`${apiConfig.alphaVantage.baseURL}/query`, { params });

  if (!response.data || response.data.Note) {
    throw new Error('API rate limit exceeded. Please try again later.');
  }

  const timeSeriesKey = Object.keys(response.data).find(key => key.includes('Time Series'));
  if (!timeSeriesKey) {
    throw new Error('Invalid response from API');
  }

  const timeSeries = response.data[timeSeriesKey];
  const formattedData = Object.entries(timeSeries).map(([time, values]) => ({
    time,
    price: parseFloat(values['4. close']),
    open: parseFloat(values['1. open']),
    high: parseFloat(values['2. high']),
    low: parseFloat(values['3. low']),
    volume: parseInt(values['5. volume']),
  })).reverse();

  const result = {
    symbol: symbol.toUpperCase(),
    range,
    data: formattedData,
  };

  cache.set(cacheKey, result);
  successResponse(res, result, 'Time series data retrieved successfully');
});

// Get top gainers
const getTopGainers = asyncHandler(async (req, res) => {
  const cacheKey = 'top_gainers';

  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return successResponse(res, cachedData, 'Top gainers retrieved from cache');
  }

  const response = await axios.get('https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved', {
    params: {
      formatted: true,
      scrIds: 'day_gainers',
      count: 10,
      region: 'US',
      lang: 'en-US'
    },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });

  if (!response.data || !response.data.finance) {
    throw new Error('Unable to fetch top gainers from Yahoo Finance');
  }

  const quotes = response.data?.finance?.result?.[0]?.quotes || [];
  
  const formattedGainers = quotes.map(stock => ({
    symbol: stock.symbol,
    name: stock.shortName || stock.longName || stock.symbol,
    price: stock.regularMarketPrice?.raw || stock.regularMarketPrice || 0,
    change: stock.regularMarketChange?.raw || stock.regularMarketChange || 0,
    changePercent: stock.regularMarketChangePercent?.raw || stock.regularMarketChangePercent || 0,
    volume: stock.regularMarketVolume?.raw || stock.regularMarketVolume || 0,
  }));

  cache.set(cacheKey, formattedGainers);
  successResponse(res, formattedGainers, 'Top gainers retrieved successfully');
});

const getTopLosers = asyncHandler(async (req, res) => {
  const cacheKey = 'top_losers';

  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return successResponse(res, cachedData, 'Top losers retrieved from cache');
  }

  const response = await axios.get('https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved', {
    params: {
      formatted: true,
      scrIds: 'day_losers',
      count: 10,
      region: 'US',
      lang: 'en-US'
    },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });

  if (!response.data || !response.data.finance) {
    throw new Error('Unable to fetch top losers from Yahoo Finance');
  }

  const quotes = response.data?.finance?.result?.[0]?.quotes || [];
  
  const formattedLosers = quotes.map(stock => ({
    symbol: stock.symbol,
    name: stock.shortName || stock.longName || stock.symbol,
    price: stock.regularMarketPrice?.raw || stock.regularMarketPrice || 0,
    change: stock.regularMarketChange?.raw || stock.regularMarketChange || 0,
    changePercent: stock.regularMarketChangePercent?.raw || stock.regularMarketChangePercent || 0,
    volume: stock.regularMarketVolume?.raw || stock.regularMarketVolume || 0,
  }));

  cache.set(cacheKey, formattedLosers);
  successResponse(res, formattedLosers, 'Top losers retrieved successfully');
});

// Get company logo
const getCompanyLogo = asyncHandler(async (req, res) => {
  const { domain } = req.params;
  
  // Redirect to Clearbit logo API
  const logoUrl = `${apiConfig.clearbit.logoURL}/${domain}`;
  res.redirect(logoUrl);
});

module.exports = {
  getStockOverview,
  getTimeSeries,
  getTopGainers,
  getTopLosers,
  getCompanyLogo,
};
