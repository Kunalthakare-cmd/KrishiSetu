import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Auth() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const role = new URLSearchParams(location.search).get('role');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email: formData.email,
        password: formData.password
      });

      // Check if role matches
      if (response.data.role !== role) {
        setError(`You do not have access as a ${role}`);
        return;
      }

      // Store token and user details
      localStorage.setItem('currentUser', JSON.stringify(response.data));
      localStorage.setItem('authToken', response.data.token);

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <button className="back-arrow" onClick={() => navigate('/select-role')}>
          ←
        </button>
        
        <div className="auth-icon">
          {role === 'farmer' && '👨‍🌾'}
          {role === 'trader' && '🏪'}
          {role === 'logistics' && '🚛'}
        </div>

        <h1 className="auth-title">
          {role && role.charAt(0).toUpperCase() + role.slice(1)} Login
        </h1>
        <p className="auth-subtitle">
          Access your {role} dashboard
        </p>

        {error && <div className="error-message auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input 
                type="email" 
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="icon-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input 
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="icon-input"
                required
              />
              <button 
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button type="submit" className={`login-btn ${role}-theme`}>
            Login
          </button>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <p className="create-account">
            Don't have an account?
            <button 
              type="button"
              className="create-account-btn"
              onClick={() => navigate(`/auth/register?role=${role}`)}
            >
              Create Account
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Auth;
