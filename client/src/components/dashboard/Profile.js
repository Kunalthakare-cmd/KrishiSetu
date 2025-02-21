import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    farmName: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/farmer/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/farmer/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(profile)
      });
      if (response.ok) {
        setIsEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="dashboard-section">
      <h2>Farmer Profile</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({...profile, name: e.target.value})}
            disabled={!isEditing}
          />
        </div>
        {/* Add other profile fields similarly */}
        <div className="form-actions">
          {isEditing ? (
            <>
              <button type="submit" className="btn-primary">Save</button>
              <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">Cancel</button>
            </>
          ) : (
            <button type="button" onClick={() => setIsEditing(true)} className="btn-primary">Edit Profile</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Profile; 