# Ground Water Level Predictor

## Project Description
The **Ground Water Level Predictor** is a terminal-based software prototype designed to help analyze and predict groundwater levels based on historical data and environmental factors. This project is developed as an educational prototype to demonstrate the application of Node.js in solving real-world environmental problems.

## Problem Statement
Groundwater levels are critical for managing aquifers and ensuring water security. However, these levels fluctuate based on rainfall, location, elevation, population density, and seasonal patterns. Predicting these levels helps in planning water usage and identifying potential shortages.

## Objective
The primary objective of this project is to create a simplified tool that can:
- Predict current groundwater levels based on input parameters.
- Forecast future levels using historical trends.
- Estimate missing observations in a dataset.
- Provide basic statistical analysis of groundwater trends.

## Features
- **Interactive Terminal UI**: A clean, keyboard-navigable interface (UP/DOWN/ENTER).
- **Groundwater Prediction**: Estimates the water level using a mathematical model considering rainfall, population, and elevation.
- **Future Forecasting**: Predicts groundwater levels for several upcoming months based on historical averages.
- **Missing Data Estimation**: Scans the dataset for missing observations and fills them using available environmental data.
- **Well Data Viewer**: Allows users to view historical observations for specific wells.
- **Statistical Analysis**: Calculates average, highest, and lowest levels, and determines the general trend of the water table.

## Technology Used
- **Runtime**: Node.js
- **Language**: JavaScript (CommonJS)
- **Data Format**: CSV (Comma Separated Values)
- **Interface**: Standard I/O with ANSI escape sequences for terminal control.

## Project Structure
```
ground_water_predictor/
│
├── index.js                # Main entry point and Terminal UI loop
├── package.json            # Project configuration
├── README.md               # Documentation
│
├── data/
│   └── groundwater.csv     # Educational sample dataset
│   └── groundwater_filled.csv # Generated dataset with estimated values
│
└── src/
    ├── data.js             # CSV reading and writing logic
    ├── predictor.js        # Prediction and missing data estimation logic
    ├── forecast.js         # Future level forecasting logic
    ├── analysis.js         # Statistical analysis logic
    └── terminal.js         # UI helper class for terminal rendering
```

## Methodology

### 1. Prediction Methodology
The project uses a linear prototype model. The water level (depth from surface) is calculated as:
`Prediction = LastKnownLevel + (Rainfall * -0.02) + (Population/1000 * 0.01) + (Elevation/100 * 0.05)`
- **Rainfall**: Increases water levels (decreases depth).
- **Population**: Increases water extraction (increases depth).
- **Elevation**: Acts as a base offset for the specific location.

### 2. Forecasting Methodology
Forecasting uses the average rainfall of the specific well's history and applies the prediction model iteratively over the requested number of periods, simulating slight population growth over time.

### 3. Missing Data Methodology
The system identifies records where the `water_level` field is empty. It then uses the environmental parameters of that specific record (rainfall, population, elevation) along with the last available observation for that well to estimate the missing value.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/dwijsaini/ground_water_predictor.git
   cd ground_water_predictor
   ```
2. Install dependencies (no external dependencies required for this prototype):
   ```bash
   npm install
   ```

## How to Run
Run the application using Node.js:
```bash
node index.js
```

## Example Usage
1. Use the **UP/DOWN arrows** to navigate the menu.
2. Press **ENTER** to select an option.
3. For **Prediction**, enter a Well ID (e.g., `W01`) and provide the current environmental values.
4. For **Analysis**, view the summary of the entire dataset.
5. Press **Q** or **Ctrl+C** to exit.

## Limitations
- **Educational Prototype**: This is a simplified model and should not be used for official geological or governmental assessments.
- **Sample Data**: The data used is synthetic and for demonstration purposes only.
- **Simple Linear Model**: The prediction logic is basic and does not account for complex aquifer dynamics.

## Future Improvements
- Integration with real-time weather APIs for automatic rainfall data.
- Implementation of a more robust regression model for higher accuracy.
- Support for multiple CSV files and larger datasets.
- Addition of more environmental factors (e.g., soil type, temperature).

---
*This project is an educational prototype developed for a college terminal project.*
