import React, { useState, useEffect } from 'react';

function BrowseCrops() {
  const [availableCrops, setAvailableCrops] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    quality: ''
  });

  useEffect(() => {
    // Get crops from localStorage
    const allCrops = JSON.parse(localStorage.getItem('crops') || '[]');
    const available = allCrops.filter(crop => crop.status === 'available');
    setAvailableCrops(available);
  }, []);

  const handlePlaceBid = (cropId) => {
    // Implement bid placement logic
    console.log('Placing bid for crop:', cropId);
  };

  return (
    <div className="browse-crops">
      <div className="filters-section">
        <select 
          value={filters.category}
          onChange={(e) => setFilters({...filters, category: e.target.value})}
        >
          <option value="">All Categories</option>
          <option value="cereals">Cereals</option>
          <option value="pulses">Pulses</option>
          <option value="vegetables">Vegetables</option>
          <option value="fruits">Fruits</option>
        </select>
        {/* Add more filters */}
      </div>

      <div className="crops-grid">
        {availableCrops.map(crop => (
          <div key={crop.id} className="crop-card">
            <div className="crop-header">
              <h3>{crop.name}</h3>
              <span className="quality-badge">Grade {crop.quality}</span>
            </div>
            <div className="crop-details">
              <p>Quantity: {crop.quantity} {crop.unit}</p>
              <p>Base Price: ₹{crop.basePrice}</p>
              <p>Location: {crop.location}</p>
            </div>
            <button 
              className="bid-button"
              onClick={() => handlePlaceBid(crop.id)}
            >
              Place Bid
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BrowseCrops; 