import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MyCrops from './farmer/MyCrops';
import Inventory from './trader/Inventory';
import Deliveries from './logistics/Deliveries';
import CreateSalePost from './farmer/CreateSalePost';
import ViewSalePosts from './trader/ViewSalePosts';
import ViewRequests from './trader/ViewRequests';
import MarketPrices from './farmer/MarketPrices';
import ViewFarmerRequests from './farmer/ViewFarmerRequests';
import LogisticsRequests from './logistics/LogisticsRequests';
import Analytics from './trader/Analytics';
import ManageSalePosts from './farmer/ManageSalePosts';

function RoleDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const role = currentUser?.role;

  const roleSpecificContent = {
    farmer: {
      stats: [
        { 
          icon: '🌾', 
          title: 'Active Listings', 
          value: (() => {
            const crops = JSON.parse(localStorage.getItem('crops') || '[]');
            return crops.filter(crop => 
              crop.farmer === currentUser.id && crop.status === 'available'
            ).length;
          })()
        },
        { 
          icon: '💰', 
          title: 'Total Sales', 
          value: (() => {
            const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
            const total = transactions
              .filter(t => t.farmerId === currentUser.id && t.type === 'sale')
              .reduce((sum, t) => sum + t.amount, 0);
            return `₹${total.toLocaleString()}`;
          })()
        }
      ],
      actions: [
        { 
          icon: '➕', 
          title: 'Add New Crop', 
          onClick: () => setActiveTab('crops')
        },
        { 
          icon: '📊', 
          title: 'View Market Prices', 
          onClick: () => setActiveTab('market')
        }
      ]
    }
  };

  useEffect(() => {
    const storedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const userTransactions = storedTransactions.filter(t => t.userId === currentUser.id);
    setTransactions(userTransactions);
  }, [currentUser.id]);

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Welcome back, {currentUser?.fullName}!</h1>
        </header>
      </main>
    </div>
  );
}

export default RoleDashboard;