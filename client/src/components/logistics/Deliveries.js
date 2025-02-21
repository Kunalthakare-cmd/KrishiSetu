import React, { useState, useEffect, useCallback } from 'react';
import BookLogistics from './BookLogistics';

function Deliveries({ trade, onClose }) {
  const [showBooking, setShowBooking] = useState(false);
  const [deliveries, setDeliveries] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const loadDeliveries = useCallback(() => {
    const allRequests = JSON.parse(localStorage.getItem('logisticsRequests') || '[]');
    const tradeDeliveries = allRequests.filter(req => 
      req.tradeId === trade.id && 
      (req.requesterId === currentUser.id || trade.farmerId === currentUser.id)
    );
    setDeliveries(tradeDeliveries);
  }, [trade.id, currentUser.id, trade.farmerId]);

  useEffect(() => {
    loadDeliveries();
  }, [loadDeliveries]);

  const handleBookingSuccess = (request) => {
    setShowBooking(false);
    loadDeliveries();
  };

  return (
    <div className="deliveries-container">
      <div className="deliveries-header">
        <h3>Logistics & Delivery</h3>
        {deliveries.length === 0 && (
          <button 
            className="action-button primary"
            onClick={() => setShowBooking(true)}
          >
            Book Logistics
          </button>
        )}
      </div>

      {showBooking ? (
        <BookLogistics 
          trade={trade} 
          onSuccess={handleBookingSuccess}
        />
      ) : (
        <div className="deliveries-list">
          {deliveries.map(delivery => (
            <div key={delivery.id} className="delivery-card">
              <div className="delivery-header">
                <h4>Delivery #{delivery.id.slice(-4)}</h4>
                <span className={`status-badge ${delivery.status}`}>
                  {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                </span>
              </div>

              <div className="addresses">
                <div className="pickup">
                  <h5>Pickup Address</h5>
                  <p>{delivery.pickupAddress.street}</p>
                  <p>{delivery.pickupAddress.landmark}</p>
                  <p>
                    {delivery.pickupAddress.city}, {delivery.pickupAddress.state} - {delivery.pickupAddress.pincode}
                  </p>
                  <p>Contact: {delivery.pickupAddress.contactName}</p>
                  <p>Phone: {delivery.pickupAddress.contactPhone}</p>
                </div>

                <div className="delivery">
                  <h5>Delivery Address</h5>
                  <p>{delivery.deliveryAddress.street}</p>
                  <p>{delivery.deliveryAddress.landmark}</p>
                  <p>
                    {delivery.deliveryAddress.city}, {delivery.deliveryAddress.state} - {delivery.deliveryAddress.pincode}
                  </p>
                  <p>Contact: {delivery.deliveryAddress.contactName}</p>
                  <p>Phone: {delivery.deliveryAddress.contactPhone}</p>
                </div>
              </div>

              <div className="delivery-details">
                <div className="detail-row">
                  <span>Vehicle Type:</span>
                  <span>{delivery.vehicleType}</span>
                </div>
                <div className="detail-row">
                  <span>Distance:</span>
                  <span>{delivery.distance} km</span>
                </div>
                <div className="detail-row">
                  <span>Total Price:</span>
                  <span>₹{delivery.price.total}</span>
                </div>
                <div className="detail-row">
                  <span>Estimated Delivery:</span>
                  <span>{delivery.estimatedDeliveryTime}</span>
                </div>
              </div>

              {delivery.logisticsProviderId && (
                <div className="provider-details">
                  <h5>Logistics Provider</h5>
                  <p>{delivery.providerName}</p>
                  <p>Contact: {delivery.providerPhone}</p>
                </div>
              )}

              <div className="tracking-timeline">
                <h5>Delivery Updates</h5>
                {delivery.trackingUpdates.map((update, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <span className="update-time">
                        {new Date(update.timestamp).toLocaleString()}
                      </span>
                      <span className="update-status">{update.status}</span>
                      <p className="update-description">{update.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Deliveries; 