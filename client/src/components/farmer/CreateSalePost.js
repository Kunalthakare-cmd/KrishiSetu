import React, { useState } from 'react';

function CreateSalePost() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const [postData, setPostData] = useState({
    cropName: '',
    quantity: '',
    unit: 'kg',
    expectedPrice: '',
    description: '',
    harvestDate: '',
    quality: 'A',
    location: '',
    images: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newPost = {
      id: Math.random().toString(36).substr(2, 9),
      farmerId: currentUser.id,
      farmerName: currentUser.fullName,
      status: 'active',
      createdAt: new Date().toISOString(),
      ...postData
    };

    // Get existing posts or initialize empty array
    const existingPosts = JSON.parse(localStorage.getItem('salePosts') || '[]');
    existingPosts.push(newPost);
    localStorage.setItem('salePosts', JSON.stringify(existingPosts));

    // Clear form
    setPostData({
      cropName: '',
      quantity: '',
      unit: 'kg',
      expectedPrice: '',
      description: '',
      harvestDate: '',
      quality: 'A',
      location: '',
      images: []
    });

    alert('Sale post created successfully!');
  };

  return (
    <div className="create-post-container">
      <h2>Create Sale Post</h2>
      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Crop Name *</label>
            <input
              type="text"
              value={postData.cropName}
              onChange={(e) => setPostData({...postData, cropName: e.target.value})}
              required
              placeholder="Enter crop name"
            />
          </div>

          <div className="form-group">
            <label>Quantity *</label>
            <div className="quantity-input">
              <input
                type="number"
                value={postData.quantity}
                onChange={(e) => setPostData({...postData, quantity: e.target.value})}
                required
                placeholder="Enter quantity"
              />
              <select
                value={postData.unit}
                onChange={(e) => setPostData({...postData, unit: e.target.value})}
              >
                <option value="kg">Kg</option>
                <option value="quintal">Quintal</option>
                <option value="ton">Ton</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Expected Price (₹) *</label>
            <input
              type="number"
              value={postData.expectedPrice}
              onChange={(e) => setPostData({...postData, expectedPrice: e.target.value})}
              required
              placeholder="Enter expected price"
            />
          </div>

          <div className="form-group">
            <label>Quality Grade *</label>
            <select
              value={postData.quality}
              onChange={(e) => setPostData({...postData, quality: e.target.value})}
            >
              <option value="A">Grade A</option>
              <option value="B">Grade B</option>
              <option value="C">Grade C</option>
            </select>
          </div>

          <div className="form-group">
            <label>Harvest Date *</label>
            <input
              type="date"
              value={postData.harvestDate}
              onChange={(e) => setPostData({...postData, harvestDate: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              value={postData.location}
              onChange={(e) => setPostData({...postData, location: e.target.value})}
              required
              placeholder="Enter your location"
            />
          </div>

          <div className="form-group full-width">
            <label>Description</label>
            <textarea
              value={postData.description}
              onChange={(e) => setPostData({...postData, description: e.target.value})}
              placeholder="Enter crop description"
              rows="4"
            />
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Create Post
        </button>
      </form>
    </div>
  );
}

export default CreateSalePost; 