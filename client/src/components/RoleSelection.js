import React from 'react';
import { useNavigate } from 'react-router-dom';

function RoleSelection() {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    navigate(`/auth/login?role=${role}`);
  };

  return (
    <div className="role-selection-page">
      <div className="role-content">
        <h1>Select Your Role</h1>
        <p>Choose how you want to use KrishiSetu</p>

        <div className="role-cards">
          <div className="role-card farmer" onClick={() => handleRoleSelect('farmer')}>
            <div className="role-icon">👨‍🌾</div>
            <div className="role-info">
              <h3>Farmer</h3>
              <p>Sell your crops directly to buyers</p>
              <ul>
                <li>List your produce</li>
                <li>Get best market prices</li>
                <li>Direct buyer connection</li>
              </ul>
            </div>
            <button className="role-btn">Continue as Farmer</button>
          </div>

          <div className="role-card trader" onClick={() => handleRoleSelect('trader')}>
            <div className="role-icon">🏪</div>
            <div className="role-info">
              <h3>Trader</h3>
              <p>Buy crops directly from farmers</p>
              <ul>
                <li>Browse available crops</li>
                <li>Competitive prices</li>
                <li>Quality assurance</li>
              </ul>
            </div>
            <button className="role-btn">Continue as Trader</button>
          </div>

          <div className="role-card logistics" onClick={() => handleRoleSelect('logistics')}>
            <div className="role-icon">🚛</div>
            <div className="role-info">
              <h3>Logistics Partner</h3>
              <p>Provide transportation services</p>
              <ul>
                <li>Manage deliveries</li>
                <li>Track shipments</li>
                <li>Optimize routes</li>
              </ul>
            </div>
            <button className="role-btn">Continue as Logistics Partner</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoleSelection; 