const express = require('express');
const router = express.Router();

module.exports = db => {
    // Create a new sailor
    router.post('/', (req, res) => {
        const { S_name, B_date, Rate } = req.body;
        const query = 'INSERT INTO Sailors (S_name, B_date, Rate) VALUES (?, ?, ?)';
        db.query(query, [S_name, B_date, Rate], (err, result) => {
            if (err) {
                res.status(500).json({ status: 'Error', message: err.message });
            } else {
                res.status(201).json({ status: 'Success', message: 'Sailor added', data: { S_Id: result.insertId } });
            }
        });
    });

    // Read all sailors
    router.get('/', (req, res) => {
        const query = 'SELECT * FROM Sailors';
        db.query(query, (err, results) => {
            if (err) {
                res.status(500).json({ status: 'Error', message: err.message });
            } else {
                res.status(200).json({ status: 'Success', data: results });
            }
        });
    });

    // Update a sailor
    router.put('/:id', (req, res) => {
        const { id } = req.params;
        const { S_name, B_date, Rate } = req.body;
        const query = 'UPDATE Sailors SET S_name = ?, B_date = ?, Rate = ? WHERE S_Id = ?';
        db.query(query, [S_name, B_date, Rate, id], (err, result) => {
            if (err) {
                res.status(500).json({ status: 'Error', message: err.message });
            } else if (result.affectedRows === 0) {
                res.status(404).json({ status: 'Error', message: 'Sailor not found' });
            } else {
                res.status(200).json({ status: 'Success', message: 'Sailor updated' });
            }
        });
    });

    // Delete a sailor
    router.delete('/:id', (req, res) => {
        const { id } = req.params;
        const query = 'DELETE FROM Sailors WHERE S_Id = ?';
        db.query(query, [id], (err, result) => {
            if (err) {
                res.status(500).json({ status: 'Error', message: err.message });
            } else if (result.affectedRows === 0) {
                res.status(404).json({ status: 'Error', message: 'Sailor not found' });
            } else {
                res.status(200).json({ status: 'Success', message: 'Sailor deleted' });
            }
        });
    });

    return router;
};
