import React, { useState, useEffect } from 'react';
import './PredictionForm.css';
import PredictionModal from './PredictionModal';

function PredictionForm(props) {
  const [formData, setFormData] = useState({
    population: '',
    total_debt: '',
    total_housing_units: '',
    avg_property_tax: '',
    CA_lag1: '',
  });
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatShorthand = (num) => {
    if (!num) return '';
    const n = parseFloat(num);
    if (isNaN(n)) return num;
    
    if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(0) + 'K';
    return n.toFixed(2);
  };

  const parseShorthand = (str) => {
    if (!str) return '';
    const s = String(str).toUpperCase().trim();
    
    if (!isNaN(s)) return parseFloat(s);
    
    const multipliers = { K: 1e3, M: 1e6, B: 1e9 };
    const match = s.match(/^([\d.]+)([KMB])$/);
    
    if (match) {
      const [, num, suffix] = match;
      return parseFloat(num) * multipliers[suffix];
    }
    
    return parseFloat(s) || '';
  };

  useEffect(() => {
    loadLatestData();
  }, []);

  const loadLatestData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/latest');
      const data = await response.json();
      
      setFormData({
        population: data.population || '',
        total_debt: data.total_debt || '',
        total_housing_units: data.total_housing_units || '',
        avg_property_tax: data.avg_property_tax || '',
        CA_lag1: data.CA_lag1 || '',
      });
    } catch (error) {
      console.error('Error loading latest data:', error);
      setFormData({
        population: 39431263,
        total_debt: 17.796,
        total_housing_units: 14338000,
        avg_property_tax: 713392.78,
        CA_lag1: 700000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (typeof value === 'string' && /[KMBkmb]$/.test(value.trim())) {
      const numericValue = parseShorthand(value);
      setFormData({
        ...formData,
        [name]: numericValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Predicting for:', formData);

    try {
      const predictionData = {
        population: parseFloat(formData.population),
        total_debt: parseFloat(formData.total_debt),
        total_housing_units: parseFloat(formData.total_housing_units),
        avg_property_tax: parseFloat(formData.avg_property_tax),
        CA_lag1: parseFloat(formData.CA_lag1),
    };
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(predictionData),
      });

      const result = await response.json();
      console.log('Prediction result:', result);
      
      setModalData({
        price: result.predicted_price,
        inputs: predictionData,
        timestamp: new Date().toISOString()
      });
      setIsModalOpen(true);
      
      if (props.onPrediction) {
        props.onPrediction({
          price: result.predicted_price,
          inputs: predictionData,
          timestamp: new Date().toISOString()
        });
      }

    } catch (error) {
      console.error('Error during prediction:', error);
      alert('Error during prediction. Please try again.');
    }
  };

  return (
    <div className="prediction-form-container">
      <h2>Predict California Housing Price</h2>
      {loading ? (
        <p>Loading latest data...</p>
      ) : (
        <>
          <p className="form-description">
            Form pre-filled with latest California economic data. Adjust values to see predictions.
          </p>
          <button onClick={loadLatestData} className="btn-reload" type="button">
            <span className="icon-reload">↻</span> Reload Latest Data
          </button>
        </>
      )}
      <form onSubmit={handleSubmit} className="prediction-form">
        <div className="form-section-title">Required Fields</div>
        
        <div className="form-group">
          <label htmlFor="population">California Population</label>
          <input
            type="text"
            id="population"
            name="population"
            value={formData.population && typeof formData.population === 'number' ? formatShorthand(formData.population) : formData.population}
            onChange={handleChange}
            placeholder="e.g., 39M or 39431263"
            required
          />
          <small>Total state population - more people means higher housing demand</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="total_debt">Total Consumer Debt (Trillion $)</label>
          <input
            type="text"
            id="total_debt"
            name="total_debt"
            value={formData.total_debt}
            onChange={handleChange}
            placeholder="e.g., 17.796"
            required
          />
          <small>Total consumer debt - indicates economic capacity</small>
        </div>

        <div className="form-group">
          <label htmlFor="total_housing_units">Total Housing Units</label>
          <input
            type="text"
            id="total_housing_units"
            name="total_housing_units"
            value={formData.total_housing_units && typeof formData.total_housing_units === 'number' ? formatShorthand(formData.total_housing_units) : formData.total_housing_units}
            onChange={handleChange}
            placeholder="e.g., 14M or 14338000"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="avg_property_tax">Average Property Tax ($)</label>
          <input
            type="text"
            id="avg_property_tax"
            name="avg_property_tax"
            value={formData.avg_property_tax && typeof formData.avg_property_tax === 'number' ? formatShorthand(formData.avg_property_tax) : formData.avg_property_tax}
            onChange={handleChange}
            placeholder="e.g., 713K or 713392.78"
            required
          />
          <small>Average property tax collected - reflects property values</small>
        </div>

        <div className="form-group">
          <label htmlFor="CA_lag1">Previous Year Price ($)</label>
          <input
            type="text"
            id="CA_lag1"
            name="CA_lag1"
            value={formData.CA_lag1 && typeof formData.CA_lag1 === 'number' ? formatShorthand(formData.CA_lag1) : formData.CA_lag1}
            onChange={handleChange}
            placeholder="e.g., 700K or 700000"
            required
          />
          <small>Last year's median housing price - strongest predictor</small>
        </div>
        
        <button type="submit" className="btn-predict">
          Predict Price
        </button>
      </form>
      
      <PredictionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        prediction={modalData}
      />
    </div>
  );
}

export default PredictionForm;
