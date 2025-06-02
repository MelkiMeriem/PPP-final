import React from 'react';
import './PresentationSection.css';

const PresentationSection = () => {
  return (
    <div className="presentation-container">
      <div className="presentation-content">
        <div className="presentation-header">
          <h1>SecureScan Pro</h1>
          <p className="tagline">Advanced Web Application Security Scanner</p>
        </div>
        
        <div className="presentation-features">
          <div className="feature-card">
            <i className="fas fa-shield-alt"></i>
            <h3>Comprehensive Security</h3>
            <p>Detect vulnerabilities across multiple attack vectors</p>
          </div>
          
          <div className="feature-card">
            <i className="fas fa-bolt"></i>
            <h3>AI-Powered Analysis</h3>
            <p>Smart scanning with machine learning</p>
          </div>
          
          <div className="feature-card">
            <i className="fas fa-chart-line"></i>
            <h3>Detailed Reports</h3>
            <p>Comprehensive security assessment</p>
          </div>
        </div>

        <div className="presentation-stats">
          <div className="stat-item">
            <span className="stat-value">10+</span>
            <span className="stat-label">Attack Vectors</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">99.9%</span>
            <span className="stat-label">Detection Rate</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">24/7</span>
            <span className="stat-label">Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresentationSection;
