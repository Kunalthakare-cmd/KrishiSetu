import React, { useState, useEffect, useCallback } from 'react';

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    unit: 'kg',
    purchasePrice: '',
    sellingPrice: '',
    category: '',
    supplier: '',
    purchaseDate: '',
    description: ''
  });

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const loadInventory = useCallback(() => {
    const allInventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    const userInventory = allInventory.filter(item => item.traderId === currentUser.id);
    setInventory(userInventory);
  }, [currentUser.id]);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const handleAddItem = (e) => {
    e.preventDefault();
    const item = {
      id: Math.random().toString(36).substr(2, 9),
      traderId: currentUser.id,
      traderName: currentUser.fullName,
      status: 'available',
      createdAt: new Date().toISOString(),
      ...newItem
    };

    const existingInventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    localStorage.setItem('inventory', JSON.stringify([...existingInventory, item]));

    loadInventory();
    setShowAddForm(false);
    setNewItem({
      name: '',
      quantity: '',
      unit: 'kg',
      purchasePrice: '',
      sellingPrice: '',
      category: '',
      supplier: '',
      purchaseDate: '',
      description: ''
    });
  };

  const handleUpdatePrice = (itemId, field, value) => {
    const updatedInventory = inventory.map(item => {
      if (item.id === itemId) {
        return { ...item, [field]: value };
      }
      return item;
    });
    localStorage.setItem('inventory', JSON.stringify(updatedInventory));
    setInventory(updatedInventory);
  };

  const handleRemoveItem = (itemId) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      const updatedInventory = inventory.filter(item => item.id !== itemId);
      localStorage.setItem('inventory', JSON.stringify(updatedInventory));
      setInventory(updatedInventory);
    }
  };

  return (
    <div className="inventory-section">
      <div className="inventory-header">
        <h2>Inventory Management</h2>
        <button 
          className="action-button"
          onClick={() => setShowAddForm(true)}
        >
          Add New Item
        </button>
      </div>

      {showAddForm && (
        <div className="add-item-form">
          <form onSubmit={handleAddItem}>
            <div className="form-grid">
              <div className="form-group">
                <label>Item Name *</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  required
                  placeholder="Enter item name"
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="cereals">Cereals</option>
                  <option value="pulses">Pulses</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="fruits">Fruits</option>
                  <option value="spices">Spices</option>
                </select>
              </div>

              <div className="form-group">
                <label>Quantity *</label>
                <div className="quantity-input">
                  <input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                    required
                    placeholder="Enter quantity"
                  />
                  <select
                    value={newItem.unit}
                    onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                  >
                    <option value="kg">Kg</option>
                    <option value="quintal">Quintal</option>
                    <option value="ton">Ton</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Purchase Price (₹) *</label>
                <input
                  type="number"
                  value={newItem.purchasePrice}
                  onChange={(e) => setNewItem({...newItem, purchasePrice: e.target.value})}
                  required
                  placeholder="Enter purchase price"
                />
              </div>

              <div className="form-group">
                <label>Selling Price (₹) *</label>
                <input
                  type="number"
                  value={newItem.sellingPrice}
                  onChange={(e) => setNewItem({...newItem, sellingPrice: e.target.value})}
                  required
                  placeholder="Enter selling price"
                />
              </div>

              <div className="form-group">
                <label>Supplier Name</label>
                <input
                  type="text"
                  value={newItem.supplier}
                  onChange={(e) => setNewItem({...newItem, supplier: e.target.value})}
                  placeholder="Enter supplier name"
                />
              </div>

              <div className="form-group">
                <label>Purchase Date *</label>
                <input
                  type="date"
                  value={newItem.purchaseDate}
                  onChange={(e) => setNewItem({...newItem, purchaseDate: e.target.value})}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  placeholder="Enter item description"
                  rows="3"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="action-button">Add Item</button>
              <button 
                type="button" 
                className="action-button secondary-button"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="inventory-grid">
        {inventory.map(item => (
          <div key={item.id} className="inventory-card">
            <div className="card-header">
              <h3>{item.name}</h3>
              <span className="category-badge">{item.category}</span>
            </div>
            
            <div className="item-details">
              <div className="detail-row">
                <span>Quantity:</span>
                <div className="quantity-update">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleUpdatePrice(item.id, 'quantity', e.target.value)}
                  />
                  <span>{item.unit}</span>
                </div>
              </div>

              <div className="detail-row">
                <span>Purchase Price:</span>
                <span>₹{item.purchasePrice}</span>
              </div>

              <div className="detail-row">
                <span>Selling Price:</span>
                <div className="price-update">
                  <input
                    type="number"
                    value={item.sellingPrice}
                    onChange={(e) => handleUpdatePrice(item.id, 'sellingPrice', e.target.value)}
                  />
                </div>
              </div>

              <div className="detail-row">
                <span>Purchase Date:</span>
                <span>{new Date(item.purchaseDate).toLocaleDateString()}</span>
              </div>

              {item.supplier && (
                <div className="detail-row">
                  <span>Supplier:</span>
                  <span>{item.supplier}</span>
                </div>
              )}
            </div>

            <div className="item-actions">
              <button 
                className="action-button secondary-button"
                onClick={() => handleRemoveItem(item.id)}
              >
                Remove Item
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Inventory; 