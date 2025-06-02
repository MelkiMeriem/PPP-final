import React, { useState } from 'react';
import Header from './components/Header';
import ScannerSection from './components/ScannerSection';
import ResultsSection from './components/ResultsSection';
import PresentationSection from './components/PresentationSection';
import AboutSection from './components/AboutSection';

import './App.css';

const attackTypes = [
  'SQL Injection',
  'Cross-Site Scripting (XSS)',
  'Remote Code Execution (RCE)',
  'Cross-Site Request Forgery (CSRF)',
  'Server-Side Request Forgery (SSRF)',
  'Command Injection',
  'Directory Traversal',
  'Insecure Deserialization',
  'File Upload Vulnerabilities'
];

function App() {
  const [scanData, setScanData] = useState(null);
  const [scanStatus, setScanStatus] = useState('idle');
  const [selectedAttackType, setSelectedAttackType] = useState(attackTypes[0]);
  const [targetUrl, setTargetUrl] = useState('');

  const handleScanComplete = (data) => {
    setScanData(data);
    setScanStatus('completed');
  };

  const handleAttackTypeChange = (event) => {
    setSelectedAttackType(event.target.value);
  };

  const handleUrlChange = (event) => {
    setTargetUrl(event.target.value);
  };

  return (
    <div className="App">
      <div className="bg-animation"></div>
      <div className="container">
        <Header />
        <div className="app-content">
          <PresentationSection />
          <ScannerSection
            onScanComplete={handleScanComplete}
            scanStatus={scanStatus}
            setScanStatus={setScanStatus}
            attackTypes={attackTypes}
            selectedAttackType={selectedAttackType}
            onAttackTypeChange={handleAttackTypeChange}
            targetUrl={targetUrl}
            onUrlChange={handleUrlChange} />
          {scanStatus === 'completed' && scanData && (
            <ResultsSection
              scanData={scanData}
              scanStatus={scanStatus} />
          )}
          <AboutSection />
        </div>
      </div>
    </div>
  );
}

export default App;