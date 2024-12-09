const http = require("http");
const mysql = require("mysql2");
const sailor = require("./lib/sailor");
const boat = require("./lib/boat");
const reserves = require("./lib/reserves");

// Set up the MySQL database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "2002Kevin", // Replace with your MySQL password
  database: "SailingAdventure",
  multipleStatements: true,
});

// Initialize database and tables
const sql = `
CREATE DATABASE IF NOT EXISTS SailingAdventure;
USE SailingAdventure;

CREATE TABLE IF NOT EXISTS Sailors (
    S_Id INT AUTO_INCREMENT PRIMARY KEY,
    S_name VARCHAR(50) NOT NULL,
    B_date DATE NOT NULL,
    Rate INT NOT NULL
);

CREATE TABLE IF NOT EXISTS Boats (
    B_Id INT AUTO_INCREMENT PRIMARY KEY,
    B_name VARCHAR(50) NOT NULL,
    B_type VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS Reserves (
    S_Id INT NOT NULL,
    B_Id INT NOT NULL,
    Day DATE NOT NULL,
    PRIMARY KEY (S_Id, B_Id, Day),
    FOREIGN KEY (S_Id) REFERENCES Sailors(S_Id) ON DELETE CASCADE,
    FOREIGN KEY (B_Id) REFERENCES Boats(B_Id) ON DELETE CASCADE
);
`;

db.query(sql, (err) => {
  if (err) {
    console.error("Error initializing database:", err.message);
  } else {
    console.log("Database and tables initialized successfully.");
  }
});

// Define the HTTP request handler
const requestHandler = (req, res) => {
  //host URL format 
  const host = `http://GMU.edu/`;
  const parsedURL = new URL(req.url, host);
  const pathname = parsedURL.pathname;
  const method = req.method;

  const query = Object.fromEntries(parsedURL.searchParams.entries());

  // Route requests based on method and pathname
  switch (method) {
    case "GET":
      if (pathname === "/sailor" || pathname === "/sailor/") {
        sailor.listSailors(db, query, (statusCode, statusMessage, responseData) => {
          res.writeHead(statusCode, { "Content-Type": "text/plain" });
          res.end(responseData);
        });
      } else if (pathname === "/boat" || pathname === "/boat/") {
        boat.listBoats(db, query, (statusCode, statusMessage, responseData) => {
          res.writeHead(statusCode, { "Content-Type": "text/plain" });
          res.end(responseData);
        });
      } else if (pathname === "/reserves" || pathname === "/reserves/") {
        reserves.listReservations(db, query, (statusCode, statusMessage, responseData) => {
          res.writeHead(statusCode, { "Content-Type": "text/plain" });
          res.end(responseData);
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

//listens on port 3030, handles any potential port issues
const PORT = 3030;
server.listen(PORT, "127.0.0.1", () => {
  console.log(`Server is running on port ${PORT}`);
});
