import React, { useState, useEffect, useCallback } from 'react';

function LogisticsRequests() {
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

  const handleStatusUpdate = async (requestId, newStatus, description) => {
    try {
      const allRequests = JSON.parse(localStorage.getItem('logisticsRequests') || '[]');
      const updatedRequests = allRequests.map(req => {
        if (req.id === requestId) {
          const update = {
            status: newStatus,
            timestamp: new Date().toISOString(),
            description: description
          };
          
          return {
            ...req,
            status: newStatus,
            trackingUpdates: [...(req.trackingUpdates || []), update],
            ...(newStatus === 'accepted' ? {
              logisticsProviderId: currentUser.id,
              providerName: currentUser.fullName,
              providerPhone: currentUser.phone,
              vehicleDetails: currentUser.vehicles?.[0] || 'Standard Truck'
            } : {})
          };
        }
        return req;
      });

      localStorage.setItem('logisticsRequests', JSON.stringify(updatedRequests));
      loadRequests();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="logistics-requests-container">
      <div className="section-header">
        <h2>Logistics Requests</h2>
        <p>Manage delivery requests and track active deliveries</p>
      </div>

      <div className="requests-section">
        <h3>New Requests</h3>
        <div className="requests-grid">
          {requests.length === 0 ? (
            <div className="no-requests">
              <p>No new logistics requests</p>
            </div>
          ) : (
            requests.map(request => (
              <div key={request.id} className="request-card">
                <div className="request-header">
                  <h4>{request.cropName || 'Unnamed Crop'}</h4>
                  <span className="status-badge pending">New Request</span>
                </div>

                <div className="request-details">
                  <div className="detail-row">
                    <span>From:</span>
                    <span>{request.pickupLocation}</span>
                  </div>
                  <div className="detail-row">
                    <span>To:</span>
                    <span>{request.deliveryLocation}</span>
                  </div>
                  <div className="detail-row">
                    <span>Distance:</span>
                    <span>{request.distance} km</span>
                  </div>
                  <div className="detail-row">
                    <span>Quantity:</span>
                    <span>{request.quantity} {request.unit}</span>
                  </div>
                  <div className="detail-row">
                    <span>Vehicle Type:</span>
                    <span>{request.vehicleType}</span>
                  </div>
                  <div className="detail-row">
                    <span>Price:</span>
                    <span>₹{request.price}</span>
                  </div>
                  <div className="detail-row">
                    <span>Requester:</span>
                    <span>{request.requesterName} ({request.requesterRole})</span>
                  </div>
                </div>

                <div className="request-actions">
                  <button
                    className="action-button primary"
                    onClick={() => handleStatusUpdate(request.id, 'accepted', 'Request accepted by logistics provider')}
                  >
                    Accept
                  </button>
                  <button
                    className="action-button secondary"
                    onClick={() => handleStatusUpdate(request.id, 'rejected', 'Request rejected by logistics provider')}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="active-deliveries-section">
        <h3>Active Deliveries</h3>
        <div className="deliveries-grid">
          {activeDeliveries.length === 0 ? (
            <div className="no-deliveries">
              <p>No active deliveries</p>
            </div>
          ) : (
            activeDeliveries.map(delivery => (
              <div key={delivery.id} className="delivery-card">
                <div className="delivery-header">
                  <h4>{delivery.cropName || 'Unnamed Crop'}</h4>
                  <span className={`status-badge ${delivery.status}`}>
                    {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                  </span>
                </div>

                <div className="delivery-details">
                  <div className="detail-row">
                    <span>From:</span>
                    <span>{delivery.pickupLocation}</span>
                  </div>
                  <div className="detail-row">
                    <span>To:</span>
                    <span>{delivery.deliveryLocation}</span>
                  </div>
                  <div className="detail-row">
                    <span>Distance:</span>
                    <span>{delivery.distance} km</span>
                  </div>
                  <div className="detail-row">
                    <span>Quantity:</span>
                    <span>{delivery.quantity} {delivery.unit}</span>
                  </div>
                  <div className="detail-row">
                    <span>Vehicle Type:</span>
                    <span>{delivery.vehicleType}</span>
                  </div>
                  <div className="detail-row">
                    <span>Price:</span>
                    <span>₹{delivery.price}</span>
                  </div>
                  <div className="detail-row">
                    <span>Requester:</span>
                    <span>{delivery.requesterName} ({delivery.requesterRole})</span>
                  </div>
                </div>

                <div className="delivery-actions">
                  {delivery.status === 'accepted' && (
                    <button
                      className="action-button primary"
                      onClick={() => handleStatusUpdate(
                        delivery.id, 
                        'picked_up',
                        'Cargo picked up from source location'
                      )}
                    >
                      Mark as Picked Up
                    </button>
                  )}

                  {delivery.status === 'picked_up' && (
                    <button
                      className="action-button primary"
                      onClick={() => handleStatusUpdate(
                        delivery.id,
                        'in_transit',
                        'Cargo is in transit to destination'
                      )}
                    >
                      Start Transit
                    </button>
                  )}

                  {delivery.status === 'in_transit' && (
                    <button
                      className="action-button primary"
                      onClick={() => handleStatusUpdate(
                        delivery.id,
                        'delivered',
                        'Cargo successfully delivered to destination'
                      )}
                    >
                      Mark as Delivered
                    </button>
                  )}
                </div>

                <div className="tracking-updates">
                  <h4>Delivery Updates</h4>
                  {delivery.trackingUpdates?.map((update, index) => (
                    <div key={index} className="update-item">
                      <span className="update-time">
                        {new Date(update.timestamp).toLocaleString()}
                      </span>
                      <span className="update-status">{update.status}</span>
                      <p className="update-description">{update.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default LogisticsRequests; 