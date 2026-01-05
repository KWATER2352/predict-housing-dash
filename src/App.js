import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './assets/components/Header';
import Sidebar from './assets/components/Sidebar';
import StatsCard from './assets/components/StatsCard';
import PredictionForm from './assets/components/PredictionForm';
import ChartCard from './assets/components/ChartCard';

function App() {
  const [predictionResult, setPredictionResult] = useState(null);
  const [stats, setStats] = useState({
    avgPrice: '$425K',
    totalRecords: '127',
    accuracy: '96.0%',
    latestYear: '2,845'
  });
  const [predictionCount, setPredictionCount] = useState(0);
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    fetch('http://localhost:5000/stats')
      .then(res => res.json())
      .then(data => {
        setStats({
          avgPrice: `$${(data.avg_price / 1000).toFixed(0)}K`,
          totalRecords: data.total_records.toString(),
          accuracy: '96.0%',
          latestYear: data.latest_year.toString()
        });
      })
      .catch(err => console.error('Error fetching stats:', err));
  }, []);

  const handlePrediction = (result) => {
    setPredictionResult(result);
    setPredictionCount(prev => prev + 1);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <>
            <section className="stats-grid">
              <StatsCard 
                title="Average Price" 
                value={stats.avgPrice} 
                change={5.2} 
                icon="$" 
              />
              <StatsCard 
                title="Predictions Today" 
                value={predictionCount.toString()} 
                change={12.5} 
                icon="◈" 
              />
              <StatsCard 
                title="Model Accuracy" 
                value={stats.accuracy} 
                change={2.1} 
                icon="◉" 
              />
              <StatsCard 
                title="Data Records" 
                value={stats.totalRecords} 
                change={-3.2} 
                icon="▦" 
              />
            </section>

            <div className="dashboard-grid">
              <div className="grid-item form-section">
                <PredictionForm onPrediction={handlePrediction} />
              </div>
              
              <div className="grid-item chart-section">
                <ChartCard title="Regional Analysis" />
              </div>
            </div>
            
            <div className="dashboard-grid" style={{ marginTop: '1.5rem' }}>
              <div className="grid-item chart-section" style={{ gridColumn: '2' }}>
                <ChartCard title="Feature Importance" />
              </div>
            </div>
            
            <div className="dashboard-grid" style={{ marginTop: '2rem' }}>
              <div className="grid-item chart-section" style={{ gridColumn: '1 / -1', maxWidth: '1000px', margin: '0 auto' }}>
                <ChartCard title="Price Trends" />
              </div>
            </div>
          </>
        );

      case 'predictions':
        return (
          <>
            <div className="section-header">
              <h2><span className="section-icon">◈</span> Make Predictions</h2>
              <p>Use the form below to predict California housing prices based on economic indicators</p>
            </div>
            <div className="dashboard-grid">
              <div className="grid-item form-section" style={{ gridColumn: 'span 2' }}>
                <PredictionForm onPrediction={handlePrediction} />
              </div>
              {predictionResult && (
                <div className="grid-item chart-section">
                  <ChartCard title="Latest Prediction" data={predictionResult} />
                </div>
              )}
            </div>
          </>
        );

      case 'analytics':
        return (
          <>
            <div className="section-header">
              <h2><span className="section-icon">◤</span> Analytics & Insights</h2>
              <p>View historical trends and data analysis</p>
            </div>
            <section className="stats-grid">
              <StatsCard 
                title="Average Price" 
                value={stats.avgPrice} 
                change={5.2} 
                icon="$" 
              />
              <StatsCard 
                title="Total Years" 
                value={stats.totalRecords} 
                change={0} 
                icon="◷" 
              />
              <StatsCard 
                title="Model R² Score" 
                value="0.9521" 
                change={2.1} 
                icon="◉" 
              />
              <StatsCard 
                title="Latest Year" 
                value={stats.latestYear} 
                change={0} 
                icon="☷" 
              />
            </section>
            <div className="dashboard-grid" style={{ marginTop: '2rem' }}>
              <div className="grid-item chart-section" style={{ gridColumn: '1 / -1', maxWidth: '1000px', margin: '0 auto' }}>
                <ChartCard title="Price Trends" />
              </div>
            </div>
            <div className="dashboard-grid" style={{ marginTop: '2rem' }}>
              <div className="grid-item chart-section">
                <ChartCard title="Feature Importance" />
              </div>
            </div>
          </>
        );

      case 'models':
        return (
          <>
            <div className="section-header">
              <h2><span className="section-icon">⚙</span> Machine Learning Models</h2>
              <p>Compare different models and their performance metrics</p>
            </div>
            
            <div className="models-grid">
              <div className="model-card active-model">
                <div className="model-header">
                  <h3><span className="model-icon">◉</span> Linear Regression</h3>
                  <span className="model-badge active">Active</span>
                </div>
                <div className="model-metrics">
                  <div className="metric">
                    <span className="metric-label">R² Score</span>
                    <span className="metric-value">0.9521</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Features</span>
                    <span className="metric-value">5</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Training Time</span>
                    <span className="metric-value">0.02s</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Complexity</span>
                    <span className="metric-value">Low</span>
                  </div>
                </div>
                <div className="model-description">
                  <p><strong>Strengths:</strong></p>
                  <ul>
                    <li>Fast training and prediction</li>
                    <li>Highly interpretable results</li>
                    <li>No multicollinearity issues</li>
                    <li>Excellent accuracy (R² &gt; 0.95)</li>
                  </ul>
                  <p><strong>Features Used:</strong></p>
                  <ul className="feature-chips">
                    <li className="chip">Previous Year Price</li>
                    <li className="chip">Population</li>
                    <li className="chip">Housing Units</li>
                    <li className="chip">Consumer Debt</li>
                    <li className="chip">Property Tax</li>
                  </ul>
                </div>
              </div>

              <div className="model-card">
                <div className="model-header">
                  <h3><span className="model-icon">◉</span> Neural Network (MLP)</h3>
                  <span className="model-badge">Alternative</span>
                </div>
                <div className="model-metrics">
                  <div className="metric">
                    <span className="metric-label">R² Score</span>
                    <span className="metric-value">0.9387</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Layers</span>
                    <span className="metric-value">3</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Training Time</span>
                    <span className="metric-value">2.4s</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Complexity</span>
                    <span className="metric-value">Medium</span>
                  </div>
                </div>
                <div className="model-description">
                  <p><strong>Architecture:</strong></p>
                  <ul>
                    <li>Hidden Layers: [50, 50, 25] neurons</li>
                    <li>Activation: ReLU</li>
                    <li>Max Iterations: 5000</li>
                    <li>Good for non-linear patterns</li>
                  </ul>
                  <p><strong>Trade-offs:</strong></p>
                  <ul>
                    <li><span className="warn-icon">⚠</span> Slower than Linear Regression</li>
                    <li><span className="warn-icon">⚠</span> Less interpretable</li>
                    <li><span className="check-icon">+</span> Can capture complex patterns</li>
                    <li><span className="check-icon">+</span> Flexible architecture</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="model-comparison">
              <h3><span className="chart-icon">☷</span> Model Comparison</h3>
              <div className="comparison-grid">
                <div className="comparison-chart">
                  <h4>Performance Metrics</h4>
                  <div className="bar-chart">
                    <div className="bar-item">
                      <span className="bar-label">Linear Reg R²</span>
                      <div className="bar-container">
                        <div className="bar-fill" style={{ width: '95.21%', background: 'linear-gradient(90deg, #10b981, #059669)' }}></div>
                        <span className="bar-value">0.9521</span>
                      </div>
                    </div>
                    <div className="bar-item">
                      <span className="bar-label">Neural Net R²</span>
                      <div className="bar-container">
                        <div className="bar-fill" style={{ width: '93.87%', background: 'linear-gradient(90deg, #3b82f6, #2563eb)' }}></div>
                        <span className="bar-value">0.9387</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="comparison-chart">
                  <h4>Training Efficiency</h4>
                  <div className="efficiency-grid">
                    <div className="efficiency-item">
                      <div className="efficiency-icon">⚡</div>
                      <div className="efficiency-text">
                        <strong>Linear Regression</strong>
                        <p>120x faster training</p>
                      </div>
                    </div>
                    <div className="efficiency-item">
                      <div className="efficiency-icon">🧠</div>
                      <div className="efficiency-text">
                        <strong>Neural Network</strong>
                        <p>More complex, slower</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="model-insights">
              <h3>💡 Model Selection Rationale</h3>
              <div className="insight-card">
                <p><strong>Why Linear Regression is Currently Active:</strong></p>
                <ol>
                  <li><strong>Superior Accuracy:</strong> Achieves R² of 0.9521 vs 0.9387 for Neural Network</li>
                  <li><strong>Interpretability:</strong> Clear feature coefficients allow understanding of price drivers</li>
                  <li><strong>Speed:</strong> Predictions in milliseconds, ideal for real-time dashboard</li>
                  <li><strong>Simplicity:</strong> No multicollinearity issues with simplified 5-feature model</li>
                  <li><strong>Reliability:</strong> Stable predictions without overfitting concerns</li>
                </ol>
              </div>
            </div>
          </>
        );

      case 'regions':
        return (
          <>
            <div className="section-header">
              <h2><span className="section-icon">⊞</span> Regional Analysis</h2>
              <p>Compare median housing prices across California regions</p>
            </div>
            <div className="dashboard-grid">
              <div className="grid-item chart-section" style={{ gridColumn: 'span 2' }}>
                <ChartCard title="Regional Analysis" />
              </div>
            </div>
          </>
        );

      case 'features':
        return (
          <>
            <div className="section-header">
              <h2><span className="section-icon">◉</span> Feature Importance</h2>
              <p>See which economic factors have the most impact on housing prices</p>
            </div>
            <div className="dashboard-grid">
              <div className="grid-item chart-section" style={{ gridColumn: 'span 2' }}>
                <ChartCard title="Feature Importance" />
              </div>
            </div>
            <div className="feature-info">
              <h3>Model Features</h3>
              <ul className="feature-list">
                <li><strong>Previous Year Price:</strong> California's median housing price from the previous year - the strongest predictor</li>
                <li><strong>California Population:</strong> Total state population - more people means higher housing demand</li>
                <li><strong>Total Housing Units:</strong> Number of housing units statewide - supply affects prices</li>
                <li><strong>Total Consumer Debt:</strong> Total consumer debt in California (trillion $) - indicates economic capacity</li>
                <li><strong>Average Property Tax:</strong> Average property tax collected - reflects property values and fiscal policy</li>
              </ul>
            </div>
          </>
        );

      case 'history':
        return (
          <>
            <div className="section-header">
              <h2><span className="section-icon">☰</span> Historical Data</h2>
              <p>View historical housing price data and trends over time</p>
            </div>
            <section className="stats-grid">
              <StatsCard 
                title="Predictions Made" 
                value={predictionCount.toString()} 
                change={12.5} 
                icon="◈" 
              />
              <StatsCard 
                title="Data Points" 
                value={stats.totalRecords} 
                change={0} 
                icon="☷" 
              />
              <StatsCard 
                title="Years Tracked" 
                value="23" 
                change={4.3} 
                icon="◷" 
              />
              <StatsCard 
                title="Regions Analyzed" 
                value="62" 
                change={0} 
                icon="⊞" 
              />
            </section>
            <div className="dashboard-grid">
              <div className="grid-item chart-section" style={{ gridColumn: 'span 2' }}>
                <ChartCard title="Price Trends" />
              </div>
              <div className="grid-item chart-section">
                <ChartCard title="Feature Importance" />
              </div>
              <div className="grid-item chart-section">
                <ChartCard title="Regional Analysis" />
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="App">
      <Header onNavigate={setActiveSection} />
      <div className="dashboard-container">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
