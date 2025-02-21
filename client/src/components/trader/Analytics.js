import React, { useState, useEffect } from 'react';

function Analytics() {
  const [metrics, setMetrics] = useState({
    totalPurchases: 0,
    averagePrice: 0,
    totalVolume: 0,
    activeDeals: 0
  });

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    // Calculate metrics from transactions
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const userTransactions = transactions.filter(t => t.traderId === currentUser.id);

    const totalPurchases = userTransactions.reduce((sum, t) => sum + t.amount, 0);
    const averagePrice = totalPurchases / (userTransactions.length || 1);
    const totalVolume = userTransactions.reduce((sum, t) => sum + Number(t.quantity), 0);

    // Get active deals
    const requests = JSON.parse(localStorage.getItem('tradeRequests') || '[]');
    const activeDeals = requests.filter(r => 
      r.traderId === currentUser.id && r.status === 'pending'
    ).length;

    setMetrics({
      totalPurchases,
      averagePrice,
      totalVolume,
      activeDeals
    });
  }, [currentUser.id]);

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>Business Analytics</h2>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Total Purchases</h3>
          <p className="metric-value">₹{metrics.totalPurchases.toLocaleString()}</p>
        </div>

        <div className="metric-card">
          <h3>Average Price</h3>
          <p className="metric-value">₹{metrics.averagePrice.toFixed(2)}</p>
        </div>

        <div className="metric-card">
          <h3>Total Volume</h3>
          <p className="metric-value">{metrics.totalVolume} units</p>
        </div>

        <div className="metric-card">
          <h3>Active Deals</h3>
          <p className="metric-value">{metrics.activeDeals}</p>
        </div>
      </div>

      <div className="analytics-charts">
        <div className="chart-container">
          <h3>Purchase Trends</h3>
          {/* Add chart component here */}
        </div>

        <div className="chart-container">
          <h3>Price Analysis</h3>
          {/* Add chart component here */}
        </div>
      </div>
    </div>
  );
}

export default Analytics; 