import React, { useState } from 'react';
import './ScannerSection.css';

const ScannerSection = ({ 
  onScanComplete, 
  scanStatus, 
  setScanStatus,
  attackTypes,
  comprehensiveScanTypes,
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
        vulnerabilities: []
      };

      // Generate comprehensive scan results if Full Attack Types is selected
      if (selectedAttackType === 'Full Attack Types') {
        comprehensiveScanTypes.forEach(type => {
          const vulnerability = {
            name: type || 'Unknown Attack',
            type: type || 'Unknown Attack',
            severity: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
            description: `Detected potential ${type?.toLowerCase() || 'unknown'} vulnerability in ${targetUrl}`,
            details: `Detected potential ${type?.toLowerCase() || 'unknown'} vulnerability in ${targetUrl}`,
            confidence: Math.random() * 0.5 + 0.5, // Random confidence between 0.5 and 1.0
            aiAnalysis: `AI model detected suspicious patterns in ${type?.toLowerCase() || 'unknown'} protection`,
            impact: 'Potential security risk'
          };
          mockResults.vulnerabilities.push(vulnerability);
        });
      } else {
        // Generate specific attack type results
        mockResults.vulnerabilities = [
          {
            name: selectedAttackType || 'Unknown Attack',
            type: selectedAttackType || 'Unknown Attack',
            severity: 'high',
            description: `Detected ${selectedAttackType?.toLowerCase() || 'unknown'} vulnerability in ${targetUrl}`,
            details: `Detected ${selectedAttackType?.toLowerCase() || 'unknown'} vulnerability in ${targetUrl}`,
            confidence: 0.95,
            aiAnalysis: 'AI model detected suspicious patterns in input handling',
            impact: 'High risk security issue'
          }
        ];
      }
      
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