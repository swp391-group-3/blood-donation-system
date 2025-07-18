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

--! get_all (query?, status?) : Appointment
SELECT *
FROM appointments
WHERE (
    :query::text IS NULL OR
    EXISTS (
        SELECT 1
        FROM accounts
        WHERE (name % :query OR email % :query)
        LIMIT 1
    )
) AND (
    :status::appointment_status IS NULL OR status = :status
) AND status NOT IN ('done'::appointment_status, 'rejected'::appointment_status)
LIMIT :page_size::int
OFFSET :page_size::int * :page_index::int;

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
