import React from 'react';
import './ProgressTracker.css';

const ProgressTracker = () => (
    <div className="progress-tracker">
        <div className="progress-grid">
            {['ssl', 'headers', 'csp', 'xss', 'sql', 'info'].map((item) => (
                <div className="progress-item" key={item}>
                    <div className="progress-icon pending">⏳</div>
                    <div className="progress-label">
                        {item === 'csp' ? 'Content Security' :
                            item === 'xss' ? 'XSS Vulnerabilities' :
                                item === 'sql' ? 'SQL Injection' :
                                    item === 'info' ? 'Information Leaks' :
                                        `${item.charAt(0).toUpperCase() + item.slice(1)} Analysis`}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default ProgressTracker;