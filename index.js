const path = require('path');
const { readCSV, saveCSV } = require('./src/data');
const { predictLevel, estimateMissingValue } = require('./src/predictor');
const { forecastFutureLevels } = require('./src/forecast');
const { analyzeGroundwater } = require('./src/analysis');
const TerminalUI = require('./src/terminal');

const ui = new TerminalUI();
const DATA_PATH = path.join(__dirname, 'data', 'groundwater.csv');
const FILLED_DATA_PATH = path.join(__dirname, 'data', 'groundwater_filled.csv');

async function main() {
    let records = readCSV(DATA_PATH);

    if (records.length === 0) {
        console.log('Error: No data found in data/groundwater.csv. Please ensure the file exists.');
        process.exit(1);
    }

    process.stdin.setRawMode(true);
    process.stdin.resume();

    const menuOptions = [
        'Predict Groundwater Level',
        'Forecast Future Level',
        'Find Missing Data',
        'View Well Data',
        'Analyze Groundwater',
        'Exit'
    ];

    let selectedIndex = 0;
    let running = true;

    while (running) {
        ui.clear();
        ui.drawBox('GROUND WATER LEVEL PREDICTOR', menuOptions, selectedIndex);

        const key = await ui.waitForKey();

        if (key === '') { // Ctrl+C
            running = false;
            break;
        }

        if (key === 'q' || key === 'Q') {
            running = false;
            break;
        }

        if (key === '[A') { // UP arrow
            selectedIndex = (selectedIndex - 1 + menuOptions.length) % menuOptions.length;
        } else if (key === '[B') { // DOWN arrow
            selectedIndex = (selectedIndex + 1) % menuOptions.length;
        } else if (key === '\r' || key === '\n') { // ENTER
            const choice = menuOptions[selectedIndex];

            if (choice === 'Predict Groundwater Level') {
                await handlePredict(records);
            } else if (choice === 'Forecast Future Level') {
                await handleForecast(records);
            } else if (choice === 'Find Missing Data') {
                await handleMissingData(records);
            } else if (choice === 'View Well Data') {
                await handleViewData(records);
            } else if (choice === 'Analyze Groundwater') {
                await handleAnalysis(records);
            } else if (choice === 'Exit') {
                running = false;
            }
        }
    }

    process.stdin.setRawMode(false);
    process.stdin.pause();
    ui.clear();
    console.log('Thank you for using the Ground Water Level Predictor. Goodbye!');
}

async function handlePredict(records) {
    process.stdin.setRawMode(false);
    ui.clear();
    console.log('--- Predict Groundwater Level ---');
    const wellId = await ui.prompt('Enter Well ID (e.g., W01): ');
    const rainfall = await ui.prompt('Enter expected rainfall (mm): ');
    const population = await ui.prompt('Enter current population: ');
    const elevation = await ui.prompt('Enter elevation (m): ');

    const r = parseFloat(rainfall);
    const p = parseFloat(population);
    const e = parseFloat(elevation);

    if (isNaN(r) || isNaN(p) || isNaN(e)) {
        console.log('\nError: Invalid numeric input.');
    } else {
        const prediction = predictLevel(wellId, r, p, e, records);
        console.log(`\nPredicted groundwater level for ${wellId}: ${prediction.toFixed(2)} m`);
    }

    await ui.pause();
    process.stdin.setRawMode(true);
}

async function handleForecast(records) {
    process.stdin.setRawMode(false);
    ui.clear();
    console.log('--- Forecast Future Level ---');
    const wellId = await ui.prompt('Enter Well ID (e.g., W01): ');
    const periods = await ui.prompt('Number of periods to forecast: ');

    const p = parseInt(periods);
    if (isNaN(p)) {
        console.log('\nError: Invalid number of periods.');
    } else {
        const forecasts = forecastFutureLevels(wellId, p, records);
        if (forecasts.length === 0) {
            console.log(`\nNo data found for well ${wellId}.`);
        } else {
            console.log(`\nPrototype Forecast for ${wellId}:`);
            console.log('-----------------------------------');
            forecasts.forEach(f => {
                console.log(`${f.date}    ${f.level} m`);
            });
            console.log('-----------------------------------');
            console.log('Note: These are prototype predictions based on historical trends.');
        }
    }

    await ui.pause();
    process.stdin.setRawMode(true);
}

async function handleMissingData(records) {
    process.stdin.setRawMode(false);
    ui.clear();
    console.log('--- Find and Estimate Missing Data ---');

    const missing = records.filter(r => r.water_level === null);

    if (missing.length === 0) {
        console.log('\nNo missing observations found in the dataset.');
    } else {
        console.log(`Found ${missing.length} missing observations.\n`);

        const filledRecords = JSON.parse(JSON.stringify(records));
        const missingIdx = records.reduce((acc, r, i) => {
            if (r.water_level === null) acc.push(i);
            return acc;
        }, []);

        missingIdx.forEach(idx => {
            const r = records[idx];
            const estimated = estimateMissingValue(r.well_id, r.date, records);
            console.log(`Well: ${r.well_id} | Date: ${r.date} | Estimated Level: ${estimated.toFixed(2)} m`);
            filledRecords[idx].water_level = estimated;
        });

        saveCSV(FILLED_DATA_PATH, filledRecords);
        console.log(`\nEstimated values have been saved to: data/groundwater_filled.csv`);
    }

    await ui.pause();
    process.stdin.setRawMode(true);
}

async function handleViewData(records) {
    process.stdin.setRawMode(false);
    ui.clear();
    console.log('--- View Well Data ---');

    const wells = [...new Set(records.map(r => r.well_id))];
    console.log('Available Wells:', wells.join(', '));
    const wellId = await ui.prompt('Select a Well ID: ');

    const wellData = records.filter(r => r.well_id === wellId);

    if (wellData.length === 0) {
        console.log(`\nNo data found for well ${wellId}.`);
    } else {
        console.log(`\nWELL ${wellId}`);
        console.log('Date          Rainfall    Water Level');
        console.log('---------------------------------------');
        wellData.forEach(r => {
            const level = r.water_level !== null ? r.water_level.toFixed(2) : 'MISSING';
            console.log(`${r.date}       ${(r.rainfall || 0).toString().padEnd(10)} ${level}`);
        });
    }

    await ui.pause();
    process.stdin.setRawMode(true);
}

async function handleAnalysis(records) {
    process.stdin.setRawMode(false);
    ui.clear();
    console.log('--- Groundwater Analysis ---');

    const stats = analyzeGroundwater(records);
    if (!stats) {
        console.log('\nNo data available for analysis.');
    } else {
        console.log(`Total Observations:    ${stats.totalObservations}`);
        console.log(`Missing Observations:  ${stats.missingObservations}`);
        console.log(`Average Level:         ${stats.averageLevel} m`);
        console.log(`Highest Level:         ${stats.highestLevel} m`);
        console.log(`Lowest Level:          ${stats.lowestLevel} m`);
        console.log(`Average Rainfall:      ${stats.averageRainfall} mm`);
        console.log(`Overall Trend:         ${stats.trend}`);
    }

    await ui.pause();
    process.stdin.setRawMode(true);
}

main().catch(err => {
    console.error('Application Error:', err);
    process.exit(1);
});
