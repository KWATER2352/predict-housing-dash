import React from 'react';
import './PredictionModal.css';

function PredictionModal({ isOpen, onClose, prediction }) {
  if (!isOpen) return null;

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(prediction?.price || 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <div className="modal-icon">✓</div>
        
        <h2 className="modal-title">Prediction Complete</h2>
        
        <div className="modal-price-container">
          <p className="modal-label">Predicted California Housing Price</p>
          <p className="modal-price">{formattedPrice}</p>
        </div>

        <div className="modal-inputs">
          <p className="modal-inputs-title">Based on:</p>
          <div className="modal-input-grid">
            <div className="modal-input-item">
              <span className="input-label">Population:</span>
              <span className="input-value">{prediction?.inputs?.population?.toLocaleString()}</span>
            </div>
            <div className="modal-input-item">
              <span className="input-label">Housing Units:</span>
              <span className="input-value">{prediction?.inputs?.total_housing_units?.toLocaleString()}</span>
            </div>
            <div className="modal-input-item">
              <span className="input-label">Consumer Debt:</span>
              <span className="input-value">${prediction?.inputs?.total_debt} T</span>
            </div>
            <div className="modal-input-item">
              <span className="input-label">Property Tax:</span>
              <span className="input-value">${(prediction?.inputs?.avg_property_tax / 1000).toFixed(0)}K</span>
            </div>
            <div className="modal-input-item">
              <span className="input-label">Previous Year:</span>
              <span className="input-value">${(prediction?.inputs?.CA_lag1 / 1000).toFixed(0)}K</span>
            </div>
          </div>
        </div>

        <button className="modal-button" onClick={onClose}>
          Got it!
        </button>
      </div>
    </div>
  );
}

export default PredictionModal;
