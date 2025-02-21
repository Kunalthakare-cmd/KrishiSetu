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
  
  // Get current user from localStorage
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
        },
        { 
          icon: '📦', 
          title: 'Pending Orders', 
          value: (() => {
            const requests = JSON.parse(localStorage.getItem('tradeRequests') || '[]');
            return requests.filter(req => 
              req.farmerId === currentUser.id && req.status === 'pending'
            ).length;
          })()
        },
        { 
          icon: '🚛', 
          title: 'In Transit', 
          value: (() => {
            const deliveries = JSON.parse(localStorage.getItem('deliveries') || '[]');
            return deliveries.filter(d => 
              d.farmerId === currentUser.id && d.status === 'in_transit'
            ).length;
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
        },
        { 
          icon: '📝', 
          title: 'Create Sale Post', 
          onClick: () => setActiveTab('posts')
        },
        { 
          icon: '📋', 
          title: 'Manage Posts', 
          onClick: () => setActiveTab('manage-posts')
        },
        { 
          icon: '🤝', 
          title: 'View Requests', 
          onClick: () => setActiveTab('requests')
        }
      ]
    },
    trader: {
      stats: [
        { 
          icon: '🏪', 
          title: 'Active Orders', 
          value: (() => {
            const requests = JSON.parse(localStorage.getItem('tradeRequests') || '[]');
            return requests.filter(req => 
              req.traderId === currentUser.id && req.status === 'pending'
            ).length;
          })()
        },
        { 
          icon: '💵', 
          title: 'Total Purchase', 
          value: (() => {
            const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
            const total = transactions
              .filter(t => t.traderId === currentUser.id && t.type === 'purchase')
              .reduce((sum, t) => sum + t.amount, 0);
            return `₹${total.toLocaleString()}`;
          })()
        },
        { 
          icon: '📦', 
          title: 'Inventory Items', 
          value: (() => {
            const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
            return inventory.filter(item => item.traderId === currentUser.id).length;
          })()
        },
        { 
          icon: '🤝', 
          title: 'Supplier Network', 
          value: (() => {
            const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
            const uniqueFarmers = new Set(
              transactions
                .filter(t => t.traderId === currentUser.id)
                .map(t => t.farmerId)
            );
            return uniqueFarmers.size;
          })()
        }
      ],
      actions: [
        { icon: '🔍', title: 'Browse Crops', onClick: () => setActiveTab('browse') },
        { icon: '📦', title: 'Manage Inventory', onClick: () => setActiveTab('inventory') },
        { icon: '🤝', title: 'View Requests', onClick: () => setActiveTab('requests') },
        { icon: '📈', title: 'Analytics', onClick: () => setActiveTab('analytics') }
      ]
    },
    logistics: {
      stats: [
        { 
          icon: '🚛', 
          title: 'Active Deliveries', 
          value: (() => {
            const requests = JSON.parse(localStorage.getItem('logisticsRequests') || '[]');
            return requests.filter(req => 
              req.logisticsProviderId === currentUser.id && 
              req.status === 'accepted'
            ).length;
          })()
        },
        { icon: '📍', title: 'Total Routes', value: '15' },
        { icon: '⏱️', title: 'Pending Requests', value: '4' },
        { icon: '💰', title: 'Monthly Revenue', value: '₹85,000' }
      ],
      actions: [
        { icon: '📍', title: 'View Routes', onClick: () => setActiveTab('routes') },
        { icon: '🚚', title: 'Vehicle Status', onClick: () => setActiveTab('vehicles') },
        { icon: '📋', title: 'New Delivery', onClick: () => setActiveTab('new-delivery') },
        { icon: '📊', title: 'Performance', onClick: () => setActiveTab('performance') },
        { icon: '📋', title: 'View Requests', onClick: () => setActiveTab('requests') }
      ]
    }
  };

  // Handle quick actions
  const handleQuickAction = (action, role) => {
    switch(action) {
      case 'Add New Crop':
        setActiveTab('crops');
        break;
      case 'View Market Prices':
        setActiveTab('market');
        break;
      case 'Browse Crops':
        setActiveTab('browse');
        break;
      case 'View Routes':
        setActiveTab('routes');
        break;
      default:
        setActiveTab('overview');
    }
  };

  useEffect(() => {
    // Load user-specific transactions
    const storedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const userTransactions = storedTransactions.filter(t => t.userId === currentUser.id);
    setTransactions(userTransactions);
  }, [currentUser.id]);

  // Render transactions section
  const renderTransactions = () => {
    if (transactions.length === 0) {
      return <p className="no-data">No transactions yet</p>;
    }

    return (
      <div className="transactions-grid">
        {transactions.map((transaction, index) => (
          <div key={index} className="transaction-card">
            <p><strong>Date:</strong> {new Date(transaction.date).toLocaleDateString()}</p>
            <p><strong>Type:</strong> {transaction.type}</p>
            <p><strong>Amount:</strong> ₹{transaction.amount}</p>
            <p><strong>Status:</strong> {transaction.status}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="user-profile">
            <div className="avatar">
              {currentUser.fullName.charAt(0)}
            </div>
            <div className="user-info">
              <h3>{currentUser.fullName}</h3>
              <span className="user-role">{currentUser.role}</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-menu">
          {roleSpecificContent[role]?.actions.map((action, index) => (
            <div 
              key={index}
              className={`menu-item ${activeTab === action.title.toLowerCase() ? 'active' : ''}`}
              onClick={() => action.onClick()}
            >
              <span className="menu-icon">{action.icon}</span>
              <span>{action.title}</span>
            </div>
          ))}
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Welcome back, {currentUser?.fullName}!</h1>
          <div className="header-actions">
            <button className="notification-btn">🔔</button>
            <button className="logout-btn" onClick={() => {
              localStorage.removeItem('currentUser');
              navigate('/');
            }}>
              Logout
            </button>
          </div>
        </header>

        <div className="stats-grid">
          {roleSpecificContent[role]?.stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-title">{stat.title}</div>
            </div>
          ))}
        </div>

        <div className="content-card">
          {activeTab === 'crops' && role === 'farmer' && <MyCrops />}

          {activeTab === 'inventory' && role === 'trader' && <Inventory />}

          {activeTab === 'deliveries' && role === 'logistics' && <Deliveries />}

          {activeTab === 'overview' && (
            <div className="quick-actions">
              <h2>Quick Actions</h2>
              <div className="actions-grid">
                {roleSpecificContent[role]?.actions.map((action, index) => (
                  <button 
                    key={index} 
                    className="action-card" 
                    onClick={() => handleQuickAction(action.title, role)}
                  >
                    <span className="action-icon">{action.icon}</span>
                    <span className="action-title">{action.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="profile-section">
              <div className="profile-card">
                <h2>Profile Information</h2>
                <div className="profile-details">
                  <p><strong>Name:</strong> {currentUser?.fullName}</p>
                  <p><strong>Email:</strong> {currentUser?.email}</p>
                  <p><strong>Phone:</strong> {currentUser?.phone}</p>
                  <p><strong>Role:</strong> {currentUser?.role}</p>
                  {currentUser?.role === 'farmer' && (
                    <p><strong>Land Size:</strong> {currentUser?.landSize} acres</p>
                  )}
                  {currentUser?.role === 'trader' && (
                    <p><strong>Business Name:</strong> {currentUser?.businessName}</p>
                  )}
                  {currentUser?.role === 'logistics' && (
                    <>
                      <p><strong>Company Name:</strong> {currentUser?.companyName}</p>
                      <p><strong>Fleet Size:</strong> {currentUser?.fleetSize} vehicles</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="transactions-section">
              <div className="section-header">
                <h2>Transaction History</h2>
              </div>
              <div className="transactions-list">
                {renderTransactions()}
              </div>
            </div>
          )}

          {activeTab === 'posts' && role === 'farmer' && <CreateSalePost />}
          {activeTab === 'browse' && role === 'trader' && <ViewSalePosts />}
          {activeTab === 'requests' && role === 'trader' && <ViewRequests />}

          {activeTab === 'market' && role === 'farmer' && <MarketPrices />}

          {activeTab === 'requests' && role === 'farmer' && <ViewFarmerRequests />}

          {activeTab === 'requests' && role === 'logistics' && <LogisticsRequests />}

          {activeTab === 'analytics' && role === 'trader' && <Analytics />}

          {activeTab === 'manage-posts' && role === 'farmer' && <ManageSalePosts />}
        </div>
      </main>
    </div>
  );
}

export default RoleDashboard; 