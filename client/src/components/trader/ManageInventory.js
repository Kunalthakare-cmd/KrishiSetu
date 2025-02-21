import React, { useState, useEffect } from 'react';

function ManageInventory() {
  const [inventory, setInventory] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    const allInventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    const userInventory = allInventory.filter(item => item.traderId === currentUser.id);
    setInventory(userInventory);
  }, [currentUser.id]);

  const handleUpdatePrice = (itemId, newPrice) => {
    const updatedInventory = inventory.map(item => 
      item.id === itemId ? { ...item, sellingPrice: newPrice } : item
    );
    setInventory(updatedInventory);
    localStorage.setItem('inventory', JSON.stringify(updatedInventory));
  };

  return (
    <div className="manage-inventory">
      <div className="inventory-header">
        <h2>Manage Inventory</h2>
        <button className="add-item-btn">Add New Item</button>
      </div>

      <div className="inventory-grid">
        {inventory.map(item => (
          <div key={item.id} className="inventory-card">
            <div className="item-header">
              <h3>{item.name}</h3>
              <span className={`status-badge ${item.status}`}>{item.status}</span>
            </div>
            <div className="item-details">
              <p>Quantity: {item.quantity} {item.unit}</p>
              <p>Purchase Price: ₹{item.purchasePrice}</p>
              <div className="price-update">
                <label>Selling Price:</label>
                <input 
                  type="number" 
                  value={item.sellingPrice}
                  onChange={(e) => handleUpdatePrice(item.id, e.target.value)}
                />
              </div>
            </div>
            <div className="item-actions">
              <button>Update Stock</button>
              <button>Remove Item</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageInventory; 