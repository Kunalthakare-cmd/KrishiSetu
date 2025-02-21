import React, { useState } from 'react';
import './AddCropForm.css';

const AddCropForm = ({ onAddCrop }) => {
  const [cropData, setCropData] = useState({
    name: '',
    variety: '',
    expectedYield: '',
    plantingDate: '',
    harvestDate: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddCrop(cropData);
    setCropData({
      name: '',
      variety: '',
      expectedYield: '',
      plantingDate: '',
      harvestDate: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCropData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="add-crop-form">
      <h3>Add New Crop</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Crop Name:</label>
          <input
            type="text"
            name="name"
            value={cropData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Variety:</label>
          <input
            type="text"
            name="variety"
            value={cropData.variety}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Expected Yield (kg):</label>
          <input
            type="number"
            name="expectedYield"
            value={cropData.expectedYield}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Planting Date:</label>
          <input
            type="date"
            name="plantingDate"
            value={cropData.plantingDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Expected Harvest Date:</label>
          <input
            type="date"
            name="harvestDate"
            value={cropData.harvestDate}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-btn">Add Crop</button>
      </form>
    </div>
  );
};

export default AddCropForm; 