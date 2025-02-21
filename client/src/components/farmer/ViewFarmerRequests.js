import React, { useState, useEffect, useCallback } from 'react';

function ViewFarmerRequests() {
  const [requests, setRequests] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const loadRequests = useCallback(() => {
    const allRequests = JSON.parse(localStorage.getItem('tradeRequests') || '[]');
    const farmerRequests = allRequests.filter(req => req.farmerId === currentUser.id);
    setRequests(farmerRequests);
  }, [currentUser.id]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleRequestAction = (requestId, action) => {
    try {
      const allRequests = JSON.parse(localStorage.getItem('tradeRequests') || '[]');
      const updatedRequests = allRequests.map(req => {
        if (req.id === requestId) {
          return { ...req, status: action, actionDate: new Date().toISOString() };
        }
        return req;
      });
      localStorage.setItem('tradeRequests', JSON.stringify(updatedRequests));

      // If accepted, create a transaction
      if (action === 'accepted') {
        const request = allRequests.find(req => req.id === requestId);
        const transaction = {
          id: Math.random().toString(36).substr(2, 9),
          requestId: requestId,
          farmerId: currentUser.id,
          farmerName: currentUser.fullName,
          traderId: request.traderId,
          traderName: request.traderName,
          cropName: request.cropName,
          quantity: request.quantity,
          unit: request.unit,
          amount: request.negotiatedPrice || request.expectedPrice,
          status: 'pending_payment',
          date: new Date().toISOString(),
          type: 'sale'
        };

        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        localStorage.setItem('transactions', JSON.stringify([...transactions, transaction]));

        // Update sale post status
        const salePosts = JSON.parse(localStorage.getItem('salePosts') || '[]');
        const updatedPosts = salePosts.map(post => {
          if (post.id === request.postId) {
            return { ...post, status: 'sold' };
          }
          return post;
        });
        localStorage.setItem('salePosts', JSON.stringify(updatedPosts));
      }

      loadRequests();
      alert(`Request ${action} successfully!`);
    } catch (error) {
      console.error('Error handling request:', error);
      alert('Error processing request. Please try again.');
    }
  };

  const getRequestTypeLabel = (request) => {
    if (request.requestType === 'negotiate') {
      return `Price Negotiation (₹${request.negotiatedPrice})`;
    }
    return 'Direct Purchase';
  };

  return (
    <div className="requests-container">
      <div className="section-header">
        <h2>Trade Requests</h2>
        <p>Manage incoming requests from traders</p>
      </div>

      <div className="requests-grid">
        {requests.length === 0 ? (
          <div className="no-requests">
            <p>No trade requests received yet</p>
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
                <div className="detail-row">
                  <span>Request Type:</span>
                  <span>{getRequestTypeLabel(request)}</span>
                </div>
                <div className="detail-row">
                  <span>Trader:</span>
                  <span>{request.traderName}</span>
                </div>
                <div className="detail-row">
                  <span>Business:</span>
                  <span>{request.businessName}</span>
                </div>
                <div className="detail-row">
                  <span>Quantity:</span>
                  <span>{request.quantity} {request.unit}</span>
                </div>
                <div className="detail-row">
                  <span>Expected Price:</span>
                  <span>₹{request.expectedPrice}</span>
                </div>
                {request.negotiatedPrice && (
                  <div className="detail-row">
                    <span>Offered Price:</span>
                    <span>₹{request.negotiatedPrice}</span>
                  </div>
                )}
                <div className="detail-row">
                  <span>Request Date:</span>
                  <span>{new Date(request.requestDate).toLocaleDateString()}</span>
                </div>
              </div>

              {request.status === 'pending' && (
                <div className="request-actions">
                  <button 
                    className="action-button primary"
                    onClick={() => handleRequestAction(request.id, 'accepted')}
                  >
                    Accept
                  </button>
                  <button 
                    className="action-button secondary"
                    onClick={() => handleRequestAction(request.id, 'rejected')}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ViewFarmerRequests; 