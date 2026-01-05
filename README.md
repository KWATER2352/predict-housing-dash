# California Housing Price Predictor

Machine learning dashboard for predicting California housing prices using economic indicators.

## Features

- Predict housing prices with 5 economic factors
- Interactive price trends chart with hover tooltips
- Regional analysis across California counties
- Feature importance visualization
- Real-time prediction with input validation

## Tech Stack

**Frontend:** React 19, JavaScript  
**Backend:** Flask 3.1, Python 3.13  
**ML Model:** Linear Regression (R² = 0.9521)  
**Data Processing:** Pandas, DuckDB

## Model Details

**Inputs:**
- California Population
- Total Consumer Debt (trillion $)
- Total Housing Units
- Average Property Tax
- Previous Year Median Price

**Output:** Predicted median housing price

## Quick Start

### Prerequisites
- Python 3.13+
- Node.js 16+

### Installation

1. **Clone and install dependencies**:
```bash
cd predict-housing-dash
pip install -r requirements.txt  # If you have one
npm install
```

2. **Activate virtual environment**:
```bash
.venv\Scripts\activate
```

1. **Clone and install dependencies:**
```bash
pip install -r requirements.txt
npm install
```

2. **Start backend:**
```bash
python app.py
```
Runs on http://localhost:5000

3. **Start frontend (new terminal):**
```bash
npm start
```
Runs on http://localhost:3001

## API Endpoints

- `POST /predict` - Get price prediction
- `GET /stats` - Dashboard statistics
- `GET /latest` - Latest data for form
- `GET /history` - Historical price data
- `GET /feature-importance` - Model feature weights
- `GET /regional-analysis` - Regional median prices

## Project Structure

```
predict-housing-dash/
├── app.py                    # Flask API
├── src/
│   ├── App.js               # Main React app
│   ├── assets/
│   │   ├── components/      # React components
│   │   └── data/           # CSV datasets
│   └── *.pkl               # ML model files
└── README.md
```

## Dashboard Sections

- **Dashboard** - Overview with stats and predictions
- **Predictions** - Make new predictions
- **Analytics** - Historical trends analysis
- **Models** - Model comparison and metrics
- **Regions** - Regional price comparison
- **Features** - Feature importance analysis
- **History** - Complete historical data view

## Data

Historical California housing data (2003-2025) including population, consumer debt, housing units, property tax, and median prices.
│   ├── MLP.ipynb          # Model training notebook
│   ├── App.js             # React main component
│   ├── final_linear_model.pkl
│   ├── scaler_X.pkl
│   ├── scaler_y.pkl
│   ├── feature_names.pkl
│   ├── feature_importance.pkl
│   ├── assets/
│   │   ├── components/    # React components
│   │   └── data/          # CSV datasets
├── public/                # Static files
└── package.json
```

## 🔬 Model Training

The model is trained in `src/MLP.ipynb`:

1. **Data Loading**: CSV files → DuckDB tables
2. **Data Merging**: Join population, debt, housing, tax data
3. **Feature Engineering**: Create CA_lag1 (previous year price)
4. **Model Training**: Linear Regression with StandardScaler
5. **Feature Selection**: Remove multicollinear features
6. **Permutation Importance**: Calculate true feature importance
7. **Model Export**: Save as pickle files

### Key Improvements
- **Removed multicollinearity**: Dropped individual debt components (mortgage, auto, credit card) that were included in total_debt
- **Permutation importance**: More accurate than coefficient-based importance
- **Simplified features**: Only 5 intuitive inputs

## 📈 Results

- **Model R²**: 0.95+
- **Most Important Features** (by permutation):
  1. CA_lag1 (previous year price)
  2. Total Debt
  3. Population
  4. Total Housing Units
  5. Average Property Tax

## 🎨 Dashboard Features

### Stats Cards
- Average Price
- Predictions Today
- Model Accuracy
- Total Data Records

### Charts
1. **Price Trends**: Historical data summary
2. **Feature Importance**: Top 5 features with permutation scores
3. **Regional Analysis**: Top regions by median price

### Prediction Form
- Auto-filled with latest California data
- 5 required fields
- Real-time validation
- Instant predictions

## 🛠️ Technologies Used

**Frontend**:
- React 19
- CSS3
- Fetch API

**Backend**:
- Flask 3.1
- Flask-CORS
- Pandas
- NumPy
- scikit-learn

**Data**:
- DuckDB
- CSV files

**ML**:
- Linear Regression
- StandardScaler
- Permutation Importance

## 📝 Development Notes

### Why Linear Regression?
- High R² score (0.95+)
- Fast predictions
- Interpretable results
- No overfitting

### Why These 5 Features?
- Removed multicollinearity (total_debt already includes individual debts)
- All features are readily available economic indicators
- Strong predictive power
- Easy to understand and input

## 🔮 Future Enhancements

- Add time-series forecasting
- Interactive charts with Plotly/Chart.js
- User authentication
- Save prediction history
- Export reports as PDF
- Mobile responsive improvements

## 📄 License

This project is for educational purposes.

## 👤 Author

Created as a machine learning and full-stack development project.
