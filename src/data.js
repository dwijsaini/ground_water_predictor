const fs = require('fs');
const path = require('path');

function readCSV(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const lines = data.trim().split('\n');
        const headers = lines[0].split(',');

        const records = lines.slice(1).map(line => {
            const values = line.split(',');
            const record = {};
            headers.forEach((header, index) => {
                const val = values[index] ? values[index].trim() : '';
                // Convert to number if it's a valid number and not empty
                if (val !== '' && !isNaN(val)) {
                    record[header] = parseFloat(val);
                } else {
                    record[header] = val === '' ? null : val;
                }
            });
            return record;
        });

        return records;
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

    try {
        fs.writeFileSync(filePath, csvContent, 'utf8');
    } catch (error) {
        console.error(`Error saving CSV: ${error.message}`);
    }
}

module.exports = {
    readCSV,
    saveCSV
};
