import React, { useState } from 'react';
import Deliveries from '../logistics/Deliveries';

const TradeCompletion = () => {
  const [showLogistics, setShowLogistics] = useState(false);

  return (
    <div>
      {showLogistics ? (
        <Deliveries 
          trade={trade}
          onClose={() => setShowLogistics(false)}
        />
      ) : (
        <button
          className="action-button primary"
          onClick={() => setShowLogistics(true)}
        >
          Arrange Logistics
        </button>
      )}
    </div>
  );
};

export default TradeCompletion; 