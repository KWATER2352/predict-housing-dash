import React, { useState, useEffect } from 'react';
import './ChartCard.css';

function ChartCard({ title, children, data }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const featureNameMap = {
    'CA_lag1': 'Previous Year Price',
    'population': 'California Population',
    'total_housing_units': 'Total Housing Units',
    'total_debt': 'Total Consumer Debt',
    'avg_property_tax': 'Average Property Tax'
  };

  useEffect(() => {
    if (title === 'Price Trends') {
      fetch('http://localhost:5000/history')
        .then(res => res.json())
        .then(data => {
          console.log('Price Trends data received:', data);
          console.log('Data length:', data?.length);
          console.log('First item:', data?.[0]);
          setChartData(data || []);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching history:', err);
          setChartData([]);
          setLoading(false);
        });
    } else if (title === 'Feature Importance') {
      fetch('http://localhost:5000/feature-importance')
        .then(res => res.json())
        .then(data => {
          setChartData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching feature importance:', err);
          setLoading(false);
        });
    } else if (title === 'Regional Analysis') {
      fetch('http://localhost:5000/regional-analysis')
        .then(res => res.json())
        .then(data => {
          const validData = data.filter(item => 
            item.median_price && 
            !isNaN(item.median_price) && 
            item.median_price > 0
          );
          console.log('Regional Analysis Data:', validData.slice(0, 5));
          setChartData(validData);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching regional analysis:', err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [title]);

  return (
    <div className="chart-card">
      <h3 className="chart-title">{title}</h3>
      <div className="chart-content">
        {loading ? (
          <div className="chart-placeholder">
            <p>Loading data...</p>
          </div>
        ) : children ? (
          children
        ) : chartData.length === 0 && title === 'Price Trends' ? (
          <div className="chart-placeholder">
            <p>No data available. Loading: {loading ? 'Yes' : 'No'}, Data count: {chartData.length}</p>
          </div>
        ) : (
          <div className="chart-placeholder">
            {title === 'Price Trends' && chartData.length > 0 ? (
              <div className="price-trends">
                <p><strong>Historical California Housing Prices</strong></p>
                <div className="trend-header">
                  <span><strong>Period:</strong> {Math.min(...chartData.map(d => d.year))} - {Math.max(...chartData.map(d => d.year))}</span>
                  <span><strong>Records:</strong> {chartData.length} years</span>
                </div>
                <div className="interactive-chart">
                  <svg className="price-chart" viewBox="0 0 800 250" preserveAspectRatio="xMidYMid meet">
                    {(() => {
                      const sortedData = [...chartData].sort((a, b) => a.year - b.year);
                      const maxPrice = Math.max(...sortedData.map(d => d.avg_median_price));
                      const minPrice = Math.min(...sortedData.map(d => d.avg_median_price));
                      const priceRange = maxPrice - minPrice;
                      const padding = 40;
                      const chartWidth = 800 - padding * 2;
                      const chartHeight = 250 - padding * 2;
                      
                      const points = sortedData.map((item, idx) => {
                        const x = padding + (idx / (sortedData.length - 1)) * chartWidth;
                        const y = padding + chartHeight - ((item.avg_median_price - minPrice) / priceRange) * chartHeight;
                        return { x, y, data: item };
                      });
                      
                      const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                      const areaData = `${pathData} L ${points[points.length - 1].x} ${padding + chartHeight} L ${padding} ${padding + chartHeight} Z`;
                      
                      return (
                        <>
                          <defs>
                            <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#667eea" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#667eea" stopOpacity="0.05" />
                            </linearGradient>
                          </defs>
                          
                          <path d={areaData} fill="url(#priceGradient)" />
                          <path d={pathData} stroke="#667eea" strokeWidth="3" fill="none" />
                          
                          {points.map((point, idx) => (
                            <g key={idx} className="chart-point-group">
                              <circle
                                cx={point.x}
                                cy={point.y}
                                r="6"
                                fill="#667eea"
                                stroke="white"
                                strokeWidth="2"
                                className="chart-point"
                                style={{ cursor: 'pointer' }}
                              />
                              <g className="chart-tooltip" style={{ pointerEvents: 'none', opacity: 0 }}>
                                <rect
                                  x={point.x - 65}
                                  y={point.y - 55}
                                  width="130"
                                  height="45"
                                  rx="6"
                                  fill="#1e293b"
                                  opacity="0.95"
                                />
                                <text x={point.x} y={point.y - 35} textAnchor="middle" fill="white" fontSize="13" fontWeight="600">
                                  {point.data.year}
                                </text>
                                <text x={point.x} y={point.y - 18} textAnchor="middle" fill="#10b981" fontSize="15" fontWeight="700">
                                  ${(point.data.avg_median_price / 1000).toFixed(0)}K
                                </text>
                              </g>
                            </g>
                          ))}
                        </>
                      );
                    })()}
                  </svg>
                </div>
                <div className="trend-summary">
                  <p><strong>Average Price:</strong> ${(chartData.reduce((sum, d) => sum + d.avg_median_price, 0) / chartData.length / 1000).toFixed(0)}K</p>
                  <p><strong>Price Range:</strong> ${(Math.min(...chartData.map(d => d.avg_median_price)) / 1000).toFixed(0)}K - ${(Math.max(...chartData.map(d => d.avg_median_price)) / 1000).toFixed(0)}K</p>
                </div>
              </div>
            ) : title === 'Feature Importance' && chartData.length > 0 ? (
              <div className="feature-list">
                <p><strong>Top Features (by importance):</strong></p>
                {chartData.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="feature-item">
                    <span className="feature-name">{featureNameMap[item.feature] || item.feature}</span>
                    <span className="feature-value">{item.importance.toFixed(4)}</span>
                    <div className="feature-bar" style={{ width: `${Math.abs(item.importance) * 100}%` }}></div>
                  </div>
                ))}
              </div>
            ) : title === 'Regional Analysis' && chartData.length > 0 ? (
              <div className="regional-list">
                <p><strong>Top Regions by Median Price:</strong></p>
                {chartData.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="regional-item">
                    <span className="region-name">{item.region}</span>
                    <span className="region-price">${(item.median_price / 1000).toFixed(0)}K</span>
                  </div>
                ))}
              </div>
            ) : data ? (
              <div className="prediction-result">
                <p><strong>Latest Prediction:</strong></p>
                <p className="price-value">${(data.price / 1000).toFixed(0)}K</p>
                <p className="timestamp">{new Date(data.timestamp).toLocaleString()}</p>
              </div>
            ) : (
              <div className="placeholder-bars">
                <div className="bar" style={{ height: '60%' }}></div>
                <div className="bar" style={{ height: '80%' }}></div>
                <div className="bar" style={{ height: '45%' }}></div>
                <div className="bar" style={{ height: '90%' }}></div>
                <div className="bar" style={{ height: '70%' }}></div>
                <div className="bar" style={{ height: '55%' }}></div>
              </div>
            )}
            {!data && !chartData.length && title !== 'Price Trends' && title !== 'Feature Importance' && title !== 'Regional Analysis' && <p>Chart visualization will appear here</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChartCard;
