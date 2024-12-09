// lib/boat_crud.js

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

exports.listBoats = function (db, query, cb) {
  const sql = `SELECT * FROM Boats`;
  db.query(sql, (err, results) => {
    if (err) {
      cb(500, "Internal Server Error", "Error fetching boats.");
    } else {
      const rows = results
        .map(
          (boat) =>
            `ID: ${boat.B_Id}, Name: ${boat.B_name}, Type: ${boat.B_type}`
        )
        .join("\n");
      cb(200, "OK", rows || "No boats found.");
    }
  });
};

exports.deleteBoat = function (db, query, cb) {
  const sql = `DELETE FROM Boats WHERE B_Id = ?`;
  const { id } = query;

  db.query(sql, [id], (err) => {
    if (err) {
      cb(500, "Internal Server Error", "Error deleting boat.");
    } else {
      cb(200, "OK", "Boat deleted successfully.");
    }
  });
};

exports.updateBoat = function (db, query, cb) {
  const sql = `UPDATE Boats SET B_name = ?, B_type = ? WHERE B_Id = ?`;
  const { id, name, type } = query;

  db.query(sql, [name, type, id], (err) => {
    if (err) {
      cb(500, "Internal Server Error", "Error updating boat.");
    } else {
      cb(200, "OK", "Boat updated successfully.");
    }
  });
};
