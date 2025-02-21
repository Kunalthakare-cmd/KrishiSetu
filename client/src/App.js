import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import RoleSelection from './components/RoleSelection';
import Auth from './components/Auth';
import Registration from './components/Registration';
import AdminDashboard from './components/AdminDashboard';
import RoleDashboard from './components/RoleDashboard';
import Navbar from './components/Navbar';
import './App.css';

// Create a layout component for the home page
const HomeLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-info">
            <h3>KrishiSetu</h3>
            <p>Empowering Indian Agriculture through technology and innovation</p>
            <div className="social-links">
              <button className="social-icon" aria-label="Phone">📱</button>
              <button className="social-icon" aria-label="Email">📧</button>
              <button className="social-icon" aria-label="Location">📍</button>
            </div>
          </div>
          
          <div className="footer-grid">
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><button className="footer-link">About Us</button></li>
                <li><button className="footer-link">Our Mission</button></li>
                <li><button className="footer-link">Success Stories</button></li>
                <li><button className="footer-link">Blog</button></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Services</h4>
              <ul>
                <li><button className="footer-link">Smart Farming</button></li>
                <li><button className="footer-link">Market Access</button></li>
                <li><button className="footer-link">Logistics</button></li>
                <li><button className="footer-link">Advisory</button></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li><button className="footer-link">Help Center</button></li>
                <li><button className="footer-link">FAQs</button></li>
                <li><button className="footer-link">Contact Us</button></li>
                <li><button className="footer-link">Terms of Service</button></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Newsletter</h4>
              <p>Subscribe to our newsletter for updates</p>
              <div className="newsletter-form">
                <input type="email" placeholder="Enter your email" />
                <button>Subscribe</button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 KrishiSetu. All rights reserved.</p>
          <div className="footer-links">
            <button className="footer-link">Privacy Policy</button>
            
            
          </div>
        </div>
      </footer>
    </>
  );
};

// Main App component
function App() {
  return (
    <Router>
      <div className="App">
        <main className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={
                <HomeLayout>
                  <HomePage />
                </HomeLayout>
              } 
            />
            <Route path="/select-role" element={<RoleSelection />} />
            <Route path="/auth/:type" element={<Auth />} />
            <Route path="/auth/register" element={<Registration />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<RoleDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
