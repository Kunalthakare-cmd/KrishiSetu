import React, { useState, useEffect, useCallback } from 'react';

function ViewSalePosts() {
  const [salePosts, setSalePosts] = useState([]);
  const [filters, setFilters] = useState({
    cropName: '',
    quality: '',
    priceRange: '',
    location: ''
  });
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [negotiationPrice, setNegotiationPrice] = useState('');
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const checkIfRequestExists = useCallback((postId) => {
    const requests = JSON.parse(localStorage.getItem('tradeRequests') || '[]');
    return requests.some(req => 
      req.postId === postId && 
      req.traderId === currentUser.id
    );
  }, [currentUser.id]);

  const loadSalePosts = useCallback(() => {
    const posts = JSON.parse(localStorage.getItem('salePosts') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const activePosts = posts
      .filter(post => post.status === 'active')
      .map(post => {
        const farmer = users.find(user => user.id === post.farmerId);
        return {
          ...post,
          farmerDetails: farmer || {},
          hasMyRequest: checkIfRequestExists(post.id)
        };
      });

    setSalePosts(activePosts);
  }, [checkIfRequestExists]);

  useEffect(() => {
    loadSalePosts();
  }, [loadSalePosts]);

  const handleContact = (post) => {
    setSelectedPost(post);
    setShowContactModal(true);
  };

  const handleSendRequest = (type) => {
    try {
      const newRequest = {
        id: Math.random().toString(36).substr(2, 9),
        postId: selectedPost.id,
        farmerId: selectedPost.farmerId,
        farmerName: selectedPost.farmerDetails.fullName,
        traderId: currentUser.id,
        traderName: currentUser.fullName,
        businessName: currentUser.businessName,
        cropName: selectedPost.cropName,
        quantity: selectedPost.quantity,
        unit: selectedPost.unit,
        expectedPrice: selectedPost.expectedPrice,
        negotiatedPrice: type === 'negotiate' ? negotiationPrice : null,
        quality: selectedPost.quality,
        location: selectedPost.location,
        status: 'pending',
        requestType: type,
        requestDate: new Date().toISOString()
      };

      // Save request
      const existingRequests = JSON.parse(localStorage.getItem('tradeRequests') || '[]');
      localStorage.setItem('tradeRequests', JSON.stringify([...existingRequests, newRequest]));

      // Update post status
      const allPosts = JSON.parse(localStorage.getItem('salePosts') || '[]');
      const updatedPosts = allPosts.map(p => {
        if (p.id === selectedPost.id) {
          return { ...p, hasRequests: true };
        }
        return p;
      });
      localStorage.setItem('salePosts', JSON.stringify(updatedPosts));

      setShowContactModal(false);
      setSelectedPost(null);
      setNegotiationPrice('');
      loadSalePosts();
      alert('Request sent successfully!');
    } catch (error) {
      console.error('Error sending request:', error);
      alert('Error sending request. Please try again.');
    }
  };

  // Filter posts based on search criteria
  const filteredPosts = salePosts.filter(post => {
    const matchesName = !filters.cropName || 
      post.cropName.toLowerCase().includes(filters.cropName.toLowerCase());
    const matchesQuality = !filters.quality || post.quality === filters.quality;
    const matchesLocation = !filters.location || 
      post.location.toLowerCase().includes(filters.location.toLowerCase());
    return matchesName && matchesQuality && matchesLocation;
  });

  return (
    <div className="sale-posts-container">
      <div className="section-header">
        <h2>Available Crops</h2>
        <p>Browse and purchase crops directly from farmers</p>
      </div>

      <div className="filters-section">
        <div className="search-input">
          <input
            type="text"
            placeholder="Search by crop name"
            value={filters.cropName}
            onChange={(e) => setFilters({...filters, cropName: e.target.value})}
          />
        </div>

        <div className="filter-group">
          <select
            value={filters.quality}
            onChange={(e) => setFilters({...filters, quality: e.target.value})}
          >
            <option value="">All Qualities</option>
            <option value="A">Grade A</option>
            <option value="B">Grade B</option>
            <option value="C">Grade C</option>
          </select>

          <input
            type="text"
            placeholder="Filter by location"
            value={filters.location}
            onChange={(e) => setFilters({...filters, location: e.target.value})}
          />
        </div>
      </div>

      <div className="posts-grid">
        {filteredPosts.length === 0 ? (
          <div className="no-posts">
            <p>No sale posts available</p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <h3>{post.cropName}</h3>
                <span className="quality-badge">Grade {post.quality}</span>
              </div>
              
              <div className="post-details">
                <div className="detail-row">
                  <span>Quantity:</span>
                  <span>{post.quantity} {post.unit}</span>
                </div>
                <div className="detail-row">
                  <span>Expected Price:</span>
                  <span>₹{post.expectedPrice}</span>
                </div>
                <div className="detail-row">
                  <span>Location:</span>
                  <span>{post.location}</span>
                </div>
                <div className="detail-row">
                  <span>Harvest Date:</span>
                  <span>{new Date(post.harvestDate).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <span>Farmer:</span>
                  <span>{post.farmerDetails.fullName}</span>
                </div>
              </div>

              {post.description && (
                <div className="post-description">
                  <p>{post.description}</p>
                </div>
              )}

              <button 
                className="action-button primary"
                onClick={() => handleContact(post)}
                disabled={post.hasMyRequest}
              >
                {post.hasMyRequest ? 'Request Sent' : 'Contact Farmer'}
              </button>
            </div>
          ))
        )}
      </div>

      {showContactModal && selectedPost && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Contact Farmer</h3>
            
            <div className="farmer-details">
              <h4>Farmer Details</h4>
              <p><strong>Name:</strong> {selectedPost.farmerDetails.fullName}</p>
              <p><strong>Phone:</strong> {selectedPost.farmerDetails.phone}</p>
              <p><strong>Location:</strong> {selectedPost.location}</p>
            </div>

            <div className="price-details">
              <h4>Price Details</h4>
              <p><strong>Expected Price:</strong> ₹{selectedPost.expectedPrice}</p>
              
              <div className="negotiation-input">
                <label>Negotiated Price (₹):</label>
                <input
                  type="number"
                  value={negotiationPrice}
                  onChange={(e) => setNegotiationPrice(e.target.value)}
                  placeholder="Enter your price"
                />
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="action-button primary"
                onClick={() => handleSendRequest('accept')}
              >
                Accept Price
              </button>
              <button 
                className="action-button secondary"
                onClick={() => handleSendRequest('negotiate')}
                disabled={!negotiationPrice}
              >
                Send Negotiation Request
              </button>
              <button 
                className="action-button cancel"
                onClick={() => setShowContactModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewSalePosts; 