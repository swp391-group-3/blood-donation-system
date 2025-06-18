--! create
INSERT INTO appointments(request_id, member_id)
VALUES (:request_id, :member_id)
RETURNING id;

--! get
SELECT *
FROM appointments
WHERE id = :id;

--! get_by_member_id
SELECT 
    *,
    (SELECT start_time FROM blood_requests WHERE id = appointments.request_id) AS start_time,
    (SELECT end_time FROM blood_requests WHERE id = appointments.request_id) AS end_time,
    (
        SELECT ARRAY(
            SELECT blood_group
            FROM request_blood_groups
            WHERE request_id = appointments.request_id
        )
    ) AS blood_groups
FROM appointments
WHERE member_id = :member_id;

--! update_status
UPDATE appointments
SET status = :status
WHERE id = :id;
