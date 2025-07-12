--: Donation()

--! create
INSERT INTO donations(appointment_id, type, amount)
VALUES (
    :appointment_id,
    :type,
    :amount
)
RETURNING id;

--! get : Donation
SELECT *
FROM donations
WHERE id = :id;

--! get_by_appointment_id : Donation
SELECT *
FROM donations
WHERE appointment_id = :appointment_id;

--! get_all : Donation
SELECT id, appointment_id, type, amount, created_at
FROM donations;

--! get_by_donor_id : Donation
SELECT id, appointment_id, type, amount, created_at
FROM donations
WHERE appointment_id IN (SELECT id FROM appointments WHERE donor_id = :donor_id);

--! update (type?, amount?)
UPDATE donations
SET
    type = COALESCE(:type, type),
    amount = COALESCE(:amount, amount)
WHERE id = :id;
