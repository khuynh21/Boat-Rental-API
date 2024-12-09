DELIMITER //

CREATE PROCEDURE InsertReservation(
    IN sailorId INT,
    IN boatId INT,
    IN reservationDate DATE,
    OUT responseMessage VARCHAR(255)
)
BEGIN
    DECLARE sailorRate INT;
    DECLARE boatType VARCHAR(50);

    -- Fetch sailor's rate and boat type
    SELECT Rate INTO sailorRate FROM Sailors WHERE S_Id = sailorId;
    SELECT B_type INTO boatType FROM Boats WHERE B_Id = boatId;

    -- Check business logic for the reservation
    IF (boatType = 'Fishing vessel' AND sailorRate > 7) THEN
        INSERT INTO Reserves (S_Id, B_Id, Day)
        VALUES (sailorId, boatId, reservationDate);
        SET responseMessage = 'Reservation added successfully for a Fishing vessel.';
    ELSEIF (boatType = 'Sailboat' AND sailorRate > 5) THEN
        INSERT INTO Reserves (S_Id, B_Id, Day)
        VALUES (sailorId, boatId, reservationDate);
        SET responseMessage = 'Reservation added successfully for a Sailboat.';
    ELSEIF (boatType = 'Bass boat' AND sailorRate <= 2) THEN
        INSERT INTO Reserves (S_Id, B_Id, Day)
        VALUES (sailorId, boatId, reservationDate);
        SET responseMessage = 'Reservation added successfully for a Bass boat.';
    ELSE
        SET responseMessage = CONCAT(
            'Reservation failed. Sailor rate (', sailorRate, 
            ') does not meet the requirement for a ', boatType, '.'
        );
    END IF;
END//

DELIMITER ;
