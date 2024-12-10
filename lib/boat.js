// lib/boat.js

exports.addBoat = function (db, query, cb) {
  const sql = `INSERT INTO Boats (B_name, B_type) VALUES (?, ?)`;
  const { name, type } = query;

  db.query(sql, [name, type], (err) => {
    if (err) {
      cb(500, "Internal Server Error", "Error adding boat.");
    } else {
      cb(200, "OK", "Boat added successfully.");
    }
  });
};
