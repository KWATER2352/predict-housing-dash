import React, { useState, useEffect } from 'react';
import './Sidebar.css';

function Sidebar({ activeSection, onSectionChange }) {
  const [stats, setStats] = useState({
    latest_year: '---',
    total_records: '---',
    avg_price: '---'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch quick stats for sidebar
    fetch('http://localhost:5000/stats')
      .then(res => res.json())
      .then(data => {
        setStats({
          latest_year: data.latest_year,
          total_records: data.total_records,
          avg_price: `$${(data.avg_price / 1000).toFixed(0)}K`
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching sidebar stats:', err);
        setLoading(false);
      });
  }, []);

  const navItems = [
    { id: 'dashboard', icon: '☷', label: 'Dashboard' },
    { id: 'predictions', icon: '◈', label: 'Predictions' },
    { id: 'analytics', icon: '◤', label: 'Analytics' },
    { id: 'models', icon: '⚙', label: 'Models' },
    { id: 'regions', icon: '⊞', label: 'Regions' },
    { id: 'features', icon: '◉', label: 'Features' },
    { id: 'history', icon: '☰', label: 'History' }
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <div 
            key={item.id}
            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => onSectionChange(item.id)}
          >
            <span className="icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="sidebar-info">
        <div className="info-title">Quick Stats</div>
        {loading ? (
          <div className="info-loading">Loading...</div>
        ) : (
          <>
            <div className="info-item">
              <div className="info-label">Latest Year</div>
              <div className="info-value">{stats.latest_year}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Total Records</div>
              <div className="info-value">{stats.total_records}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Avg Price</div>
              <div className="info-value">{stats.avg_price}</div>
            </div>
          </>
        )}
      </div>

      <div className="sidebar-footer">
        <div className="model-status">
          <span className="status-dot"></span>
          <span>Model Active</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
