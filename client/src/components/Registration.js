import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Registration() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const role = new URLSearchParams(location.search).get('role');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Basic validations
    if (!formData.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.password?.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Role specific validations
    if (role === 'farmer' && !formData.landSize) {
      newErrors.landSize = 'Land size is required';
    }
    
    if (role === 'trader' && !formData.businessName?.trim()) {
      newErrors.businessName = 'Business name is required';
    }
    
    if (role === 'logistics' && !formData.fleetSize) {
      newErrors.fleetSize = 'Fleet size is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Add role and creation date to the data
      const userData = {
        ...formData,
        role,
        createdAt: new Date().toISOString()
      };

      // Get existing users or initialize empty array
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if email already exists
      if (existingUsers.some(user => user.email === userData.email)) {
        setErrors({ email: 'Email already registered' });
        return;
      }

      // Add new user
      existingUsers.push(userData);
      localStorage.setItem('users', JSON.stringify(existingUsers));

      // Store current user
      localStorage.setItem('currentUser', JSON.stringify(userData));

      // Navigate to dashboard or success page
      navigate('/dashboard');
    }
  };

  const roleSpecificFields = {
    farmer: (
      <div className="form-group">
        <label>Land Size (in acres) *</label>
        <input
          type="number"
          name="landSize"
          placeholder="Enter land size"
          value={formData.landSize || ''}
          onChange={handleInputChange}
          className={errors.landSize ? 'error' : ''}
        />
        {errors.landSize && <span className="error-message">{errors.landSize}</span>}
      </div>
    ),
    trader: (
      <div className="form-group">
        <label>Business Name *</label>
        <input
          type="text"
          name="businessName"
          placeholder="Enter business name"
          value={formData.businessName || ''}
          onChange={handleInputChange}
          className={errors.businessName ? 'error' : ''}
        />
        {errors.businessName && <span className="error-message">{errors.businessName}</span>}
      </div>
    ),
    logistics: (
      <>
        <div className="form-group">
          <label>Company Name *</label>
          <div className="input-wrapper">
            <span className="input-icon">��</span>
            <input
              type="text"
              name="companyName"
              placeholder="Enter company name"
              value={formData.companyName || ''}
              onChange={handleInputChange}
              className={errors.companyName ? 'error' : ''}
            />
          </div>
          {errors.companyName && <span className="error-message">{errors.companyName}</span>}
        </div>

        <div className="form-group">
          <label>Vehicle Type *</label>
          <div className="input-wrapper">
            <span className="input-icon">🚛</span>
            <select
              name="vehicleType"
              value={formData.vehicleType || ''}
              onChange={handleInputChange}
              className={errors.vehicleType ? 'error' : ''}
            >
              <option value="">Select vehicle type</option>
              <option value="mini-truck">Mini Truck</option>
              <option value="pickup">Pickup Truck</option>
              <option value="truck">Heavy Truck</option>
              <option value="refrigerated">Refrigerated Truck</option>
              <option value="container">Container Truck</option>
            </select>
          </div>
          {errors.vehicleType && <span className="error-message">{errors.vehicleType}</span>}
        </div>

        <div className="form-group">
          <label>Fleet Size *</label>
          <div className="input-wrapper">
            <span className="input-icon">🚚</span>
            <input
              type="number"
              name="fleetSize"
              placeholder="Number of vehicles"
              value={formData.fleetSize || ''}
              onChange={handleInputChange}
              className={errors.fleetSize ? 'error' : ''}
            />
          </div>
          {errors.fleetSize && <span className="error-message">{errors.fleetSize}</span>}
        </div>
      </>
    )
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <button className="back-arrow" onClick={() => navigate('/select-role')}>
          ←
        </button>

        <div className="auth-header">
          <div className={`auth-icon ${role}-icon`}>
            {role === 'farmer' && '👨‍🌾'}
            {role === 'trader' && '🏪'}
            {role === 'logistics' && '��'}
          </div>
          <h1 className="auth-title">
            {role && role.charAt(0).toUpperCase() + role.slice(1)} Registration
          </h1>
          <p className="auth-subtitle">Join our farming community</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name *</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName || ''}
                  onChange={handleInputChange}
                  className={errors.fullName ? 'error' : ''}
                />
              </div>
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label>Email *</label>
              <div className="input-wrapper">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                />
              </div>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <div className="input-wrapper">
                <span className="input-icon">📱</span>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  className={errors.phone ? 'error' : ''}
                />
              </div>
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            {roleSpecificFields[role]}

            <div className="form-group">
              <label>Password *</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password || ''}
                  onChange={handleInputChange}
                  className={errors.password ? 'error' : ''}
                />
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label>Confirm Password *</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword || ''}
                  onChange={handleInputChange}
                  className={errors.confirmPassword ? 'error' : ''}
                />
              </div>
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>
          </div>

          <button type="submit" className={`register-btn ${role}-theme`}>
            Register Now
          </button>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <p className="login-link">
            Already have an account?
            <button
              type="button"
              className="login-link-btn"
              onClick={() => navigate(`/auth/login?role=${role}`)}
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Registration; 