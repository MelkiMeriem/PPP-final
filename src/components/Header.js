import React from 'react';
import './Header.css';

const Header = () => (
    <header>
        <div className="header-content">
            <div className="logo-container">
                <div className="logo-icon">🛡️</div>
                <div className="logo-text">SecureScan</div>
            </div>
        </div>
        <p className="subtitle">Advanced Website Vulnerability Scanner & Security Assessment Tool</p>
    </header>
);

export default Header;