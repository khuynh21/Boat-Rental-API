// lib/sailor.js

exports.addSailor = function (db, query, cb) {
  const sql = `CALL InsertSailor(?, ?, ?, @responseMessage); SELECT @responseMessage AS message;`;
  const { name, birthDate, rate } = query;

  db.query(sql, [name, birthDate, rate], (err, results) => {
    if (err) {
      cb(500, "Internal Server Error", "Error adding sailor.");
    } else {
      const message = results[1][0].message; // Retrieve response message from procedure
      cb(200, "OK", message);
    }
  });
};

