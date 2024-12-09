// lib/reserves.js

exports.listReservations = function (db, query, cb) {
  const sql = `
    SELECT R.S_Id, S.S_name, R.B_Id, B.B_name, R.Day
    FROM Reserves R
    JOIN Sailors S ON R.S_Id = S.S_Id
    JOIN Boats B ON R.B_Id = B.B_Id
  `;
  db.query(sql, (err, results) => {
    if (err) {
      cb(500, "Internal Server Error", "Error fetching reservations.");
    } else {
      const rows = results.map(
        (reserve) =>
          `Sailor: ${reserve.S_name}, Boat: ${reserve.B_name}, Date: ${reserve.Day}`
      ).join("\n");
      cb(200, "OK", rows || "No reservations found.");
    }
  });
};

exports.addReservation = function (db, query, cb) {
  const sql = `INSERT INTO Reserves (S_Id, B_Id, Day) VALUES (?, ?, ?)`;
  const { sailorId, boatId, day } = query;
  db.query(sql, [sailorId, boatId, day], (err) => {
    if (err) {
      cb(500, "Internal Server Error", "Error adding reservation.");
    } else {
      cb(200, "OK", "Reservation added successfully.");
    }
  });
};

exports.deleteReservation = function (db, query, cb) {
  const sql = `DELETE FROM Reserves WHERE S_Id = ? AND B_Id = ? AND Day = ?`;
  const { sailorId, boatId, day } = query;
  db.query(sql, [sailorId, boatId, day], (err) => {
    if (err) {
      cb(500, "Internal Server Error", "Error deleting reservation.");
    } else {
      cb(200, "OK", "Reservation deleted successfully.");
    }
  });
};
