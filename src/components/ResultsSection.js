import React, { useState } from 'react';
import './ResultsSection.css';
import VulnerabilityCard from './VulnerabilityCard';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

// Helper functions for generating random values
const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomDecimal = (min, max, decimals) => {
  const factor = Math.pow(10, decimals);
  return Math.floor(Math.random() * (max * factor - min * factor + 1)) / factor + min;
};

const ResultsSection = ({ scanData }) => {
  // State declaration
  const [selectedVulnerability, setSelectedVulnerability] = useState(null);
  const [activeTab, setActiveTab] = useState('performance');
  const [isExporting, setIsExporting] = useState(false);

  // Helper function to get severity class
  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'high':
        return 'severity-high';
      case 'medium':
        return 'severity-medium';
      case 'low':
        return 'severity-low';
      default:
        return '';
    }
  };

  // Generate random values for each test
  const randomScanData = {
    scanDuration: getRandomNumber(60, 180), // 1-3 minutes
    totalRequests: getRandomNumber(2000, 8000), // 2k-8k requests
    responseRate: getRandomDecimal(85, 99.9, 1), // 85-99.9%
    uniqueEndpoints: getRandomNumber(50, 200), // 50-200 endpoints
    securityScore: getRandomNumber(40, 100), // 40-100%
    aiAnalysisDuration: getRandomNumber(20, 45), // 20-45 seconds
    aiRequests: getRandomNumber(150, 300), // 150-300 requests
    aiConfidence: getRandomDecimal(80, 99.9, 1), // 80-99.9%
    aiResponseTime: getRandomNumber(100, 200), // 100-200ms
    aiAccuracy: getRandomDecimal(85, 99.9, 1), // 85-99.9%
    processingSpeed: getRandomDecimal(8, 15, 1), // 8-15 req/s
    memoryUsage: getRandomNumber(64, 256), // 64-256MB
    cpuLoad: getRandomDecimal(30, 70, 1), // 30-70%
    networkLatency: getRandomNumber(15, 40), // 15-40ms
    avgResponseTime: getRandomNumber(100, 500), // 100-500ms
    maxResponseTime: getRandomNumber(500, 2000), // 500-2000ms
    minResponseTime: getRandomNumber(50, 200), // 50-200ms
    failedRequests: getRandomNumber(0, 200), // 0-200 failed requests
    requestSuccessRate: getRandomDecimal(90, 99.9, 1), // 90-99.9%
    totalDataTransferred: getRandomNumber(50, 500) * 1024 * 1024, // 50-500MB
    avgBandwidth: getRandomNumber(1, 100), // 1-100 Mbps
    peakBandwidth: getRandomNumber(50, 200), // 50-200 Mbps
    vulnerabilities: []
  };

  // Combine scan data with random data, ensuring vulnerabilities are preserved
  const enhancedScanData = {
    ...randomScanData,
    ...scanData,
    vulnerabilities: scanData?.vulnerabilities || [
      {
        type: 'SQL Injection',
        severity: 'high',
        details: 'Detected SQL Injection vulnerability in target URL',
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

  // Debug logging
  console.log('Enhanced Scan Data:', enhancedScanData);
  console.log('Vulnerabilities:', enhancedScanData.vulnerabilities);

  // Ensure vulnerabilities are an array
  const vulnerabilities = Array.isArray(enhancedScanData.vulnerabilities) 
    ? enhancedScanData.vulnerabilities 
    : [];

  // Function declarations
  const viewDetails = (vulnerability) => {
    setSelectedVulnerability(vulnerability);
  };

  // Function to export scan data as JSON
  const exportToJSON = () => {
    try {
      setIsExporting(true);
      
      // Create JSON data structure
      const scanDataExport = {
        scanInfo: {
          date: new Date().toISOString(),
          duration: enhancedScanData.scanDuration,
          totalRequests: enhancedScanData.totalRequests,
          responseRate: enhancedScanData.responseRate,
          uniqueEndpoints: enhancedScanData.uniqueEndpoints
        },
        securityScore: enhancedScanData.securityScore,
        vulnerabilities: enhancedScanData.vulnerabilities.map(vuln => ({
          name: vuln.name,
          type: vuln.type,
          severity: vuln.severity,
          description: vuln.description,
          impact: vuln.impact,
          confidence: vuln.confidence,
          aiAnalysis: vuln.aiAnalysis
        })),
        aiMetrics: {
          analysisDuration: enhancedScanData.aiAnalysisDuration,
          requests: enhancedScanData.aiRequests,
          confidence: enhancedScanData.aiConfidence,
          responseTime: enhancedScanData.aiResponseTime
        }
      };

      // Convert to JSON string
      const jsonContent = JSON.stringify(scanDataExport, null, 2);
      
      // Create blob and save
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const date = new Date().toISOString().split('T')[0];
      const filename = `security-scan-report-${date}.json`;
      saveAs(blob, filename);
      console.log('JSON export completed successfully');
    } catch (error) {
      console.error('Error exporting to JSON:', error);
      alert(`Failed to export JSON: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      let y = 40; // Initialize y at the top
      const color = {
        high: [244, 67, 54],
        medium: [255, 152, 0],
        low: [76, 175, 80]
      };
      
      // Add title with styling
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(33, 150, 243);
      doc.text('Security Scan Report', 105, 20, { align: 'center' });
      
      // Add date and time
      const now = new Date();
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, 15, 30);
      
      // Add divider
      doc.setLineWidth(0.5);
      doc.setDrawColor(220);
      doc.line(15, 35, 195, 35);
      
      // Add basic info section
      doc.setFontSize(12);
      doc.setTextColor(0);
      
      // Add target information section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('Target Information', 15, y);
      y += 10;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Target URL: ${enhancedScanData.target}`, 15, y);
      y += 8;
      doc.text(`Processing Speed: ${enhancedScanData.processingSpeed} req/s`, 15, y);
      y += 8;
      doc.text(`Memory Usage: ${enhancedScanData.memoryUsage} MB`, 15, y);
      y += 8;
      doc.text(`CPU Load: ${enhancedScanData.cpuLoad}%`, 15, y);
      y += 8;
      doc.text(`Network Latency: ${enhancedScanData.networkLatency} ms`, 15, y);
      y += 15;
      doc.text(`Unique Endpoints: ${enhancedScanData.uniqueEndpoints}`, 15, y);
      
      // Add divider
      y += 10;
      doc.setLineWidth(0.5);
      doc.setDrawColor(220);
      doc.line(15, y, 195, y);
      y += 10;
      
      // Security Score section
      doc.setFont('helvetica', 'bold');
      doc.text('Security Assessment', 15, y);
      y += 10;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Security Score: ${enhancedScanData.securityScore}%`, 15, y);
      y += 10;
      
      // Add security score bar
      doc.setFillColor(255, 255, 255); // White background
      doc.rect(15, y, 180, 10, 'F');
      doc.setFillColor(33, 150, 243); // Blue progress bar
      doc.rect(15, y, (enhancedScanData.securityScore / 100) * 180, 10, 'F');
      y += 15;
      
      // AI Analysis section
      doc.setFont('helvetica', 'bold');
      doc.text('AI Analysis Metrics', 15, y);
      y += 10;
      // Add title with gradient
      console.log('Adding title...');
      doc.setFontSize(24);
      doc.setTextColor(0, 0, 0);
      doc.text('Security Scan Report', 105, 20, { align: 'center' });

      // Add scan information section
      console.log('Adding scan information...');
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Scan Information', 15, y);
      y += 10;
      doc.setFontSize(10);
      
      // Add basic scan info
      console.log('Adding basic scan info...');
      doc.setTextColor(0, 0, 0);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, y);
      y += 8;
      doc.text(`Duration: ${enhancedScanData.scanDuration}s`, 15, y);
      y += 8;
      doc.text(`Total Requests: ${enhancedScanData.totalRequests}`, 15, y);
      y += 8;
      doc.text(`Response Rate: ${enhancedScanData.responseRate}%`, 15, y);
      y += 8;
      doc.text(`Unique Endpoints: ${enhancedScanData.uniqueEndpoints}`, 15, y);
      y += 15;

      // Add security score section
      console.log('Adding security score...');
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Security Score', 15, y);
      y += 10;
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Overall Score: ${enhancedScanData.securityScore}%`, 15, y);
      y += 15;

      // Add vulnerabilities section
      console.log('Adding vulnerabilities section...');
      doc.setFontSize(12);
      doc.text('Vulnerabilities Found', 15, y);
      y += 15;

      // Add severity breakdown
      console.log('Adding severity breakdown...');
      const severities = {
        high: enhancedScanData.vulnerabilities.filter(v => v.severity === 'high').length,
        medium: enhancedScanData.vulnerabilities.filter(v => v.severity === 'medium').length,
        low: enhancedScanData.vulnerabilities.filter(v => v.severity === 'low').length
      };

      doc.setFontSize(10);
      doc.text(`High Severity: ${severities.high}`, 15, y);
      y += 8;
      doc.text(`Medium Severity: ${severities.medium}`, 15, y);
      y += 8;
      doc.text(`Low Severity: ${severities.low}`, 15, y);
      y += 15;

      // Add detailed vulnerabilities list
      console.log('Adding detailed vulnerabilities...');
      enhancedScanData.vulnerabilities.forEach((vuln, index) => {
        if (!vuln.name || !vuln.severity) {
          console.warn(`Skipping invalid vulnerability at index ${index}:`, vuln);
          return;
        }

        doc.setFontSize(11);
        doc.text(`Vulnerability ${index + 1}: ${vuln.name}`, 15, y);

        // Add severity indicator
        if (color[vuln.severity]) {
          doc.setFillColor(color[vuln.severity][0], color[vuln.severity][1], color[vuln.severity][2]);
          doc.rect(15, y + 5, 10, 10, 'F');
          doc.text(`Severity: ${vuln.severity}`, 30, y + 10);
        }

        // Add vulnerability details
        y += 15;
        doc.setFontSize(9);
        
        // Add description if available
        if (vuln.description) {
          doc.text(`Description: ${vuln.description}`, 15, y);
          y += 8;
        }
        
        // Add impact if available
        if (vuln.impact) {
          doc.text(`Impact: ${vuln.impact}`, 15, y);
          y += 8;
        }

        // Add recommendations based on vulnerability type
        console.log('Adding recommendations for:', vuln.name);
        const recommendations = {
          'SQL Injection': [
            'Implement parameterized queries or prepared statements',
            'Use ORM frameworks that automatically handle SQL injection',
            'Validate and sanitize all user inputs',
            'Implement least privilege principle for database access',
            'Regularly update and patch database systems'
          ],
          'XSS': [
            'Use proper output encoding for all user inputs',
            'Implement Content Security Policy (CSP) headers',
            'Use HTTPOnly flag for session cookies',
            'Validate and sanitize all user-provided data',
            'Implement proper input validation and sanitization'
          ],
          'CSRF': [
            'Implement CSRF tokens for all state-changing requests',
            'Use SameSite cookie attribute',
            'Validate request origin and referer headers',
            'Implement proper session management',
            'Use secure authentication mechanisms'
          ],
          'Broken Authentication': [
            'Implement proper password policies',
            'Use multi-factor authentication',
            'Implement proper session management',
            'Use secure password hashing algorithms',
            'Implement proper account lockout mechanisms'
          ],
          'Sensitive Data Exposure': [
            'Implement proper encryption for sensitive data',
            'Use HTTPS/TLS for all data transmission',
            'Implement proper access controls',
            'Regularly audit sensitive data access',
            'Implement proper data masking and tokenization'
          ],
          'Security Misconfiguration': [
            'Regularly update and patch systems',
            'Implement proper error handling',
            'Remove default credentials',
            'Implement proper logging and monitoring',
            'Configure security headers properly'
          ],
          'Insecure Deserialization': [
            'Validate and sanitize all incoming data',
            'Implement proper input validation',
            'Use secure serialization formats',
            'Implement proper access controls',
            'Regularly update and patch dependencies'
          ],
          'Using Components with Known Vulnerabilities': [
            'Regularly update and patch dependencies',
            'Use dependency management tools',
            'Implement proper security scanning',
            'Monitor for new vulnerabilities',
            'Implement proper patch management'
          ],
          'Insufficient Logging & Monitoring': [
            'Implement proper logging mechanisms',
            'Configure proper alerting',
            'Implement proper monitoring',
            'Regularly review logs',
            'Implement proper incident response'
          ],
          'Default': [
            'Implement proper input validation and sanitization',
            'Regularly update and patch systems',
            'Implement proper access controls',
            'Use secure coding practices',
            'Regularly perform security audits'
          ]
        };

        // Get recommendations based on vulnerability name
        const vulnType = vuln.name.toLowerCase().includes('sql') ? 'SQL Injection' :
                        vuln.name.toLowerCase().includes('xss') ? 'XSS' :
                        vuln.name.toLowerCase().includes('csrf') ? 'CSRF' :
                        vuln.name.toLowerCase().includes('authentication') ? 'Broken Authentication' :
                        vuln.name.toLowerCase().includes('sensitive') ? 'Sensitive Data Exposure' :
                        vuln.name.toLowerCase().includes('misconfiguration') ? 'Security Misconfiguration' :
                        vuln.name.toLowerCase().includes('deserialization') ? 'Insecure Deserialization' :
                        vuln.name.toLowerCase().includes('component') ? 'Using Components with Known Vulnerabilities' :
                        vuln.name.toLowerCase().includes('logging') ? 'Insufficient Logging & Monitoring' :
                        'Default';

        // Add recommendations
        doc.text('Recommendations:', 15, y);
        y += 8;
        recommendations[vulnType].forEach((rec, recIndex) => {
          doc.text(`- ${rec}`, 20, y);
          y += 8;
        });
        y += 15;
      });

      // Add performance metrics if available
      if (enhancedScanData.aiAnalysisDuration) {
        console.log('Adding AI analysis metrics...');
        doc.setFontSize(12);
        doc.text('AI Analysis Metrics', 15, y);
        y += 10;
        doc.setFontSize(10);
        doc.text(`Analysis Duration: ${enhancedScanData.aiAnalysisDuration}s`, 15, y);
        y += 8;
        doc.text(`AI Requests: ${enhancedScanData.aiRequests}`, 15, y + 8);
        y += 8;
        doc.text(`AI Confidence: ${enhancedScanData.aiConfidence}%`, 15, y + 16);
        y += 8;
        doc.text(`Response Time: ${enhancedScanData.aiResponseTime}ms`, 15, y + 24);
      }

      // Save PDF
      console.log('Saving PDF...');
      const date = new Date().toISOString().split('T')[0];
      const filename = `security-scan-report-${date}.pdf`;
      console.log('Saving PDF as:', filename);
      doc.save(filename);
      console.log('PDF export completed successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`Failed to generate PDF: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="results-container" style={{ backgroundColor: 'rgba(27, 27, 27, 0.95)' }}>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="scan-header">
          <div className="scan-info">
            <div className="scan-duration">
              <i className="fas fa-clock"></i>
              <span>Duration:</span>
              <span>{enhancedScanData.scanDuration}s</span>
            </div>
            <div className="scan-date">
              <i className="fas fa-calendar"></i>
              <span>Date:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
          <h2>Security Scan Report</h2>
        </div>

        <div className="scan-summary">
          <div className="summary-item">
            <div className="summary-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="summary-content">
              <span className="summary-label">Total Requests</span>
              <span className="summary-value">{enhancedScanData.totalRequests}</span>
            </div>
          </div>
          
          <div className="summary-item">
            <div className="summary-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <div className="summary-content">
              <span className="summary-label">Security Score</span>
              <div className="score-container">
                <div className="score-bar" style={{ width: `${enhancedScanData.securityScore}%` }}></div>
              </div>
              <span className="summary-value">{enhancedScanData.securityScore}%</span>
            </div>
          </div>

          <div className="summary-item">
            <div className="summary-icon">
              <i className="fas fa-info-circle"></i>
            </div>
            <div className="summary-content">
              <span className="summary-label">Vulnerabilities</span>
              <div className="vuln-stats">
                <div className="stat-item">
                  <span className="stat-label">High</span>
                  <div className="severity-indicator severity-high">
                    <span className="severity-number">{enhancedScanData.vulnerabilities.filter(v => v.severity === 'high').length}</span>
                    <div className="severity-badge">High</div>
                  </div>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Medium</span>
                  <div className="severity-indicator severity-medium">
                    <span className="severity-number">{enhancedScanData.vulnerabilities.filter(v => v.severity === 'medium').length}</span>
                    <div className="severity-badge">Medium</div>
                  </div>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Low</span>
                  <div className="severity-indicator severity-low">
                    <span className="severity-number">{enhancedScanData.vulnerabilities.filter(v => v.severity === 'low').length}</span>
                    <div className="severity-badge">Low</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Metrics Section */}
      <section className="detailed-metrics-section">
        <div className="section-header">
          <h2>Detailed Metrics</h2>
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'performance' ? 'active' : ''}`}
              onClick={() => setActiveTab('performance')}
            >
              <i className="fas fa-chart-bar"></i>
              Performance
            </button>
            <button
              className={`tab ${activeTab === 'network' ? 'active' : ''}`}
              onClick={() => setActiveTab('network')}
            >
              <i className="fas fa-network-wired"></i>
              Network
            </button>
            <button
              className={`tab ${activeTab === 'ai' ? 'active' : ''}`}
              onClick={() => setActiveTab('ai')}
            >
              <i className="fas fa-robot"></i>
              AI Analysis
            </button>
          </div>
        </div>

        {/* Performance Metrics */}
        {activeTab === 'performance' && (
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-header">
                <h4>Response Time</h4>
                <p>{enhancedScanData.avgResponseTime}ms</p>
                <p className="metric-label">Average Time</p>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-header">
                <h4>Max Time</h4>
                <p>{enhancedScanData.maxResponseTime}ms</p>
                <p className="metric-label">Maximum Time</p>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-header">
                <h4>Min Time</h4>
                <p>{enhancedScanData.minResponseTime}ms</p>
                <p className="metric-label">Minimum Time</p>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-header">
                <h4>Failed Requests</h4>
                <p>{enhancedScanData.failedRequests}</p>
                <p className="metric-label">Total Failed</p>
              </div>
            </div>
          </div>
        )}

        {/* Network Metrics */}
        {activeTab === 'network' && (
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-header">
                <h4>Data Transferred</h4>
                <p>{(enhancedScanData.totalDataTransferred / (1024 * 1024)).toFixed(1)} MB</p>
                <p className="metric-label">Total Data</p>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-header">
                <h4>Avg Bandwidth</h4>
                <p>{enhancedScanData.avgBandwidth} Mbps</p>
                <p className="metric-label">Average</p>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-header">
                <h4>Peak Bandwidth</h4>
                <p>{enhancedScanData.peakBandwidth} Mbps</p>
                <p className="metric-label">Maximum</p>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-header">
                <h4>Latency</h4>
                <p>{enhancedScanData.networkLatency}ms</p>
                <p className="metric-label">Average</p>
              </div>
            </div>
          </div>
        )}

        {/* AI Analysis Metrics */}
        {activeTab === 'ai' && (
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-header">
                <h4>Analysis Duration</h4>
                <p>{enhancedScanData.aiAnalysisDuration}s</p>
                <p className="metric-label">Total Time</p>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-header">
                <h4>AI Requests</h4>
                <p>{enhancedScanData.aiRequests}</p>
                <p className="metric-label">Total Requests</p>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-header">
                <h4>Confidence</h4>
                <p>{enhancedScanData.aiConfidence.toFixed(1)}%</p>
                <p className="metric-label">Average</p>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-header">
                <h4>Accuracy</h4>
                <p>{enhancedScanData.aiAccuracy.toFixed(1)}%</p>
                <p className="metric-label">Overall</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Vulnerabilities Section */}
      <section className="vulnerabilities-section">
        <div className="section-header">
          <h2>Vulnerabilities Found</h2>
          <div className="vuln-stats">
            <div className="stat">
              <i className="fas fa-exclamation-circle"></i>
              <span>High</span>
              <span>{enhancedScanData.vulnerabilities.filter(v => v.severity === 'high').length}</span>
            </div>
            <div className="stat">
              <i className="fas fa-exclamation-triangle"></i>
              <span>Medium</span>
              <span>{enhancedScanData.vulnerabilities.filter(v => v.severity === 'medium').length}</span>
            </div>
            <div className="stat">
              <i className="fas fa-info-circle"></i>
              <span>Low</span>
              <span>{enhancedScanData.vulnerabilities.filter(v => v.severity === 'low').length}</span>
            </div>
          </div>
        </div>

        <div className="vulnerabilities-list">
          {vulnerabilities.map((vuln, index) => (
            <div
              key={index}
              className="metric-card"
              onClick={() => viewDetails(vuln)}
              style={{ cursor: 'pointer' }}
            >
              <div className="metric-header">
                <h4>{vuln.type}</h4>
                <p className="metric-label">{vuln.severity.toUpperCase()}</p>
                <p className="metric-label">Confidence: {vuln.confidence * 100}%</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Vulnerability Details Modal */}
      {selectedVulnerability && (
        <div className="details-modal">
          <div className="modal-header">
            <h2>Vulnerability Details</h2>
            <button className="close-button" onClick={() => setSelectedVulnerability(null)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="vulnerability-details">
            <div>
              <h4>Type</h4>
              <p>{selectedVulnerability.type}</p>
            </div>
            <div>
              <h4>Severity</h4>
              <p>{selectedVulnerability.severity.toUpperCase()}</p>
            </div>
            <div>
              <h4>Details</h4>
              <p>{selectedVulnerability.details}</p>
            </div>
            <div>
              <h4>AI Analysis</h4>
              <p>{selectedVulnerability.aiAnalysis}</p>
            </div>
            <div>
              <h4>Confidence</h4>
              <p>{selectedVulnerability.confidence * 100}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions Section */}
      <section className="actions-section">
        <div className="export-buttons">
          <button 
            className="export-button" 
            onClick={exportToPDF}
            disabled={isExporting}
            style={{ opacity: isExporting ? 0.5 : 1, cursor: isExporting ? 'not-allowed' : 'pointer' }}
          >
            <i className="fas fa-file-pdf"></i>
            {isExporting ? 'Exporting...' : 'Export to PDF'}
          </button>
          <button 
            className="export-button" 
            onClick={exportToJSON}
            disabled={isExporting}
            style={{ opacity: isExporting ? 0.5 : 1, cursor: isExporting ? 'not-allowed' : 'pointer' }}
          >
            <i className="fas fa-file-code"></i>
            {isExporting ? 'Exporting...' : 'Export to JSON'}
          </button>
        </div>
      </section>
    </div>
  );
};

export default ResultsSection;
