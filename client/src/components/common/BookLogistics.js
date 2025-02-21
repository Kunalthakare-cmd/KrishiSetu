import React, { useState, useCallback } from 'react';

function BookLogistics({ pickupLocation, deliveryLocation, cropDetails, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [distance, setDistance] = useState(0);
  const [price, setPrice] = useState(0);

  const vehicleTypes = [
    {
      type: 'Mini Truck',
      capacity: '1-3 tons',
      basePrice: 15, // per km
      image: '🚛',
      minWeight: 1000,
      maxWeight: 3000
    },
    {
      type: 'Medium Truck',
      capacity: '3-7 tons',
      basePrice: 25, // per km
      image: '🚛',
      minWeight: 3000,
      maxWeight: 7000
    },
    {
      type: 'Heavy Truck',
      capacity: '7-15 tons',
      basePrice: 40, // per km
      image: '🚛',
      minWeight: 7000,
      maxWeight: 15000
    }
  ];

  // Calculate distance using coordinates
  const calculateDistance = useCallback(async (pickup, delivery) => {
    try {
      // Here you would typically use a mapping API like Google Maps
      // For demo, using a simplified calculation
      const distance = Math.floor(Math.random() * 500) + 100; // Random distance between 100-600 km
      return distance;
    } catch (error) {
      console.error('Error calculating distance:', error);
      return 0;
    }
  }, []);

  // Calculate price based on distance and vehicle type
  const calculatePrice = useCallback((distance, vehicleType) => {
    const basePrice = vehicleType.basePrice;
    const distancePrice = distance * basePrice;
    
    // Add loading/unloading charges
    const loadingCharges = 1000;
    
    // Add per ton charges
    const weightInTons = cropDetails.quantity;
    const perTonCharge = 100;
    const weightCharges = weightInTons * perTonCharge;
    
    return distancePrice + loadingCharges + weightCharges;
  }, [cropDetails.quantity]);

  const handleVehicleSelect = async (vehicle) => {
    setSelectedVehicle(vehicle);
    const calculatedDistance = await calculateDistance(pickupLocation, deliveryLocation);
    setDistance(calculatedDistance);
    const calculatedPrice = calculatePrice(calculatedDistance, vehicle);
    setPrice(calculatedPrice);
  };

  const handleBooking = async () => {
    try {
      setLoading(true);
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      
      const logisticsRequest = {
        id: Math.random().toString(36).substr(2, 9),
        requesterId: currentUser.id,
        requesterName: currentUser.fullName,
        requesterRole: currentUser.role,
        pickupLocation,
        deliveryLocation,
        cropDetails,
        vehicleType: selectedVehicle.type,
        distance,
        price,
        status: 'pending',
        createdAt: new Date().toISOString(),
        estimatedDeliveryTime: `${Math.ceil(distance/300)} days`, // Assuming 300km per day
        trackingUpdates: [{
          status: 'Request Created',
          timestamp: new Date().toISOString(),
          description: 'Logistics request has been created'
        }]
      };

      // Save to localStorage
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
      
      <div className="route-details">
        <div className="detail-row">
          <span>Pickup Location:</span>
          <span>{pickupLocation}</span>
        </div>
        <div className="detail-row">
          <span>Delivery Location:</span>
          <span>{deliveryLocation}</span>
        </div>
        <div className="detail-row">
          <span>Crop:</span>
          <span>{cropDetails.name}</span>
        </div>
        <div className="detail-row">
          <span>Quantity:</span>
          <span>{cropDetails.quantity} {cropDetails.unit}</span>
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
            </div>
          ))}
        </div>
      </div>

      {selectedVehicle && (
        <div className="price-details">
          <h4>Price Breakdown</h4>
          <div className="detail-row">
            <span>Distance:</span>
            <span>{distance} km</span>
          </div>
          <div className="detail-row">
            <span>Base Fare:</span>
            <span>₹{distance * selectedVehicle.basePrice}</span>
          </div>
          <div className="detail-row">
            <span>Loading/Unloading:</span>
            <span>₹1000</span>
          </div>
          <div className="detail-row">
            <span>Weight Charges:</span>
            <span>₹{cropDetails.quantity * 100}</span>
          </div>
          <div className="detail-row total">
            <span>Total Price:</span>
            <span>₹{price}</span>
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
        disabled={!selectedVehicle || loading}
      >
        {loading ? 'Processing...' : 'Book Now'}
      </button>
    </div>
  );
}

export default BookLogistics; 