const express = require('express');
const path = require('path');
const csvService = require('./csv-service');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// API route to get all records
app.get('/api/records', (req, res) => {
    try {
        const records = csvService.getAllRecords();
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching records' });
    }
});

// API route to get a single record by ID
app.get('/api/records/:id', (req, res) => {
    try {
        const record = csvService.getRecordById(req.params.id);
        if (record) {
            res.json(record);
        } else {
            res.status(404).json({ error: 'Record not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching record' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});