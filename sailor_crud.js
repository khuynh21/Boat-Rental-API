// lib/sailor_crud.js

exports.addSailor = function (db, query, cb) {
  const sql = `CALL InsertSailor(?, ?, ?, @responseMessage); SELECT @responseMessage AS message;`; //Here
  const { S_name, B_date, Rate  } = query;

  db.query(sql, [S_name, B_date, Rate ], (err, results) => {
    if (err) {
      cb(500, "Internal Server Error", "Error adding sailor.");
    } else {
      const message = results[1][0].message;
      cb(200, "OK", message);
    }
  });
};

exports.listSailors = function (db, query, cb) {
  const sql = `SELECT * FROM Sailors`;
  db.query(sql, (err, results) => {
    if (err) {
      cb(500, "Internal Server Error", "Error fetching sailors.");
    } else {
      const rows = results
        .map(
          (sailor) =>
            `ID: ${sailor.S_Id}, Name: ${sailor.S_name}, Birth Date: ${sailor.B_date}, Rate: ${sailor.Rate}`
        )
        .join("\n");
      cb(200, "OK", rows || "No sailors found.");
    }
  });
};

exports.deleteSailor = function (db, query, cb) {
  const sql = `DELETE FROM Sailors WHERE S_Id = ?`;
  const { id } = query;

  db.query(sql, [id], (err) => {
    if (err) {
      cb(500, "Internal Server Error", "Error deleting sailor.");
    } else {
      cb(200, "OK", "Sailor deleted successfully.");
    }
  });
};

exports.updateSailor = function (db, query, cb) {
  const sql = `UPDATE Sailors SET S_name = ?, Rate = ? WHERE S_Id = ?`;
  const { id, name, rate } = query;

  db.query(sql, [name, rate, id], (err) => {
    if (err) {
      cb(500, "Internal Server Error", "Error updating sailor.");
    } else {
      cb(200, "OK", "Sailor updated successfully.");
    }
  });
};
