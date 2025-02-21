import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await axios.post('http://localhost:5000/api/users/register', {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: role
        });

        // Store user and navigate to dashboard
        localStorage.setItem('currentUser', JSON.stringify(response.data));
        navigate('/dashboard');
      } catch (error) {
        setErrors({ email: error.response.data.message });
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <button className="back-arrow" onClick={() => navigate('/select-role')}>
          ←
        </button>

        <h1>{role && role.charAt(0).toUpperCase() + role.slice(1)} Registration</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName || ''}
              onChange={handleInputChange}
              className={errors.fullName ? 'error' : ''}
            />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email || ''}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone || ''}
              onChange={handleInputChange}
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password || ''}
              onChange={handleInputChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label>Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword || ''}
              onChange={handleInputChange}
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className={`register-btn ${role}-theme`}>
            Register Now
          </button>
        </form>
      </div>
    </div>
  );
}

export default Registration;
