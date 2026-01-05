import React from 'react';
import './Header.css';

function Header({ onNavigate }) {
  return (
    <header className="dashboard-header">
      <div className="header-content">
        <h1 onClick={() => onNavigate && onNavigate('dashboard')} style={{ cursor: 'pointer' }}><span className="icon-home">⌂</span> California Housing Price Predictor</h1>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => onNavigate && onNavigate('settings')}>Settings</button>
          <button className="btn-primary" onClick={() => onNavigate && onNavigate('predictions')}>New Prediction</button>
        </div>
      </div>
    </header>
  );
}

export default Header;
