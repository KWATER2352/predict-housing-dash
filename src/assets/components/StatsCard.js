import React from 'react';
import './StatsCard.css';

function StatsCard({ title, value, change, icon }) {
  const isPositive = change > 0;
  const isZero = change === 0;
  
  return (
    <div className="stats-card">
      <div className="stats-icon">{icon}</div>
      <div className="stats-content">
        <h3 className="stats-title">{title}</h3>
        <p className="stats-value">{value}</p>
        {!isZero && (
          <span className={`stats-change ${isPositive ? 'positive' : 'negative'}`}>
            <span className="arrow-icon">{isPositive ? '▲' : '▼'}</span> {Math.abs(change)}%
          </span>
        )}
      </div>
    </div>
  );
}

export default StatsCard;
