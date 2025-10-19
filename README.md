# Stock Broking App

A production-ready mobile stock broking application built with React Native and Node.js + Express backend, integrating Alpha Vantage, Yahoo Finance, and Clearbit APIs.

## Project Structure

```
├── server/                 # Backend (Node.js + Express)
│   └── src/
│       ├── config/        # API configuration
│       ├── middleware/    # Error handling & middleware
│       ├── controllers/   # Business logic
│       └── routes/        # API routes
│
└── client/                # Frontend (React Native)
    └── src/
        ├── api/          # API service layer
        ├── components/   # Reusable UI components
        ├── screens/      # App screens
        ├── navigation/   # Navigation setup
        ├── store/        # State management
        └── utils/        # Utility functions
```

## Features

### Backend
- Stock overview data (Alpha Vantage)
- Time-series data with multiple ranges (1D, 1W, 1M, 3M, 6M, 1Y, ALL)
- Top gainers and losers
- Company logos (Clearbit)
- Watchlist management (in-memory)
- API response caching (10-minute expiry)
- Centralized error handling

### Frontend
- Explore screen with Top Gainers and Top Losers
- Product details screen with interactive charts
- Watchlist management with custom lists
- Search and filter functionality
- Bottom tab navigation (Explore & Watchlist)
- Bottom sheet modal for watchlist actions
- Loading, error, and empty states
- Clean, modern UI matching design specifications

## Prerequisites

- Node.js 18+ installed
- Alpha Vantage API key (get free at https://www.alphavantage.co/support/#api-key)

## Setup Instructions

### 1. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Configure environment variables
# Edit .env file and add your Alpha Vantage API key:
ALPHA_VANTAGE_KEY=your_actual_api_key_here
PORT=3000

# Start the server
npm start
```

The backend will run on `http://localhost:3000`

### 2. Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start the app
npm start
```

## API Endpoints

### Stock Endpoints
- `GET /api/stocks/overview/:symbol` - Get stock overview
- `GET /api/stocks/time-series/:symbol/:range` - Get historical data
- `GET /api/stocks/gainers` - Get top gaining stocks
- `GET /api/stocks/losers` - Get top losing stocks
- `GET /api/stocks/logo/:domain` - Get company logo

### Watchlist Endpoints
- `GET /api/watchlist` - Get all watchlists
- `POST /api/watchlist/add` - Add stock to watchlist
- `DELETE /api/watchlist/remove/:symbol` - Remove stock from watchlist
- `POST /api/watchlist/create` - Create new watchlist

## App Screens

1. **Explore Screen** - Browse top gainers and losers
2. **Product Screen** - Detailed stock information with charts
3. **Watchlist Screen** - Manage custom watchlists
4. **View All Screen** - Paginated stock listings with search

## Tech Stack

### Backend
- Node.js & Express.js
- Axios (API calls)
- Node-Cache (response caching)
- Cheerio (web scraping)

### Frontend
- React Native with Expo
- React Navigation (bottom tabs & stack)
- Zustand (state management)
- React Native Chart Kit (graphs)
- React Native Modal (bottom sheets)
- AsyncStorage (local persistence)

## Environment Variables

Create a `.env` file in the `server` directory:

```env
ALPHA_VANTAGE_KEY=your_alpha_vantage_api_key
PORT=3000
NODE_ENV=development
```

## Notes

- The watchlist data is stored in-memory on the backend (for demo purposes)
- API responses are cached for 10 minutes to reduce API calls
- The app uses Alpha Vantage's free tier API (rate limited to 5 calls/minute, 500 calls/day)
- Company logos are fetched from Clearbit's free logo API

## Images / Screenshots

Screenshots from the running app:

![Watchlists](assets/screenshots/watchlists.png)
![Add to Watchlist Modal](assets/screenshots/add-watchlist-modal.png)
![Details Chart](assets/screenshots/details-chart.png)
![Details Full](assets/screenshots/details-full.png)
![Top Gainers List](assets/screenshots/top-gainers-list.png)
![Home - Top Gainers/Losers](assets/screenshots/home.png)

(To add the images to git:)
```bash
mkdir -p client/assets/screenshots
# copy your screenshots into the folder, then:
git add client/assets/screenshots/*.png
git commit -m "Add app screenshots to README"
```

## License

This project is licensed under the MIT License — see the LICENSE file for details.
