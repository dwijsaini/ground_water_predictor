function analyzeGroundwater(records) {
    if (records.length === 0) return null;

    const levels = records
        .map(r => r.water_level)
        .filter(l => l !== null);

    const rainfalls = records
        .map(r => r.rainfall)
        .filter(r => r !== null);

    const missingCount = records.filter(r => r.water_level === null).length;

    const avgLevel = levels.reduce((a, b) => a + b, 0) / levels.length;
    const maxLevel = Math.max(...levels);
    const minLevel = Math.min(...levels);
    const avgRain = rainfalls.reduce((a, b) => a + b, 0) / rainfalls.length;

    // Simple trend: compare first half vs second half of the dataset
    let trend = 'Stable';
    if (levels.length > 1) {
        const mid = Math.floor(levels.length / 2);
        const firstHalfAvg = levels.slice(0, mid).reduce((a, b) => a + b, 0) / mid;
        const secondHalfAvg = levels.slice(mid).reduce((a, b) => a + b, 0) / (levels.length - mid);

        if (secondHalfAvg > firstHalfAvg + 0.5) trend = 'Decreasing (Water table dropping)';
        else if (secondHalfAvg < firstHalfAvg - 0.5) trend = 'Increasing (Water table rising)';
    }

    return {
        totalObservations: records.length,
        missingObservations: missingCount,
        averageLevel: avgLevel.toFixed(2),
        highestLevel: maxLevel.toFixed(2),
        lowestLevel: minLevel.toFixed(2),
        averageRainfall: avgRain.toFixed(2),
        trend: trend
    };
}

module.exports = {
    analyzeGroundwater
};
