const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const sailorRoutes = require('./lib/sailor');
const boatRoutes = require('./lib/boat');
const reserveRoutes = require('./lib/reserves');

const app = express();
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Add your MySQL root password here
    database: 'SailingAdventure',
    multipleStatements: true,
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL');
    createDatabaseAndTables();
});

// Function to create database and tables
function createDatabaseAndTables() {
    const createDatabase = `CREATE DATABASE IF NOT EXISTS SailingAdventure`;
    const useDatabase = `USE SailingAdventure`;

    const createSailorsTable = `
        CREATE TABLE IF NOT EXISTS Sailors (
            S_Id INT AUTO_INCREMENT PRIMARY KEY,
            S_name VARCHAR(50) NOT NULL,
            B_date DATE NOT NULL,
            Rate INT NOT NULL
        )
    `;

    const createBoatsTable = `
        CREATE TABLE IF NOT EXISTS Boats (
            B_Id INT AUTO_INCREMENT PRIMARY KEY,
            B_name VARCHAR(50) NOT NULL,
            B_type VARCHAR(50) NOT NULL
        )
    `;

    const createReservesTable = `
        CREATE TABLE IF NOT EXISTS Reserves (
            S_Id INT,
            B_Id INT,
            Day DATE,
            PRIMARY KEY (S_Id, B_Id, Day),
            FOREIGN KEY (S_Id) REFERENCES Sailors(S_Id) ON DELETE CASCADE,
            FOREIGN KEY (B_Id) REFERENCES Boats(B_Id) ON DELETE CASCADE
        )
    `;

    db.query(`${createDatabase}; ${useDatabase}; ${createSailorsTable}; ${createBoatsTable}; ${createReservesTable};`, (err) => {
        if (err) throw err;
        console.log('Database and tables created or already exist');
    });
}

// Route handlers
app.use('/sailor', sailorRoutes(db));
app.use('/boat', boatRoutes(db));
app.use('/reserves', reserveRoutes(db));

// Handle invalid routes
app.use((req, res) => {
    res.status(404).json({ message: 'Invalid route or method' });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
