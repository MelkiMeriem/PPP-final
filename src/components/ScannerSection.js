import React, { useState } from 'react';
import './ScannerSection.css';

const ScannerSection = ({ 
  onScanComplete, 
  scanStatus, 
  setScanStatus,
  attackTypes,
  selectedAttackType,
  onAttackTypeChange,
  targetUrl,
  onUrlChange
}) => {
  const [url, setUrl] = useState('');
  const progressItems = ['ssl', 'headers', 'csp', 'xss', 'sql', 'info'];

  const generateVulnerabilities = (type) => {
    // Copy this function from your original HTML script
    // (The one that creates random vulnerabilities)
  };

  const calculateSecurityScore = (vulns) => {
    // Simple scoring logic (modify as needed)
    let score = 100;
    Object.values(vulns).forEach(category => {
      category.forEach(vuln => {
        if (vuln.severity === 'critical') score -= 15;
        else if (vuln.severity === 'high') score -= 10;
        else if (vuln.severity === 'medium') score -= 5;
        else if (vuln.severity === 'low') score -= 2;
      });
    });
    return score;
  };

  const handleScan = () => {
    if (!targetUrl) return;
    
    setScanStatus('scanning');

    // Simulate AI-powered scan process
    setTimeout(() => {
      const mockResults = {
        target: targetUrl,
        attackType: selectedAttackType,
        vulnerabilities: [
          {
            type: selectedAttackType,
            severity: 'high',
            details: `Detected ${selectedAttackType} vulnerability in ${targetUrl}`,
            confidence: 0.95,
            aiAnalysis: 'AI model detected suspicious patterns in input handling'
          },
          {
            type: 'Potential RCE',
            severity: 'medium',
            details: 'AI-powered fuzzing discovered potential code execution path',
            confidence: 0.75,
            aiAnalysis: 'Pattern matches known RCE vectors'
          }
        ]
      };
      
      onScanComplete(mockResults);
    }, 2000);
  };

  return (
    <div className="scanner-section">
      <div className="scanner-header">
        <h2 className="scanner-title">AI-Powered Web Exploitation Tool</h2>
        <button 
          className={`scan-button ${scanStatus === 'scanning' ? 'disabled' : ''}`}
          onClick={handleScan}
          disabled={scanStatus === 'scanning' || !targetUrl}
        >
          {scanStatus === 'scanning' ? 'Scanning...' : 'Start AI Analysis'}
        </button>
      </div>

      <div className="scan-form">
        <div className="scan-input-group">
          <label className="scan-label" htmlFor="targetUrl">Target URL</label>
          <input
            type="url"
            id="targetUrl"
            className="scan-input"
            value={targetUrl}
            onChange={onUrlChange}
            placeholder="https://example.com"
            required
          />
        </div>

        <div className="scan-input-group">
          <label className="scan-label" htmlFor="attackType">Attack Type</label>
          <select
            id="attackType"
            className="scan-input"
            value={selectedAttackType}
            onChange={onAttackTypeChange}
            required
          >
            {attackTypes.map((type, index) => (
              <option key={index} value={type} className="option">
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="toggle-container">
          <span className="toggle-label">Enable AI Analysis</span>
          <label className="toggle-switch">
            <input type="checkbox" checked={true} readOnly />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="toggle-container">
          <span className="toggle-label">Enable Fuzzing</span>
          <label className="toggle-switch">
            <input type="checkbox" checked={true} readOnly />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      {scanStatus === 'scanning' && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Scanning in progress...</div>
        </div>
      )}
    </div>
  );
};

export default ScannerSection;