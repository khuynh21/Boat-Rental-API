const http = require("http");
const mysql = require("mysql2");
const sailor = require("./lib/sailor");
const reserves = require("./lib/reserves");

// Set up the MySQL database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "2002Kevin",
  database: "SailingAdventure",
  multipleStatements: true,
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

// Start the server dynamically without specifying an IP address
const port = 3030;
const server = http.createServer(requestHandler);
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

