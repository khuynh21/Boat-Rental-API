// lib/reserves.js

exports.addReservation = function (db, query, cb) {
  const sql = `CALL InsertReservation(?, ?, ?, @responseMessage); SELECT @responseMessage AS message;`;
  const { sailorId, boatId, day } = query;

  db.query(sql, [sailorId, boatId, day], (err, results) => {
    if (err) {
      cb(500, "Internal Server Error", "Error adding reservation.");
    } else {
      const message = results[1][0].message; // Retrieve response message from procedure
      cb(200, "OK", message);
    }
  });
};
