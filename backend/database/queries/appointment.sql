--: Appointment(reason?)

--! create
INSERT INTO appointments(request_id, member_id)
VALUES (:request_id, :member_id)
RETURNING id;

--! get : Appointment
SELECT *
FROM appointments
WHERE id = :id;

--! get_by_member_id : Appointment
SELECT *
FROM appointments
WHERE member_id = :member_id;

--! get_all : Appointment
SELECT *
FROM appointments;

--! update_status
UPDATE appointments
SET status = :status
WHERE id = :id;

--! update_reason
UPDATE appointments
SET reason = :reason
WHERE id = :id;