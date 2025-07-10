--: Appointment(reason?)

--! create
INSERT INTO appointments(request_id, donor_id)
VALUES (:request_id, :donor_id)
RETURNING id;

--! get : Appointment
SELECT *
FROM appointments
WHERE id = :id;

--! get_by_donor_id : Appointment
SELECT *
FROM appointments
WHERE donor_id = :donor_id;

--! get_all : Appointment
SELECT *
FROM appointments;

--! update_status
UPDATE appointments
SET status = :status
WHERE id = :id;

--! reject
UPDATE appointments
SET
    status = 'rejected'::appointment_status,
    reason = :reason
WHERE id = :id;