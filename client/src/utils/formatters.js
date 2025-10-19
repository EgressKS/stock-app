// Format currency values
export const formatCurrency = (value) => {
  if (!value) return '$0.00';
  
  const num = parseFloat(value);
  
  if (num >= 1e12) {
    return `$${(num / 1e12).toFixed(2)}T`;
  } else if (num >= 1e9) {
    return `$${(num / 1e9).toFixed(2)}B`;
  } else if (num >= 1e6) {
    return `$${(num / 1e6).toFixed(2)}M`;
  } else if (num >= 1e3) {
    return `$${(num / 1e3).toFixed(2)}K`;
  }
  
  return `$${num.toFixed(2)}`;
};

// Format percentage
export const formatPercentage = (value) => {
  if (!value) return '0.00%';
  const num = parseFloat(value);
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
};

// Format large numbers
export const formatNumber = (value) => {
  if (!value) return '0';
  
  const num = parseFloat(value);
  
  if (num >= 1e9) {
    return `${(num / 1e9).toFixed(2)}B`;
  } else if (num >= 1e6) {
    return `${(num / 1e6).toFixed(2)}M`;
  } else if (num >= 1e3) {
    return `${(num / 1e3).toFixed(2)}K`;
  }
  
  return num.toFixed(0);
};

// Get percentage color
export const getPercentageColor = (value) => {
  const num = parseFloat(value);
  if (num > 0) return '#10B981'; 
  if (num < 0) return '#EF4444'; 
  return '#6B7280'; 
};

// Format stock symbol for logo domain
export const getStockDomain = (symbol) => {
  const domainMap = {
    'AAPL': 'apple.com',
    'GOOGL': 'google.com',
    'GOOG': 'google.com',
    'MSFT': 'microsoft.com',
    'AMZN': 'amazon.com',
    'META': 'meta.com',
    'TSLA': 'tesla.com',
    'NVDA': 'nvidia.com',
    'NFLX': 'netflix.com',
    'ADBE': 'adobe.com',
    'CRM': 'salesforce.com',
    'ORCL': 'oracle.com',
    'IBM': 'ibm.com',
    'JNJ': 'jnj.com',
    'PG': 'pg.com',
    'KO': 'coca-cola.com',
    'PEP': 'pepsico.com',
    'MCD': 'mcdonalds.com',
    'WMT': 'walmart.com',
    'VZ': 'verizon.com',
    'T': 'att.com',
  };
  
  return domainMap[symbol.toUpperCase()] || `${symbol.toLowerCase()}.com`;
};

// Format date
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
