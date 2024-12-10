const http = require("http");
const mysql = require("mysql2");
const sailor = require("./lib/sailor");
const boat = require("./lib/boat");
const reserves = require("./lib/reserves");

// Set up the MySQL database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "2002Kevin",
  multipleStatements: true, // Allow multiple SQL statements
});

// SQL script to create database and tables
const setupSQL = `
CREATE DATABASE IF NOT EXISTS sailingadventure;
USE sailingadventure;

CREATE TABLE IF NOT EXISTS Sailors (
  S_Id INT AUTO_INCREMENT PRIMARY KEY,
  S_name VARCHAR(50),
  B_date DATE,
  Rate INT
);

CREATE TABLE IF NOT EXISTS Boats (
  B_Id INT AUTO_INCREMENT PRIMARY KEY,
  B_name VARCHAR(50),
  B_type VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS Reserves (
  S_Id INT,
  B_Id INT,
  Day DATE,
  PRIMARY KEY (S_Id, B_Id, Day),
  FOREIGN KEY (S_Id) REFERENCES Sailors(S_Id),
  FOREIGN KEY (B_Id) REFERENCES Boats(B_Id)
);
`;

// Execute the SQL script to set up the database and tables
db.query(setupSQL, (err) => {
  if (err) {
    console.error("Error setting up the database and tables:", err.message);
    process.exit(1); // Stop the server if database setup fails
  } else {
    console.log("Database and tables setup completed.");
  }
});

// Request handler
const requestHandler = (req, res) => {
  const baseURL = `http://${req.headers.host}/`;
  const parsedURL = new URL(req.url, baseURL);
  const pathname = parsedURL.pathname;
  const method = req.method;

  const urlQuery = parsedURL.searchParams;
  const entries = urlQuery.entries();
  const query = Object.fromEntries(entries);

  switch (method) {
    case "POST":
      if (pathname === "/sailor/add") {
        sailor.addSailor(db, query, (statusCode, resStr, resMsg) => {
          res.writeHead(statusCode, { "Content-Type": "text/plain" });
          res.end(resMsg);
        });
      } else if (pathname === "/boat/add") {
        boat.addBoat(db, query, (statusCode, resStr, resMsg) => {
          res.writeHead(statusCode, { "Content-Type": "text/plain" });
          res.end(resMsg);
        });
      } else if (pathname === "/reserves/add") {
        reserves.addReservation(db, query, (statusCode, resStr, resMsg) => {
          res.writeHead(statusCode, { "Content-Type": "text/plain" });
          res.end(resMsg);
        });
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Invalid endpoint.");
      }
      break;

    default:
      res.writeHead(405, { "Content-Type": "text/plain" });
      res.end("Method not allowed.");
  }
};

// Start the server
const port = 3030;
const server = http.createServer(requestHandler);
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


