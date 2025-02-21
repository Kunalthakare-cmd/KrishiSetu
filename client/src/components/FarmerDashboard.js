import React, { useState, useEffect } from 'react';
import Overview from './dashboard/Overview';
import Profile from './dashboard/Profile';
import MyCrops from './dashboard/MyCrops';
import Transactions from './dashboard/Transactions';
import './FarmerDashboard.css';

const FarmerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [crops, setCrops] = useState([]);
  const [error, setError] = useState(null);

  // Fetch existing crops when component mounts
  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const response = await fetch('/api/crops', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add your auth token
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCrops(data);
      }
    } catch (error) {
      console.error('Error fetching crops:', error);
      setError('Failed to fetch crops');
    }
  };

  const handleAddCrop = async (cropData) => {
    try {
      const response = await fetch('/api/crops', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: cropData // Now sending FormData directly
      });

      if (response.ok) {
        const newCrop = await response.json();
        setCrops(prevCrops => [...prevCrops, newCrop]);
        alert('Crop added successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add crop');
      }
    } catch (error) {
      console.error('Error adding crop:', error);
      setError(error.message);
      alert(error.message || 'Failed to add crop. Please try again.');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview crops={crops} />;
      case 'profile':
        return <Profile />;
      case 'crops':
        return <MyCrops crops={crops} onAddCrop={handleAddCrop} />;
      case 'transactions':
        return <Transactions />;
      default:
        return <Overview crops={crops} />;
    }
  };

  return (
    <div className="farmer-dashboard">
      <nav className="dashboard-nav">
        <ul>
          <li>
            <button 
              className={activeTab === 'overview' ? 'active' : ''} 
              onClick={() => setActiveTab('overview')}
            >
              📊 Overview
            </button>
          </li>
          <li>
            <button 
              className={activeTab === 'profile' ? 'active' : ''} 
              onClick={() => setActiveTab('profile')}
            >
              👤 Profile
            </button>
          </li>
          <li>
            <button 
              className={activeTab === 'crops' ? 'active' : ''} 
              onClick={() => setActiveTab('crops')}
            >
              🌾 My Crops
            </button>
          </li>
          <li>
            <button 
              className={activeTab === 'transactions' ? 'active' : ''} 
              onClick={() => setActiveTab('transactions')}
            >
              💰 Transactions
            </button>
          </li>
        </ul>
      </nav>

      {error && <div className="error-message">{error}</div>}
      
      <div className="dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default FarmerDashboard; 