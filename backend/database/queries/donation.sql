--! create
INSERT INTO donations(appointment_id, type, amount)
VALUES (
    :appointment_id,
    :type,
    :amount
)
RETURNING id;

--! get
SELECT id, appointment_id, type, amount, created_at
FROM donations
WHERE id = :id;

--! get_by_appointment_id
SELECT id, appointment_id, type, amount, created_at
FROM donations
WHERE appointment_id = :appointment_id;

--! get_all
SELECT id, appointment_id, type, amount, created_at
FROM donations;

--! get_by_member_id
SELECT id, appointment_id, type, amount, created_at
FROM donations
WHERE appointment_id IN (SELECT id FROM appointments WHERE member_id = :member_id);

--! update (type?, amount?)
UPDATE donations
SET
    type = COALESCE(:type, type),
    amount = COALESCE(:amount, amount)
WHERE id = :id;
