import React, { useState, useCallback } from 'react';
import AddressForm from './AddressForm';

function BookLogistics({ trade, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [distance, setDistance] = useState(0);
  const [priceDetails, setPriceDetails] = useState(null);
  const [addressDetails, setAddressDetails] = useState({
    pickup: {
      street: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
      contactName: '',
      contactPhone: ''
    },
    delivery: {
      street: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
      contactName: '',
      contactPhone: ''
    }
  });

  const vehicleTypes = [
    {
      type: 'Mini Truck',
      capacity: '1-3 tons',
      basePrice: 15, // per km
      image: '🚛',
      minWeight: 1000,
      maxWeight: 3000,
      features: ['Covered', 'City-friendly', 'Quick delivery']
    },
    {
      type: 'Medium Truck',
      capacity: '3-7 tons',
      basePrice: 25,
      image: '🚛',
      minWeight: 3000,
      maxWeight: 7000,
      features: ['Temperature controlled', 'GPS tracking', 'Interstate permit']
    },
    {
      type: 'Heavy Truck',
      capacity: '7-15 tons',
      basePrice: 40,
      image: '🚛',
      minWeight: 7000,
      maxWeight: 15000,
      features: ['Cold storage', 'Multi-axle', 'Long distance']
    }
  ];

  const calculateDistance = useCallback(async (pickup, delivery) => {
    try {
      // Here you would use Google Maps Distance Matrix API
      // For demo, using pincode difference as rough estimate
      const pincodeDiff = Math.abs(parseInt(pickup.pincode) - parseInt(delivery.pincode));
      const estimatedDistance = pincodeDiff * 0.8; // rough estimation
      return Math.max(estimatedDistance, 50); // minimum 50km
    } catch (error) {
      console.error('Error calculating distance:', error);
      return 0;
    }
  }, []);

  const calculatePrice = useCallback((distance, vehicle, weight) => {
    const basePrice = vehicle.basePrice;
    const distancePrice = distance * basePrice;
    
    // Add loading/unloading charges
    const loadingCharges = 1000;
    
    // Add weight charges
    const weightInTons = weight / 1000; // convert kg to tons
    const perTonCharge = 100;
    const weightCharges = weightInTons * perTonCharge;
    
    // Add fuel surcharge
    const fuelSurcharge = distancePrice * 0.1;
    
    // Add insurance (0.5% of cargo value)
    const cargoValue = trade.price * weight;
    const insurance = cargoValue * 0.005;
    
    return {
      base: distancePrice,
      loading: loadingCharges,
      weight: weightCharges,
      fuel: fuelSurcharge,
      insurance: insurance,
      total: distancePrice + loadingCharges + weightCharges + fuelSurcharge + insurance
    };
  }, [trade.price]);

  const handleAddressChange = (type, field, value) => {
    setAddressDetails(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  const handleVehicleSelect = async (vehicle) => {
    setSelectedVehicle(vehicle);
    if (addressDetails.pickup.pincode && addressDetails.delivery.pincode) {
      const calculatedDistance = await calculateDistance(addressDetails.pickup, addressDetails.delivery);
      setDistance(calculatedDistance);
      const calculatedPrice = calculatePrice(calculatedDistance, vehicle, trade.quantity);
      setPriceDetails(calculatedPrice);
    }
  };

  const handleBooking = async () => {
    try {
      setLoading(true);
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      
      const logisticsRequest = {
        id: Math.random().toString(36).substr(2, 9),
        tradeId: trade.id,
        requesterId: currentUser.id,
        requesterName: currentUser.fullName,
        requesterRole: currentUser.role,
        cropName: trade.cropName,
        quantity: trade.quantity,
        unit: trade.unit,
        pickupAddress: addressDetails.pickup,
        deliveryAddress: addressDetails.delivery,
        vehicleType: selectedVehicle.type,
        distance,
        price: priceDetails,
        status: 'pending',
        createdAt: new Date().toISOString(),
        estimatedDeliveryTime: `${Math.ceil(distance/300)} days`,
        trackingUpdates: [{
          status: 'Request Created',
          timestamp: new Date().toISOString(),
          description: 'Logistics request has been created'
        }]
      };

      const existingRequests = JSON.parse(localStorage.getItem('logisticsRequests') || '[]');
      localStorage.setItem('logisticsRequests', JSON.stringify([...existingRequests, logisticsRequest]));

      onSuccess(logisticsRequest);
    } catch (error) {
      console.error('Error booking logistics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-logistics-container">
      <h3>Book Logistics</h3>
      
      <div className="address-section">
        <div className="pickup-address">
          <h4>Pickup Address</h4>
          <AddressForm
            type="pickup"
            address={addressDetails.pickup}
            onChange={handleAddressChange}
          />
        </div>
        
        <div className="delivery-address">
          <h4>Delivery Address</h4>
          <AddressForm
            type="delivery"
            address={addressDetails.delivery}
            onChange={handleAddressChange}
          />
        </div>
      </div>

      <div className="vehicle-selection">
        <h4>Select Vehicle Type</h4>
        <div className="vehicle-grid">
          {vehicleTypes.map(vehicle => (
            <div 
              key={vehicle.type}
              className={`vehicle-card ${selectedVehicle?.type === vehicle.type ? 'selected' : ''}`}
              onClick={() => handleVehicleSelect(vehicle)}
            >
              <div className="vehicle-icon">{vehicle.image}</div>
              <h4>{vehicle.type}</h4>
              <p>Capacity: {vehicle.capacity}</p>
              <p>Base Rate: ₹{vehicle.basePrice}/km</p>
              <ul className="vehicle-features">
                {vehicle.features.map(feature => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {selectedVehicle && priceDetails && (
        <div className="price-details">
          <h4>Price Breakdown</h4>
          <div className="detail-row">
            <span>Distance:</span>
            <span>{distance} km</span>
          </div>
          <div className="detail-row">
            <span>Base Fare:</span>
            <span>₹{priceDetails.base}</span>
          </div>
          <div className="detail-row">
            <span>Loading/Unloading:</span>
            <span>₹{priceDetails.loading}</span>
          </div>
          <div className="detail-row">
            <span>Weight Charges:</span>
            <span>₹{priceDetails.weight}</span>
          </div>
          <div className="detail-row">
            <span>Fuel Surcharge:</span>
            <span>₹{priceDetails.fuel}</span>
          </div>
          <div className="detail-row">
            <span>Insurance:</span>
            <span>₹{priceDetails.insurance}</span>
          </div>
          <div className="detail-row total">
            <span>Total Price:</span>
            <span>₹{priceDetails.total}</span>
          </div>
          <div className="detail-row">
            <span>Estimated Delivery Time:</span>
            <span>{Math.ceil(distance/300)} days</span>
          </div>
        </div>
      )}

      <button
        className="action-button primary"
        onClick={handleBooking}
        disabled={!selectedVehicle || loading || !addressDetails.pickup.pincode || !addressDetails.delivery.pincode}
      >
        {loading ? 'Processing...' : 'Book Now'}
      </button>
    </div>
  );
}

export default BookLogistics; 