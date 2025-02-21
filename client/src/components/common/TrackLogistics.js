import React, { useState, useEffect, useCallback } from 'react';

function TrackLogistics() {
  const [requests, setRequests] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const loadRequests = useCallback(() => {
    const allRequests = JSON.parse(localStorage.getItem('logisticsRequests') || '[]');
    const userRequests = allRequests.filter(req => 
      req.requesterId === currentUser.id
    );
    setRequests(userRequests);
  }, [currentUser.id]);

  useEffect(() => {
    loadRequests();
    const interval = setInterval(loadRequests, 30000);
    return () => clearInterval(interval);
  }, [loadRequests]);

  return (
    <div className="track-logistics-container">
      <div className="section-header">
        <h2>Track Logistics</h2>
        <p>Monitor your logistics requests and deliveries</p>
      </div>

      <div className="logistics-grid">
        {requests.map(request => (
          <div key={request.id} className="logistics-card">
            <div className="logistics-header">
              <h4>{request.cropDetails?.name || 'Unnamed Crop'}</h4>
              <span className={`status-badge ${request.status}`}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </span>
            </div>

            <div className="logistics-details">
              <div className="detail-row">
                <span>From:</span>
                <span>{request.pickupLocation}</span>
              </div>
              <div className="detail-row">
                <span>To:</span>
                <span>{request.deliveryLocation}</span>
              </div>
              <div className="detail-row">
                <span>Vehicle:</span>
                <span>{request.vehicleType}</span>
              </div>
              <div className="detail-row">
                <span>Price:</span>
                <span>₹{request.price}</span>
              </div>
              {request.logisticsProviderId && (
                <div className="provider-details">
                  <h5>Logistics Provider</h5>
                  <p>{request.providerName}</p>
                  <p>Contact: {request.providerPhone}</p>
                </div>
              )}
            </div>

            <div className="tracking-timeline">
              {request.trackingUpdates?.map((update, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <span className="update-time">
                      {new Date(update.timestamp).toLocaleString()}
                    </span>
                    <span className="update-status">{update.status}</span>
                    <p className="update-description">{update.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrackLogistics; 