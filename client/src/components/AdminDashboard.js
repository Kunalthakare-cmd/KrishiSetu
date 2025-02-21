import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  // Get data from localStorage
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const farmers = users.filter(user => user.role === 'farmer');
  const traders = users.filter(user => user.role === 'trader');
  const logistics = users.filter(user => user.role === 'logistics');

  const stats = {
    totalUsers: users.length,
    farmers: farmers.length,
    traders: traders.length,
    logistics: logistics.length,
    activeUsers: users.filter(user => user.lastActive > Date.now() - 86400000).length,
    pendingRequests: 12,
    totalTransactions: 156,
    revenueThisMonth: '₹45,678'
  };

  const recentUsers = users.sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  ).slice(0, 5);

  const renderOverview = () => (
    <div className="admin-overview">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👨‍🌾</div>
          <div className="stat-info">
            <h3>Farmers</h3>
            <p>{stats.farmers}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏪</div>
          <div className="stat-info">
            <h3>Traders</h3>
            <p>{stats.traders}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚛</div>
          <div className="stat-info">
            <h3>Logistics</h3>
            <p>{stats.logistics}</p>
          </div>
        </div>
      </div>

      <div className="admin-grid">
        <div className="admin-card">
          <h3>Recent Registrations</h3>
          <div className="user-list">
            {recentUsers.map((user, index) => (
              <div key={index} className="user-item">
                <div className="user-icon">
                  {user.role === 'farmer' ? '👨‍🌾' : user.role === 'trader' ? '🏪' : '🚛'}
                </div>
                <div className="user-info">
                  <h4>{user.fullName}</h4>
                  <p>{user.email}</p>
                </div>
                <div className="user-date">
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <h3>Activity Overview</h3>
          <div className="activity-stats">
            <div className="activity-item">
              <span>Active Users Today</span>
              <strong>{stats.activeUsers}</strong>
            </div>
            <div className="activity-item">
              <span>Pending Requests</span>
              <strong>{stats.pendingRequests}</strong>
            </div>
            <div className="activity-item">
              <span>Total Transactions</span>
              <strong>{stats.totalTransactions}</strong>
            </div>
            <div className="activity-item">
              <span>Revenue This Month</span>
              <strong>{stats.revenueThisMonth}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="admin-users">
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Email</th>
              <th>Joined Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>
                  <div className="user-cell">
                    <span className="user-icon">
                      {user.role === 'farmer' ? '👨‍🌾' : user.role === 'trader' ? '🏪' : '🚛'}
                    </span>
                    {user.fullName}
                  </div>
                </td>
                <td>{user.role}</td>
                <td>{user.email}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge ${user.status || 'active'}`}>
                    {user.status || 'Active'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn edit">Edit</button>
                    <button className="action-btn delete">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>KrishiSetu</h2>
          <p>Admin Portal</p>
        </div>
        <nav className="admin-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Users
          </button>
          <button 
            className={`nav-item ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            💰 Transactions
          </button>
          <button 
            className={`nav-item ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            📝 Requests
          </button>
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Settings
          </button>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div className="header-search">
            <input type="text" placeholder="Search..." />
          </div>
          <div className="header-actions">
            <button className="notification-btn">🔔</button>
            <button className="profile-btn" onClick={() => navigate('/')}>
              👤 Admin
            </button>
          </div>
        </header>

        <div className="admin-content">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUsers()}
          {/* Add other tab contents */}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard; 