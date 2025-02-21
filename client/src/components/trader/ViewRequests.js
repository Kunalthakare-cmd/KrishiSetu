import React, { useState, useEffect, useCallback } from 'react';

function ViewRequests() {
  const [requests, setRequests] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const loadRequests = useCallback(() => {
    const allRequests = JSON.parse(localStorage.getItem('tradeRequests') || '[]');
    const traderRequests = allRequests.filter(req => req.traderId === currentUser.id);
    setRequests(traderRequests);
  }, [currentUser.id]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleAccept = async (request) => {
    try {
      // Update request status
      const allRequests = JSON.parse(localStorage.getItem('tradeRequests') || '[]');
      const updatedRequests = allRequests.map(req => {
        if (req.id === request.id) {
          return {
            ...req,
            status: 'accepted',
            actionDate: new Date().toISOString()
          };
        }
        return req;
      });
      localStorage.setItem('tradeRequests', JSON.stringify(updatedRequests));

      // Create logistics request
      const logisticsRequest = {
        id: Math.random().toString(36).substr(2, 9),
        requestId: request.id,
        traderId: currentUser.id,
        traderName: currentUser.fullName,
        businessName: currentUser.businessName,
        farmerId: request.farmerId,
        farmerName: request.farmerName,
        cropName: request.cropName,
        quantity: request.quantity,
        unit: request.unit,
        pickupLocation: request.location,
        deliveryLocation: currentUser.businessAddress || 'Trader Location',
        status: 'pending',
        createdAt: new Date().toISOString(),
        type: 'logistics_request'
      };

      const existingLogisticsRequests = JSON.parse(localStorage.getItem('logisticsRequests') || '[]');
      localStorage.setItem('logisticsRequests', 
        JSON.stringify([...existingLogisticsRequests, logisticsRequest])
      );

      // Update sale post status
      const salePosts = JSON.parse(localStorage.getItem('salePosts') || '[]');
      const updatedPosts = salePosts.map(post => {
        if (post.id === request.postId) {
          return { ...post, status: 'sold', soldTo: currentUser.id };
        }
        return post;
      });
      localStorage.setItem('salePosts', JSON.stringify(updatedPosts));

      // Reload requests
      loadRequests();
      alert('Request accepted and logistics request created!');
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Error accepting request. Please try again.');
    }
  };

  const handleReject = (requestId) => {
    try {
      const allRequests = JSON.parse(localStorage.getItem('tradeRequests') || '[]');
      const updatedRequests = allRequests.map(req => {
        if (req.id === requestId) {
          return { ...req, status: 'rejected', actionDate: new Date().toISOString() };
        }
        return req;
      });
      localStorage.setItem('tradeRequests', JSON.stringify(updatedRequests));
      loadRequests();
      alert('Request rejected successfully!');
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Error rejecting request. Please try again.');
    }
  };

  return (
    <div className="requests-container">
      <h2>Trade Requests</h2>
      <div className="requests-grid">
        {requests.length === 0 ? (
          <div className="no-requests">
            <p>No trade requests available</p>
          </div>
        ) : (
          requests.map(request => (
            <div key={request.id} className="request-card">
              <div className="request-header">
                <h3>{request.cropName}</h3>
                <span className={`status-badge ${request.status}`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>

              <div className="request-details">
                <div className="farmer-info">
                  <p><strong>Farmer:</strong> {request.farmerName}</p>
                  <p><strong>Location:</strong> {request.location}</p>
                </div>

                <div className="crop-info">
                  <p><strong>Quantity:</strong> {request.quantity} {request.unit}</p>
                  <p><strong>Quality:</strong> Grade {request.quality}</p>
                  <p><strong>Expected Price:</strong> ₹{request.expectedPrice}</p>
                  <p><strong>Request Date:</strong> {new Date(request.requestDate).toLocaleDateString()}</p>
                </div>

                {request.description && (
                  <div className="request-description">
                    <p>{request.description}</p>
                  </div>
                )}
              </div>

              {request.status === 'pending' && (
                <div className="request-actions">
                  <button 
                    className="accept-btn"
                    onClick={() => handleAccept(request)}
                  >
                    Accept & Arrange Logistics
                  </button>
                  <button 
                    className="reject-btn"
                    onClick={() => handleReject(request.id)}
                  >
                    Reject Request
                  </button>
                </div>
              )}

              {request.status === 'accepted' && (
                <div className="logistics-status">
                  <p><strong>Logistics Status:</strong> Pending pickup arrangement</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ViewRequests; 