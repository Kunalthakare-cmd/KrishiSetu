import React, { useState, useEffect, useCallback, useMemo } from 'react';

function MarketPrices() {
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    commodity: '',
    market: '',
    state: ''
  });

  // Move baseMarketData to useMemo to prevent unnecessary recreations
  const baseMarketData = useMemo(() => [
    {
      commodity: 'Wheat',
      basePrice: 2200,
      markets: ['Delhi', 'Mumbai', 'Kolkata', 'Chennai'],
      states: ['Delhi', 'Maharashtra', 'West Bengal', 'Tamil Nadu']
    },
    {
      commodity: 'Rice',
      basePrice: 3500,
      markets: ['Hyderabad', 'Lucknow', 'Patna', 'Bhopal'],
      states: ['Telangana', 'Uttar Pradesh', 'Bihar', 'Madhya Pradesh']
    },
    {
      commodity: 'Cotton',
      basePrice: 6000,
      markets: ['Ahmedabad', 'Nagpur', 'Guntur', 'Surat'],
      states: ['Gujarat', 'Maharashtra', 'Andhra Pradesh', 'Gujarat']
    },
    {
      commodity: 'Soybean',
      basePrice: 4200,
      markets: ['Indore', 'Pune', 'Belgaum', 'Ujjain'],
      states: ['Madhya Pradesh', 'Maharashtra', 'Karnataka', 'Madhya Pradesh']
    },
    {
      commodity: 'Corn',
      basePrice: 1800,
      markets: ['Bangalore', 'Davangere', 'Nashik', 'Kanpur'],
      states: ['Karnataka', 'Karnataka', 'Maharashtra', 'Uttar Pradesh']
    }
  ], []); // Empty dependency array since this data never changes

  const generateMarketData = useCallback(() => {
    const currentDate = new Date();
    const generatedData = [];

    baseMarketData.forEach(commodity => {
      commodity.markets.forEach((market, index) => {
        // Add some price variation based on market
        const priceVariation = Math.random() * 200 - 100; // ±100
        const price = commodity.basePrice + priceVariation;

        // Generate realistic price trend based on previous data
        const previousPrice = parseFloat(localStorage.getItem(`${commodity.commodity}_${market}_price`)) || price;
        const trend = price > previousPrice ? 'up' : price < previousPrice ? 'down' : 'stable';

        // Store current price for future reference
        localStorage.setItem(`${commodity.commodity}_${market}_price`, price.toString());

        generatedData.push({
          commodity: commodity.commodity,
          price: price.toFixed(2),
          market: market,
          state: commodity.states[index],
          date: currentDate.toLocaleDateString(),
          trend: trend,
          volume: Math.floor(Math.random() * 1000) + 200 // Random volume between 200-1200 quintals
        });
      });
    });

    return generatedData;
  }, [baseMarketData]); // Add baseMarketData as dependency

  const fetchMarketPrices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newData = generateMarketData();
      setMarketData(newData);

      // Cache the data with timestamp
      localStorage.setItem('marketPrices', JSON.stringify({
        data: newData,
        timestamp: new Date().getTime()
      }));

    } catch (err) {
      setError('Failed to fetch market prices. Please try again later.');
      console.error('Error fetching market prices:', err);
    } finally {
      setLoading(false);
    }
  }, [generateMarketData]); // Add generateMarketData as dependency

  useEffect(() => {
    // Check for cached data first
    const cached = JSON.parse(localStorage.getItem('marketPrices'));
    if (cached && (new Date().getTime() - cached.timestamp < 300000)) { // 5 minutes cache
      setMarketData(cached.data);
      setLoading(false);
    } else {
      fetchMarketPrices();
    }

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchMarketPrices, 300000);
    return () => clearInterval(interval);
  }, [fetchMarketPrices]); // Add fetchMarketPrices as dependency

  const filteredData = marketData.filter(item => {
    return (
      (!filters.commodity || item.commodity.toLowerCase().includes(filters.commodity.toLowerCase())) &&
      (!filters.market || item.market.toLowerCase().includes(filters.market.toLowerCase())) &&
      (!filters.state || item.state.toLowerCase().includes(filters.state.toLowerCase()))
    );
  });

  return (
    <div className="market-prices-container">
      <div className="section-header">
        <h2>Market Prices</h2>
        <p>Live agricultural commodity prices across markets</p>
      </div>

      <div className="filters-section">
        <input
          type="text"
          placeholder="Search by commodity"
          value={filters.commodity}
          onChange={(e) => setFilters({...filters, commodity: e.target.value})}
        />
        <input
          type="text"
          placeholder="Filter by market"
          value={filters.market}
          onChange={(e) => setFilters({...filters, market: e.target.value})}
        />
        <input
          type="text"
          placeholder="Filter by state"
          value={filters.state}
          onChange={(e) => setFilters({...filters, state: e.target.value})}
        />
        <button 
          className="refresh-button"
          onClick={fetchMarketPrices}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Prices'}
        </button>
      </div>

      {loading && (
        <div className="loading-spinner">
          Loading market prices...
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="prices-grid">
        {filteredData.map((item, index) => (
          <div key={index} className="price-card">
            <div className="price-header">
              <h3>{item.commodity}</h3>
              <span className={`trend-indicator ${item.trend}`}>
                {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'}
              </span>
            </div>
            
            <div className="price-details">
              <div className="detail-row">
                <span>Price:</span>
                <span className="price-value">₹{item.price}/quintal</span>
              </div>
              <div className="detail-row">
                <span>Market:</span>
                <span>{item.market}</span>
              </div>
              <div className="detail-row">
                <span>State:</span>
                <span>{item.state}</span>
              </div>
              <div className="detail-row">
                <span>Volume:</span>
                <span>{item.volume} quintals</span>
              </div>
              <div className="detail-row">
                <span>Last Updated:</span>
                <span>{item.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MarketPrices; 