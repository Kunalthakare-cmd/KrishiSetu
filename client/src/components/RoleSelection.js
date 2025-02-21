import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TractorIcon, StoreIcon, TruckIcon } from './Icons';

function RoleSelection() {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    navigate(`/auth/login?role=${role}`);
  };

  return (
    <div className="role-selection-page">
      <h1 className="page-title">Choose Your Role</h1>
      <p className="page-subtitle">
        Select your role to access personalized features and services
      </p>
      
      <div className="role-cards">
        <div className="role-card" onClick={() => handleRoleSelect('farmer')}>
          <div className="role-icon farmer-icon">
            <TractorIcon />
          </div>
          <h2>Farmer</h2>
          <p>List your crops and connect with buyers</p>
          <button className="role-button farmer-button">
            Continue as Farmer
          </button>
        </div>

        <div className="role-card" onClick={() => handleRoleSelect('trader')}>
          <div className="role-icon trader-icon">
            <StoreIcon />
          </div>
          <h2>Trader</h2>
          <p>Buy crops and manage your inventory</p>
          <button className="role-button trader-button">
            Continue as Trader
          </button>
        </div>

        <div className="role-card" onClick={() => handleRoleSelect('logistics')}>
          <div className="role-icon logistics-icon">
            <TruckIcon />
          </div>
          <h2>Logistics</h2>
          <p>Provide transportation services</p>
          <button className="role-button logistics-button">
            Continue as Logistics
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoleSelection; 