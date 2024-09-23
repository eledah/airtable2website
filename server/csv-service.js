const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const CSV_DIR = path.join(__dirname, '..', 'data');
let records = [];

// Read all CSV files in the data directory
fs.readdirSync(CSV_DIR).forEach(file => {
    if (path.extname(file).toLowerCase() === '.csv') {
        const filePath = path.join(CSV_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const rows = [];
        
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                rows.push(row);
            })
            .on('end', () => {
                records = records.concat(rows.map((row, index) => ({
                    id: `${path.parse(file).name}-${index}`,
                    ...row
                })));
            });
    }
});

const getAllRecords = () => {
    return records;
};

const getRecordById = (id) => {
    return records.find(record => record.id === id) || null;
};

module.exports = {
    getAllRecords,
    getRecordById
};