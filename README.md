Ground Water Level Predictor

A terminal-based JavaScript application that estimates and forecasts groundwater levels using historical well data and environmental factors.

Overview

Groundwater level is an important indicator of the condition of an aquifer. It can change due to factors such as rainfall, population, elevation, water consumption, and seasonal conditions.

This project is a simplified educational prototype that demonstrates how groundwater observations can be stored, analysed, and used to make basic groundwater-level predictions.

The application runs completely in the terminal using Node.js.

Objectives

The project aims to:

* Predict groundwater level using environmental inputs.
* Forecast groundwater level for future periods.
* View historical data for individual wells.
* Identify and estimate missing groundwater observations.
* Perform basic statistical analysis on groundwater data.
* Provide an interactive terminal interface.

Main Features

1. Interactive Terminal Menu

The application provides a keyboard-controlled menu.

Navigation:

* ↑ — move up
* ↓ — move down
* ENTER — select
* Q — quit
* CTRL + C — exit

The interface is built using Node.js standard input/output and terminal escape sequences.

2. Groundwater Prediction

The application predicts groundwater depth using four main values:

* Last known groundwater level
* Rainfall
* Population
* Elevation

The prototype uses the following simplified formula:

Predicted Level =
Last Known Level
+ (Rainfall × -0.02)
+ ((Population / 1000) × 0.01)
+ ((Elevation / 100) × 0.05)

For example:

Last Level = 20 m
Rainfall = 100 mm
Population = 5000
Elevation = 200 m

Calculation:

20
+ (100 × -0.02)
+ ((5000 / 1000) × 0.01)
+ ((200 / 100) × 0.05)
= 18.15 m

The result represents the estimated groundwater depth below the ground surface.

3. Future Forecasting

The application can estimate groundwater levels for future periods.

It starts with the latest known groundwater level and repeatedly applies the prediction formula.

The basic process is:

Latest groundwater level
          ↓
Predict next period
          ↓
Use predicted value
          ↓
Predict following period
          ↓
Repeat

Historical rainfall information from the selected well is used when generating the forecast.

4. Missing Data Estimation

Groundwater datasets can contain missing observations.

For example:

W01  January    18.2
W01  February   18.5
W01  March      MISSING
W01  April      19.1

The application can estimate the missing value using the environmental information available for that record and the most recent known groundwater level.

The estimated values can be saved into a separate filled dataset.

5. Well Data Viewer

Users can select a well and view its historical observations.

The application can display information such as:

Well ID
Date
Rainfall
Population
Elevation
Groundwater Level

This makes it possible to inspect the data before making predictions.

6. Statistical Analysis

The application provides basic information about the dataset, including:

* Number of observations
* Missing observations
* Average groundwater level
* Highest groundwater level
* Lowest groundwater level
* Average rainfall

This provides a simple overview of the groundwater dataset.

Data

The project uses CSV files to store groundwater observations.

A typical record contains:

well_id
date
rainfall
population
elevation
water_level

Example:

W01,2024-01-01,120,5000,200,18.5

The dataset included with this project is synthetic sample data created for educational purposes.

It is not official CGWB data.

Project Structure

ground_water_predictor/
│
├── index.js
├── package.json
├── package-lock.json
├── README.md
│
├── data/
│   ├── groundwater.csv
│   └── groundwater_filled.csv
│
└── src/
    ├── data.js
    ├── predictor.js
    ├── forecast.js
    ├── analysis.js
    └── terminal.js

index.js

Main entry point of the application.

It controls the application flow and connects the different parts of the program.

src/data.js

Responsible for reading and writing the CSV data.

src/predictor.js

Contains the groundwater prediction calculation and missing-data estimation logic.

src/forecast.js

Contains the logic used to generate future groundwater-level predictions.

src/analysis.js

Performs basic statistical analysis of the groundwater dataset.

src/terminal.js

Contains terminal-interface utilities such as displaying menus, clearing the screen, handling keyboard input, and formatting terminal output.

data/groundwater.csv

Contains the original sample groundwater observations.

data/groundwater_filled.csv

Contains groundwater data after missing observations have been estimated.

Technology

* Language: JavaScript
* Runtime: Node.js
* Data format: CSV
* Input/Output: Node.js Standard Input and Output
* Terminal control: ANSI escape sequences
* Modules: Node.js built-in modules

No external machine-learning library is required.

How the Application Works

The overall workflow is:

Start Application
       ↓
Load CSV Dataset
       ↓
Display Terminal Menu
       ↓
User Selects Feature
       ↓
┌───────────────────────────┐
│ Prediction                │
│ Forecast                  │
│ Missing Data Estimation   │
│ Well Data                 │
│ Statistical Analysis      │
└───────────────────────────┘
       ↓
Process Data
       ↓
Display Result
       ↓
Return to Menu

Installation

Clone the repository:

git clone https://github.com/dwijsaini/ground_water_predictor.git

Enter the project directory:

cd ground_water_predictor

Install the Node.js project:

npm install

Running the Application

Run:

node index.js

The terminal menu will appear.

Use the arrow keys to navigate and press Enter to select an option.

Prediction Model

This project does not claim to be a scientifically calibrated groundwater model or a machine-learning model.

It uses a simple weighted mathematical formula designed for an educational demonstration.

The coefficients:

-0.02
0.01
0.05

are prototype coefficients.

A real groundwater prediction system would require historical measurements, hydrogeological information, soil characteristics, land use, weather data, extraction data, and proper model calibration.

Limitations

This project has several limitations:

1. The dataset is synthetic.
2. The prediction formula is simplified.
3. The coefficients are not scientifically calibrated.
4. Complex aquifer behaviour is not modelled.
5. The application does not use real-time groundwater sensors.
6. The application does not use official CGWB data.
7. Forecasting is based on the simplified prediction model rather than a dedicated time-series model.

Therefore, the results should be treated as educational estimates rather than real groundwater assessments.

Future Improvements

Possible future improvements include:

* Use real groundwater datasets.
* Calibrate the prediction coefficients using historical observations.
* Add more environmental factors.
* Use a proper regression or time-series model.
* Integrate rainfall/weather APIs.
* Add soil and hydrogeological information.
* Add real-time DWLR data.
* Improve forecasting accuracy.
* Add geographical location support.
* Use child_process.spawn() for separate prediction processes if required by the project architecture.

Purpose

This project was developed as a college terminal-based software project to demonstrate:

* JavaScript programming
* Node.js
* File handling
* CSV processing
* Terminal input/output
* Data processing
* Mathematical modelling
* Forecasting
* Basic statistical analysis

The project is intended for educational purposes.
