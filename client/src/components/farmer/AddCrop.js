import React, { useState } from 'react';

function AddCrop({ onClose, onAdd }) {
  const [cropData, setCropData] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: 'kg',
    basePrice: '',
    description: '',
    harvestDate: '',
    quality: 'A'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const userId = JSON.parse(localStorage.getItem('currentUser')).id;
    
    const newCrop = {
      ...cropData,
      farmer: userId,
      status: 'available',
      createdAt: new Date().toISOString(),
      id: Math.random().toString(36).substr(2, 9)
    };

    // Get existing crops or initialize
    const existingCrops = JSON.parse(localStorage.getItem('crops') || '[]');
    existingCrops.push(newCrop);
    localStorage.setItem('crops', JSON.stringify(existingCrops));

    onAdd(newCrop);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Crop</h2>
        <form onSubmit={handleSubmit} className="crop-form">
          <div className="form-group">
            <label>Crop Name *</label>
            <input
              type="text"
              value={cropData.name}
              onChange={(e) => setCropData({...cropData, name: e.target.value})}
              required
              placeholder="Enter crop name"
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              value={cropData.category}
              onChange={(e) => setCropData({...cropData, category: e.target.value})}
              required
            >
              <option value="">Select category</option>
              <option value="cereals">Cereals</option>
              <option value="pulses">Pulses</option>
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="oilseeds">Oilseeds</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Quantity *</label>
              <input
                type="number"
                value={cropData.quantity}
                onChange={(e) => setCropData({...cropData, quantity: e.target.value})}
                required
                placeholder="Enter quantity"
              />
            </div>

            <div className="form-group">
              <label>Unit *</label>
              <select
                value={cropData.unit}
                onChange={(e) => setCropData({...cropData, unit: e.target.value})}
                required
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="quintal">Quintal</option>
                <option value="ton">Ton</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Base Price (₹) *</label>
            <input
              type="number"
              value={cropData.basePrice}
              onChange={(e) => setCropData({...cropData, basePrice: e.target.value})}
              required
              placeholder="Enter base price"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={cropData.description}
              onChange={(e) => setCropData({...cropData, description: e.target.value})}
              placeholder="Enter crop description"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Harvest Date *</label>
              <input
                type="date"
                value={cropData.harvestDate}
                onChange={(e) => setCropData({...cropData, harvestDate: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Quality Grade *</label>
              <select
                value={cropData.quality}
                onChange={(e) => setCropData({...cropData, quality: e.target.value})}
                required
              >
                <option value="A">Grade A</option>
                <option value="B">Grade B</option>
                <option value="C">Grade C</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Add Crop
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCrop; 