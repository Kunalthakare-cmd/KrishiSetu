import React from 'react';
import './Dashboard.css';

const Overview = ({ crops }) => {
  const calculateTotalYield = () => {
    return crops.reduce((total, crop) => total + Number(crop.expectedYield), 0);
  };

  const calculateActiveCrops = () => {
    return crops.length;
  };

  return (
    <div className="dashboard-section">
      <h2>Dashboard Overview</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Crops</h3>
          <p className="stat-number">{calculateActiveCrops()}</p>
        </div>
        <div className="stat-card">
          <h3>Expected Yield</h3>
          <p className="stat-number">{calculateTotalYield()} kg</p>
        </div>
        <div className="stat-card">
          <h3>Active Season</h3>
          <p className="stat-number">2024</p>
        </div>
      </div>
    </div>
  );
};

export default Overview; 