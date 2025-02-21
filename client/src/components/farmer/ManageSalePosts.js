import React, { useState, useEffect, useCallback } from 'react';

function ManageSalePosts() {
  const [salePosts, setSalePosts] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const loadSalePosts = useCallback(() => {
    const posts = JSON.parse(localStorage.getItem('salePosts') || '[]');
    const farmerPosts = posts.filter(post => post.farmerId === currentUser.id);
    setSalePosts(farmerPosts);
  }, [currentUser.id]);

  useEffect(() => {
    loadSalePosts();
  }, [loadSalePosts]);

  const handleStatusUpdate = (postId, newStatus) => {
    const allPosts = JSON.parse(localStorage.getItem('salePosts') || '[]');
    const updatedPosts = allPosts.map(post => {
      if (post.id === postId) {
        return { ...post, status: newStatus };
      }
      return post;
    });
    localStorage.setItem('salePosts', JSON.stringify(updatedPosts));
    loadSalePosts();
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'active': return 'status-badge active';
      case 'sold': return 'status-badge sold';
      case 'cancelled': return 'status-badge cancelled';
      default: return 'status-badge';
    }
  };

  const getRequestCount = (postId) => {
    const requests = JSON.parse(localStorage.getItem('tradeRequests') || '[]');
    return requests.filter(req => req.postId === postId && req.status === 'pending').length;
  };

  return (
    <div className="manage-posts-container">
      <div className="section-header">
        <h2>My Sale Posts</h2>
        <p>Manage your crop sale posts and track their status</p>
      </div>

      <div className="posts-grid">
        {salePosts.length === 0 ? (
          <div className="no-posts">
            <p>No sale posts created yet</p>
          </div>
        ) : (
          salePosts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <h3>{post.cropName}</h3>
                <span className={getStatusBadgeClass(post.status)}>
                  {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                </span>
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
                  <span>Quality Grade:</span>
                  <span>{post.quality}</span>
                </div>
                <div className="detail-row">
                  <span>Harvest Date:</span>
                  <span>{new Date(post.harvestDate).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <span>Pending Requests:</span>
                  <span>{getRequestCount(post.id)}</span>
                </div>
                <div className="detail-row">
                  <span>Posted On:</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {post.description && (
                <div className="post-description">
                  <p>{post.description}</p>
                </div>
              )}

              {post.status === 'active' && (
                <div className="post-actions">
                  <button 
                    className="action-button secondary"
                    onClick={() => handleStatusUpdate(post.id, 'cancelled')}
                  >
                    Cancel Post
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

export default ManageSalePosts; 