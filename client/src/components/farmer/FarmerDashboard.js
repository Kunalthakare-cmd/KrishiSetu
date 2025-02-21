import React, { useState, useEffect, useCallback } from 'react';
import { Link, Route } from 'react-router-dom';
import TrackLogistics from '../logistics/TrackLogistics';

function FarmerDashboard() {
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
    <div className="farmer-dashboard">
      <div className="dashboard-nav">
        <Link to="/farmer/logistics" className="nav-item">
          <span className="icon">🚛</span>
          <span>Track Logistics</span>
        </Link>
      </div>
      <div className="logistics-requests-container">
        <div className="requests-grid">
          {requests.map(request => (
            <div key={request.id} className="request-card">
              <div className="request-header">
                <h4>{request.cropDetails?.name || 'Unnamed Crop'}</h4>
                <span className="status-badge pending">New Request</span>
              </div>

              <div className="request-details">
                <div className="detail-row">
                  <span>Quantity:</span>
                  <span>
                    {request.cropDetails?.quantity || 0} {request.cropDetails?.unit || 'units'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FarmerDashboard; 