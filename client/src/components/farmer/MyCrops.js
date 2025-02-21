import React, { useState, useEffect } from 'react';
import AddCrop from './AddCrop';

function MyCrops() {
  const [crops, setCrops] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    const allCrops = JSON.parse(localStorage.getItem('crops') || '[]');
    const farmerCrops = allCrops.filter(crop => crop.farmer === currentUser.id);
    setCrops(farmerCrops);
  }, [currentUser.id]);

  const handleAddCrop = (newCrop) => {
    setCrops([...crops, newCrop]);
  };

  const handleDeleteCrop = (cropId) => {
    const updatedCrops = crops.filter(crop => crop.id !== cropId);
    setCrops(updatedCrops);
    localStorage.setItem('crops', JSON.stringify(updatedCrops));
  };

  return (
    <div className="my-crops-container">
      <div className="section-header">
        <h2>My Crops</h2>
        <button 
          className="add-crop-btn"
          onClick={() => setShowAddModal(true)}
        >
          Add New Crop
        </button>
      </div>

      <div className="crops-grid">
        {crops.map((crop) => (
          <div key={crop.id} className="crop-card">
            <div className="crop-header">
              <h3>{crop.name}</h3>
              <span className={`status-badge ${crop.status}`}>
                {crop.status}
              </span>
            </div>
            
            <div className="crop-details">
              <p>
                <strong>Quantity:</strong> {crop.quantity} {crop.unit}
              </p>
              <p>
                <strong>Base Price:</strong> ₹{crop.basePrice}
              </p>
              <p>
                <strong>Category:</strong> {crop.category}
              </p>
              <p>
                <strong>Quality:</strong> Grade {crop.quality}
              </p>
              <p>
                <strong>Harvest Date:</strong> {new Date(crop.harvestDate).toLocaleDateString()}
              </p>
            </div>

            <div className="crop-actions">
              <button 
                className="edit-btn"
                onClick={() => console.log('Edit', crop.id)}
              >
                Edit
              </button>
              <button 
                className="delete-btn"
                onClick={() => handleDeleteCrop(crop.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <AddCrop 
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddCrop}
        />
      )}
    </div>
  );
}

export default MyCrops; 