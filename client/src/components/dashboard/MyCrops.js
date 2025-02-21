import React, { useState } from 'react';
import './Dashboard.css';

const MyCrops = ({ crops, onAddCrop }) => {
  const [newCrop, setNewCrop] = useState({
    name: '',
    variety: '',
    expectedYield: '',
    plantingDate: '',
    harvestDate: '',
    cropImage: null,
    description: '',
    price: ''
  });
  const [showForm, setShowForm] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'cropImage') {
      setNewCrop(prev => ({
        ...prev,
        cropImage: files[0]
      }));
    } else {
      setNewCrop(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    // Append all crop data to FormData
    Object.keys(newCrop).forEach(key => {
      formData.append(key, newCrop[key]);
    });

    try {
      await onAddCrop(formData);
      setNewCrop({
        name: '',
        variety: '',
        expectedYield: '',
        plantingDate: '',
        harvestDate: '',
        cropImage: null,
        description: '',
        price: ''
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error adding crop:', error);
    }
  };

  return (
    <div className="dashboard-section">
      <div className="crops-header">
        <h2>My Crops</h2>
        <button 
          className="btn-primary add-crop-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add New Crop'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="crop-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Crop Name*</label>
              <input
                type="text"
                name="name"
                value={newCrop.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Variety</label>
              <input
                type="text"
                name="variety"
                value={newCrop.variety}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Expected Yield (kg)*</label>
              <input
                type="number"
                name="expectedYield"
                value={newCrop.expectedYield}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Price per kg (₹)*</label>
              <input
                type="number"
                name="price"
                value={newCrop.price}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Planting Date*</label>
              <input
                type="date"
                name="plantingDate"
                value={newCrop.plantingDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Expected Harvest Date*</label>
              <input
                type="date"
                name="harvestDate"
                value={newCrop.harvestDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Crop Image</label>
              <input
                type="file"
                name="cropImage"
                accept="image/*"
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={newCrop.description}
                onChange={handleInputChange}
                rows="3"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">Add Crop</button>
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="crops-grid">
        {crops.length > 0 ? (
          crops.map(crop => (
            <div key={crop._id || crop.id} className="crop-card">
              {crop.cropImage && (
                <div className="crop-image">
                  <img src={crop.cropImage} alt={crop.name} />
                </div>
              )}
              <div className="crop-info">
                <h3>{crop.name}</h3>
                <p><strong>Variety:</strong> {crop.variety || 'N/A'}</p>
                <p><strong>Expected Yield:</strong> {crop.expectedYield}kg</p>
                <p><strong>Price:</strong> ₹{crop.price}/kg</p>
                <p><strong>Planting Date:</strong> {new Date(crop.plantingDate).toLocaleDateString()}</p>
                <p><strong>Harvest Date:</strong> {new Date(crop.harvestDate).toLocaleDateString()}</p>
                {crop.description && (
                  <p><strong>Description:</strong> {crop.description}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="no-crops">No crops added yet. Add your first crop!</p>
        )}
      </div>
    </div>
  );
};

export default MyCrops; 