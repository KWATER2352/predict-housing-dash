from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

MODEL_DIR = 'src'

def load_model():
    with open(os.path.join(MODEL_DIR, 'final_linear_model.pkl'), 'rb') as f:
        model = pickle.load(f)
    with open(os.path.join(MODEL_DIR, 'scaler_X.pkl'), 'rb') as f:
        scaler_X = pickle.load(f)
    with open(os.path.join(MODEL_DIR, 'scaler_y.pkl'), 'rb') as f:
        scaler_y = pickle.load(f)
    with open(os.path.join(MODEL_DIR, 'feature_names.pkl'), 'rb') as f:
        feature_names = pickle.load(f)
    return model, scaler_X, scaler_y, feature_names

model, scaler_X, scaler_y, feature_names = load_model()

@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Welcome to the California Housing Price Prediction API!',
                    'endpoints': {
                        'POST /predict': 'Predict housing price. Send JSON with features.',
                        'GET /history': 'Get historical housing data.',
                        'GET /latest': 'Get latest housing data.',
                        'GET /features': 'Get list of feature names required for prediction.' 
                    },
                    'status': 'API is running'}
                    )

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    features = np.array([data[feature] for feature in feature_names]).reshape(1, -1)
    features_scaled = scaler_X.transform(features)
    prediction_scaled = model.predict(features_scaled)     
    prediction = scaler_y.inverse_transform(prediction_scaled.reshape(-1, 1)).flatten()[0]
    return jsonify({'predicted_price': prediction})

@app.route('/features', methods=['GET'])
def get_features():
    return jsonify({
        'features': feature_names,
        'count': len(feature_names)
    })

@app.route('/stats', methods=['GET'])
def get_stats():
    df = pd.read_csv(os.path.join(MODEL_DIR, 'assets/data/merged_housing_data.csv'))
    return jsonify({
        'avg_price': float(df['avg_median_price'].mean()),
        'total_records': int(len(df)),
        'latest_year': int(df['year'].max()),
        'earliest_year': int(df['year'].min())
    })

@app.route('/feature-importance', methods=['GET'])
def feature_importance():
    # Load permutation importance from saved file
    try:
        with open(os.path.join(MODEL_DIR, 'feature_importance.pkl'), 'rb') as f:
            importance_data = pickle.load(f)
        return jsonify(importance_data)
    except FileNotFoundError:
        # Fallback to coefficients if permutation importance not found
        coefficients = model.coef_
        importance_data = [
            {'feature': feature, 'importance': float(abs(coef))}
            for feature, coef in zip(feature_names, coefficients)
        ]
        importance_data.sort(key=lambda x: x['importance'], reverse=True)
        return jsonify(importance_data)

@app.route('/regional-analysis', methods=['GET'])
def regional_analysis():
    # Read the median price data by region
    try:
        df = pd.read_csv(os.path.join(MODEL_DIR, 'assets/data/MedianPricesofExistingDetachedHomesHistoricalData - Median Price.csv'))
        # Get the latest row (most recent data)
        latest_row = df.iloc[-1]
        
        regional_data = []
        for col in df.columns[1:]:  # Skip first column (date)
            value = latest_row[col]
            # Clean the value if it's a string with $ and commas
            if isinstance(value, str):
                value = value.replace('$', '').replace(',', '')
            try:
                price = float(value)
                if not pd.isna(price) and price > 0:  # Filter out NaN and invalid values
                    regional_data.append({
                        'region': col,
                        'median_price': price
                    })
            except:
                continue
        
        # Sort by price descending
        regional_data.sort(key=lambda x: x['median_price'], reverse=True)
        return jsonify(regional_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/history', methods=['GET'])
def history():
    df = pd.read_csv(os.path.join(MODEL_DIR, 'assets/data/merged_housing_data.csv'))
    df = df.fillna(0)
    return jsonify(df.to_dict(orient='records'))

@app.route('/latest', methods=['GET'])
def latest():
    df = pd.read_csv(os.path.join(MODEL_DIR, 'assets/data/merged_housing_data.csv'))
    
    # Create CA_lag1 (previous year's median price)
    df = df.sort_values('year')
    df['CA_lag1'] = df['avg_median_price'].shift(1)
    
    # Get the latest row with CA_lag1
    latest_data = df[df['CA_lag1'].notna()].tail(1)
    
    if latest_data.empty:
        return jsonify({'error': 'No data available'}), 404
    
    result = latest_data.iloc[0].to_dict()
    
    # Handle NaN values - use mean or last valid value
    if pd.isna(result.get('avg_property_tax')):
        # Use the last valid property tax value or a reasonable default
        valid_tax = df['avg_property_tax'].dropna()
        if not valid_tax.empty:
            result['avg_property_tax'] = valid_tax.iloc[-1]
        else:
            result['avg_property_tax'] = 713392.78  # Default based on historical data
    
    return jsonify(result)

if __name__ == '__main__':
    print("Api running on http://localhost:5000")
    app.run(debug=True, port=5000)
    

