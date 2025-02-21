import React from 'react';

function AddressForm({ type, address, onChange }) {
  return (
    <div className="address-form">
      <div className="form-row">
        <input
          type="text"
          placeholder="Street Address"
          value={address.street}
          onChange={(e) => onChange(type, 'street', e.target.value)}
        />
      </div>
      <div className="form-row">
        <input
          type="text"
          placeholder="Landmark"
          value={address.landmark}
          onChange={(e) => onChange(type, 'landmark', e.target.value)}
        />
      </div>
      <div className="form-row double">
        <input
          type="text"
          placeholder="City"
          value={address.city}
          onChange={(e) => onChange(type, 'city', e.target.value)}
        />
        <input
          type="text"
          placeholder="State"
          value={address.state}
          onChange={(e) => onChange(type, 'state', e.target.value)}
        />
      </div>
      <div className="form-row">
        <input
          type="text"
          placeholder="PIN Code"
          value={address.pincode}
          onChange={(e) => onChange(type, 'pincode', e.target.value)}
        />
      </div>
      <div className="form-row double">
        <input
          type="text"
          placeholder="Contact Name"
          value={address.contactName}
          onChange={(e) => onChange(type, 'contactName', e.target.value)}
        />
        <input
          type="tel"
          placeholder="Contact Phone"
          value={address.contactPhone}
          onChange={(e) => onChange(type, 'contactPhone', e.target.value)}
        />
      </div>
    </div>
  );
}

export default AddressForm; 