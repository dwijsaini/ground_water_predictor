function predictLevel(wellId, rainfall, population, elevation, records) {
    const wellRecords = records.filter(r => r.well_id === wellId && r.water_level !== null);

    if (wellRecords.length === 0) {
        // Fallback if no data for this well
        return 20.0;
    }

    // Get the most recent observation
    const lastRecord = wellRecords[wellRecords.length - 1];
    const lastLevel = lastRecord.water_level;

    // Simple linear prototype model:
    // Water level (depth) increases (water drops) as population increases
    // Water level (depth) decreases (water rises) as rainfall increases

    const rainfallImpact = rainfall * -0.02; // Every 1 unit of rain reduces depth by 0.02m
    const populationImpact = (population / 1000) * 0.01; // Every 1k people increases depth by 0.01m
    const elevationImpact = (elevation / 100) * 0.05; // Simple elevation factor

    const prediction = lastLevel + rainfallImpact + populationImpact + elevationImpact;

    // Clamp value to be realistic (e.g., between 5m and 50m)
    return Math.max(5, Math.min(50, prediction));
}

function estimateMissingValue(wellId, date, records) {
    const wellRecords = records.filter(r => r.well_id === wellId);
    const targetRecord = wellRecords.find(r => r.date === date);

    if (!targetRecord) return null;

    // To estimate, we use the predictor logic but with available data from that record
    return predictLevel(
        wellId,
        targetRecord.rainfall || 0,
        targetRecord.population || 0,
        targetRecord.elevation || 0,
        records
    );
}

module.exports = {
    predictLevel,
    estimateMissingValue
};
