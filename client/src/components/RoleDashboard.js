import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RoleDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  
  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const role = currentUser?.role;

  const roleSpecificContent = {
    farmer: {
      stats: [
        { icon: '🌾', title: 'Active Listings', value: '5' },
        { icon: '💰', title: 'Total Sales', value: '₹45,000' },
        { icon: '📦', title: 'Pending Orders', value: '3' },
        { icon: '🚛', title: 'In Transit', value: '2' }
      ],
      actions: [
        { icon: '➕', title: 'Add New Crop', onClick: () => console.log('Add crop') },
        { icon: '📊', title: 'View Market Prices', onClick: () => console.log('View prices') },
        { icon: '📝', title: 'Create Sale Post', onClick: () => console.log('Create post') },
        { icon: '🤝', title: 'View Requests', onClick: () => console.log('View requests') }
      ]
    },
    trader: {
      stats: [
        { icon: '🏪', title: 'Active Orders', value: '8' },
        { icon: '💵', title: 'Total Purchase', value: '₹1,25,000' },
        { icon: '📦', title: 'Inventory Items', value: '12' },
        { icon: '🤝', title: 'Supplier Network', value: '25' }
      ],
      actions: [
        { icon: '🔍', title: 'Browse Crops', onClick: () => console.log('Browse') },
        { icon: '📦', title: 'Manage Inventory', onClick: () => console.log('Inventory') },
        { icon: '📋', title: 'Place Order', onClick: () => console.log('Order') },
        { icon: '📈', title: 'Analytics', onClick: () => console.log('Analytics') }
      ]
    },
    logistics: {
      stats: [
        { icon: '🚛', title: 'Active Deliveries', value: '6' },
        { icon: '📍', title: 'Total Routes', value: '15' },
        { icon: '⏱️', title: 'Pending Requests', value: '4' },
        { icon: '💰', title: 'Monthly Revenue', value: '₹85,000' }
      ],
      actions: [
        { icon: '📍', title: 'View Routes', onClick: () => console.log('Routes') },
        { icon: '🚚', title: 'Vehicle Status', onClick: () => console.log('Status') },
        { icon: '📋', title: 'New Delivery', onClick: () => console.log('Delivery') },
        { icon: '📊', title: 'Performance', onClick: () => console.log('Performance') }
      ]
    }
  };

  return (
    <div className="role-dashboard">
      <aside className="dashboard-sidebar">
        <div className="user-profile">
          <div className="user-avatar">
            {role === 'farmer' ? '👨‍🌾' : role === 'trader' ? '🏪' : '🚛'}
          </div>
          <div className="user-info">
            <h3>{currentUser?.fullName}</h3>
            <p>{role?.charAt(0).toUpperCase() + role?.slice(1)}</p>
          </div>
        </div>

        <nav className="dashboard-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Profile
          </button>
          {role === 'farmer' && (
            <button 
              className={`nav-item ${activeTab === 'crops' ? 'active' : ''}`}
              onClick={() => setActiveTab('crops')}
            >
              🌾 My Crops
            </button>
          )}
          {role === 'trader' && (
            <button 
              className={`nav-item ${activeTab === 'inventory' ? 'active' : ''}`}
              onClick={() => setActiveTab('inventory')}
            >
              📦 Inventory
            </button>
          )}
          {role === 'logistics' && (
            <button 
              className={`nav-item ${activeTab === 'deliveries' ? 'active' : ''}`}
              onClick={() => setActiveTab('deliveries')}
            >
              🚚 Deliveries
            </button>
          )}
          <button 
            className={`nav-item ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            💰 Transactions
          </button>
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

        <div className="dashboard-content">
          <div className="stats-grid">
            {roleSpecificContent[role]?.stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-info">
                  <h3>{stat.title}</h3>
                  <p>{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              {roleSpecificContent[role]?.actions.map((action, index) => (
                <button key={index} className="action-card" onClick={action.onClick}>
                  <span className="action-icon">{action.icon}</span>
                  <span className="action-title">{action.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Add more role-specific content based on activeTab */}
        </div>
      </main>
    </div>
  );
}

export default RoleDashboard; 