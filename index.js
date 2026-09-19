const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ==========================================
// DATA LAYER
// ==========================================
function readCSV(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const lines = data.trim().split('\n');
        const headers = lines[0].split(',');
        return lines.slice(1).map(line => {
            const values = line.split(',');
            const record = {};
            headers.forEach((header, index) => {
                const val = values[index] ? values[index].trim() : '';
                if (val !== '' && !isNaN(val)) record[header] = parseFloat(val);
                else record[header] = val === '' ? null : val;
            });
            return record;
        });
    } catch (error) {
        console.error(`Error reading CSV: ${error.message}`);
        return [];
    }
}

function saveCSV(filePath, records) {
    if (records.length === 0) return;
    const headers = Object.keys(records[0]);
    const csvContent = [
        headers.join(','),
        ...records.map(record => headers.map(header => record[header] ?? '').join(','))
    ].join('\n');
    try { fs.writeFileSync(filePath, csvContent, 'utf8'); } catch (e) { console.error(e); }
}

// ==========================================
// PREDICTION LOGIC
// ==========================================
function predictLevel(wellId, rainfall, population, elevation, records) {
    const wellRecords = records.filter(r => r.well_id === wellId && r.water_level !== null);
    if (wellRecords.length === 0) return 20.0;
    const lastRecord = wellRecords[wellRecords.length - 1];
    const lastLevel = lastRecord.water_level;
    const prediction = lastLevel + (rainfall * -0.02) + ((population / 1000) * 0.01) + ((elevation / 100) * 0.05);
    return Math.max(5, Math.min(50, prediction));
}

function estimateMissingValue(wellId, date, records) {
    const targetRecord = records.find(r => r.well_id === wellId && r.date === date);
    if (!targetRecord) return null;
    return predictLevel(wellId, targetRecord.rainfall || 0, targetRecord.population || 0, targetRecord.elevation || 0, records);
}

function forecastFutureLevels(wellId, periods, records) {
    const wellRecords = records.filter(r => r.well_id === wellId);
    if (wellRecords.length === 0) return [];
    const lastRecord = wellRecords[wellRecords.length - 1];
    const rainfallAvg = wellRecords.reduce((sum, r) => sum + (r.rainfall || 0), 0) / wellRecords.length;
    const forecasts = [];
    let currentLevel = lastRecord.water_level || 20.0;
    let lastDate = new Date(lastRecord.date);
    for (let i = 1; i <= periods; i++) {
        currentLevel = predictLevel(wellId, rainfallAvg, 5000, 210, [...records, { well_id: wellId, water_level: currentLevel }]);
        lastDate.setMonth(lastDate.getMonth() + 1);
        forecasts.push({ date: lastDate.toISOString().split('T')[0], level: currentLevel.toFixed(2) });
    }
    return forecasts;
}

function analyzeGroundwater(records) {
    const levels = records.map(r => r.water_level).filter(l => l !== null);
    const rainfalls = records.map(r => r.rainfall).filter(r => r !== null);
    const avgLevel = levels.reduce((a, b) => a + b, 0) / levels.length;
    return {
        totalObservations: records.length,
        missingObservations: records.filter(r => r.water_level === null).length,
        averageLevel: avgLevel.toFixed(2),
        highestLevel: Math.max(...levels).toFixed(2),
        lowestLevel: Math.min(...levels).toFixed(2),
        averageRainfall: (rainfalls.reduce((a, b) => a + b, 0) / rainfalls.length).toFixed(2),
        trend: 'Stable'
    };
}

// ==========================================
// TERMINAL UI
// ==========================================
class TerminalUI {
    clear() { process.stdout.write('\x1Bc'); }
    drawBox(title, options, selectedIndex) {
        const width = 48;
        const border = '═'.repeat(width - 2);
        console.log(`╔${border}╗`);
        console.log(`║${title.padStart((width + title.length) / 2).padEnd(width - 2)}║`);
        console.log(`╠${border}╣`);
        console.log(`║${' '.repeat(width - 2)}║`);
        options.forEach((option, index) => {
            const prefix = index === selectedIndex ? '> ' : '  ';
            const text = `${prefix}${index + 1}. ${option}`;
            console.log(`║${text.padEnd(width - 2)}║`);
        });
        console.log(`║${' '.repeat(width - 2)}║`);
        console.log(`╚${border}╝`);
    }
    async prompt(question) {
        return new Promise(resolve => {
            const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
            rl.question(question, (answer) => { rl.close(); resolve(answer); });
        });
    }
    async waitForKey() {
        return new Promise(resolve => {
            process.stdin.once('data', data => resolve(data.toString()));
        });
    }
    pause() {
        console.log('\nPress any key to return to menu...');
        return this.waitForKey();
    }
}

// ==========================================
// MAIN APPLICATION
// ==========================================
async function main() {
    const ui = new TerminalUI();
    const DATA_PATH = path.join(__dirname, 'data', 'groundwater.csv');
    const FILLED_DATA_PATH = path.join(__dirname, 'data', 'groundwater_filled.csv');
    let records = readCSV(DATA_PATH);
    if (records.length === 0) { console.log('Error: Data not found.'); process.exit(1); }

    if (process.stdin.setRawMode) process.stdin.setRawMode(true);
    process.stdin.resume();

    const menuOptions = ['Predict Groundwater Level', 'Forecast Future Level', 'Find Missing Data', 'View Well Data', 'Analyze Groundwater', 'Exit'];
    let selectedIndex = 0;
    let running = true;

    while (running) {
        ui.clear();
        ui.drawBox('GROUND WATER LEVEL PREDICTOR', menuOptions, selectedIndex);
        const key = await ui.waitForKey();

        if (key === '' || key === 'q' || key === 'Q') { running = false; break; }
        if (key === '\x1b[A' || key === 'w' || key === 'W') {
            selectedIndex = (selectedIndex - 1 + menuOptions.length) % menuOptions.length;
        } else if (key === '\x1b[B' || key === 's' || key === 'S') {
            selectedIndex = (selectedIndex + 1) % menuOptions.length;
        } else if (key === '\r' || key === '\n' || key === 'k' || key === 'K') {
            await handleChoice(selectedIndex, records, ui, FILLED_DATA_PATH);
        } else if (key >= '1' && key <= '6') {
            await handleChoice(parseInt(key) - 1, records, ui, FILLED_DATA_PATH);
        }
    }
    if (process.stdin.setRawMode) process.stdin.setRawMode(false);
    process.stdin.pause();
    ui.clear();
    console.log('Goodbye!');
}

async function handleChoice(index, records, ui, filledPath) {
    const menuOptions = ['Predict Groundwater Level', 'Forecast Future Level', 'Find Missing Data', 'View Well Data', 'Analyze Groundwater', 'Exit'];
    const choice = menuOptions[index];
    if (process.stdin.setRawMode) process.stdin.setRawMode(false);
    ui.clear();

    if (choice === 'Predict Groundwater Level') {
        const wellId = await ui.prompt('Enter Well ID: ');
        const rain = await ui.prompt('Rainfall: ');
        const pop = await ui.prompt('Population: ');
        const elev = await ui.prompt('Elevation: ');
        console.log(`\nPredicted Level: ${predictLevel(wellId, parseFloat(rain), parseFloat(pop), parseFloat(elev), records).toFixed(2)} m`);
    } else if (choice === 'Forecast Future Level') {
        const wellId = await ui.prompt('Enter Well ID: ');
        const p = await ui.prompt('Periods: ');
        const f = forecastFutureLevels(wellId, parseInt(p), records);
        f.forEach(v => console.log(`${v.date}    ${v.level} m`));
    } else if (choice === 'Find Missing Data') {
        const missing = records.filter(r => r.water_level === null);
        const filled = JSON.parse(JSON.stringify(records));
        missing.forEach((r, i) => {
            const est = estimateMissingValue(r.well_id, r.date, records);
            console.log(`Well ${r.well_id} ${r.date}: ${est.toFixed(2)} m`);
            const actualIdx = records.indexOf(r);
            filled[actualIdx].water_level = est;
        });
        saveCSV(filledPath, filled);
    } else if (choice === 'View Well Data') {
        const wellId = await ui.prompt('Enter Well ID: ');
        records.filter(r => r.well_id === wellId).forEach(r => {
            console.log(`${r.date} | ${r.rainfall} | ${r.water_level || 'MISSING'}`);
        });
    } else if (choice === 'Analyze Groundwater') {
        const s = analyzeGroundwater(records);
        console.log(`Avg: ${s.averageLevel}m, Missing: ${s.missingObservations}, Trend: ${s.trend}`);
    } else if (choice === 'Exit') {
        process.exit(0);
    }

    await ui.pause();
    if (process.stdin.setRawMode) process.stdin.setRawMode(true);
}

main().catch(console.error);
