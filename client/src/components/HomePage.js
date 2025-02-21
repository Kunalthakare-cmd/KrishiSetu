import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const stats = [
    { number: '10K+', label: 'Farmers', icon: '👨‍🌾' },
    { number: '5K+', label: 'Traders', icon: '🏪' },
    { number: '2K+', label: 'Logistics Partners', icon: '🚛' },
    { number: '₹50Cr+', label: 'Monthly Transactions', icon: '💰' }
  ];

  const features = [
    {
      icon: '🌾',
      title: 'Smart Farming',
      description: 'Access modern farming techniques and real-time crop management solutions'
    },
    {
      icon: '💰',
      title: 'Better Prices',
      description: 'Get the best market prices for your crops with direct buyer connections'
    },
    {
      icon: '🚛',
      title: 'Efficient Logistics',
      description: 'Seamless transportation and delivery services for your agricultural needs'
    },
    {
      icon: '📱',
      title: 'Easy Platform',
      description: 'User-friendly interface with multilingual support for everyone'
    }
  ];

  return (
    <>
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Empowering Indian Agriculture with
              <span className="highlight"> Digital Innovation</span>
            </h1>
            <p className="hero-subtitle">
              Connect, trade, and grow with India's leading agricultural ecosystem platform
            </p>
            <div className="hero-buttons">
              <button 
                className="get-started-btn"
                onClick={() => navigate('/select-role')}
              >
                Get Started
                <span className="btn-arrow">→</span>
              </button>
            </div>

            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-info">
                    <span className="stat-number">{stat.number}</span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-image">
            <div className="image-container">
              <div className="modern-farming-bg"></div>
              <div className="floating-card card-1">
                <span className="card-icon">📈</span>
                <span className="card-text">Better Profits</span>
              </div>
              <div className="floating-card card-2">
                <span className="card-icon">🤝</span>
                <span className="card-text">Direct Trading</span>
              </div>
              <div className="floating-card card-3">
                <span className="card-icon">📱</span>
                <span className="card-text">Easy to Use</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-header">
          <h2>Why Choose KrishiSetu?</h2>
          <p>Experience the benefits of modern agricultural technology</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Agricultural Journey?</h2>
          <p>Join thousands of farmers, traders, and logistics partners on KrishiSetu</p>
          <button 
            className="cta-button"
            onClick={() => navigate('/select-role')}
          >
            Join KrishiSetu Today
            <span className="btn-arrow">→</span>
          </button>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-left">
            <h3>KrishiSetu</h3>
            <p>Empowering Indian Agriculture through technology and innovation</p>
            <div className="social-links">
              <button className="social-icon" aria-label="Phone">📱</button>
              <button className="social-icon" aria-label="Email">📧</button>
              <button className="social-icon" aria-label="Location">📍</button>
            </div>
          </div>
          <div className="footer-right">
            <h4>Quick Links</h4>
            <div className="footer-links">
              <button className="footer-link">About Us</button>
              <button className="footer-link">Contact</button>
              <button className="footer-link">Privacy Policy</button>
              <button className="footer-link">Terms of Use</button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 KrishiSetu. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default HomePage; 