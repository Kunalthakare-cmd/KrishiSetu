import React, { useState, useEffect, useCallback } from 'react';
import { Link, Route } from 'react-router-dom';
import TrackLogistics from '../logistics/TrackLogistics';

function TraderDashboard() {
  const [requests, setRequests] = useState([]);
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const loadRequests = useCallback(() => {
    const allRequests = JSON.parse(localStorage.getItem('logisticsRequests') || '[]');
    
    // Split requests into pending and active
    const pending = allRequests.filter(req => 
      req.status === 'pending'
    );
    
    const active = allRequests.filter(req => 
      req.status !== 'pending' && 
      req.logisticsProviderId === currentUser.id
    );

    setRequests(pending);
    setActiveDeliveries(active);
  }, [currentUser.id]);

  useEffect(() => {
    loadRequests();
    const interval = setInterval(loadRequests, 30000);
    return () => clearInterval(interval);
  }, [loadRequests]);

  return (
    <div className="trader-dashboard">
      <div className="dashboard-nav">
        <Link to="/trader/logistics" className="nav-item">
          <span className="icon">🚛</span>
          <span>Track Logistics</span>
        </Link>
      </div>
      <Route path="/trader/logistics" element={<TrackLogistics />} />
    </div>
  );
}

export default TraderDashboard; 