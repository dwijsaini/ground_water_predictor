const { predictLevel } = require('./predictor');

function forecastFutureLevels(wellId, periods, records) {
    const wellRecords = records.filter(r => r.well_id === wellId);
    if (wellRecords.length === 0) return [];

    const lastRecord = wellRecords[wellRecords.length - 1];
    const rainfallAvg = records
        .filter(r => r.well_id === wellId)
        .reduce((sum, r) => sum + (r.rainfall || 0), 0) / wellRecords.length;

    const forecasts = [];
    let currentLevel = lastRecord.water_level || 20.0;
    let currentPopulation = lastRecord.population || 0;
    let currentElevation = lastRecord.elevation || 0;

    // Simple date increment (approx 30 days)
    let lastDate = new Date(lastRecord.date);

    for (let i = 1; i <= periods; i++) {
        // Simulate slight population growth
        currentPopulation += 10;

        // Predict next level
        currentLevel = predictLevel(
            wellId,
            rainfallAvg,
            currentPopulation,
            currentElevation,
            // We pass the records, but the predictor uses the 'lastRecord' which we need to update
            // Since our predictLevel uses records.filter, we'll simulate the 'last record'
            // by adding the previous forecast to a temporary records list.
            [...records, { well_id: wellId, water_level: currentLevel }]
        );

        lastDate.setMonth(lastDate.getMonth() + 1);
        forecasts.push({
            date: lastDate.toISOString().split('T')[0],
            level: currentLevel.toFixed(2)
        });
    }

    return forecasts;
}

module.exports = {
    forecastFutureLevels
};
