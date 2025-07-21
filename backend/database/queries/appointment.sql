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

--! count (query?, status?)
SELECT COUNT(id)
FROM appointments
WHERE (
    :query::text IS NULL OR
    EXISTS (
        SELECT 1
        FROM accounts
        WHERE
            (name % :query OR email % :query) AND
            accounts.id = appointments.donor_id
        LIMIT 1
    )
) AND (
    :status::appointment_status IS NULL OR status = :status
) AND status NOT IN ('done'::appointment_status, 'rejected'::appointment_status);

--! get_all (query?, status?) : Appointment
SELECT *
FROM appointments
WHERE (
    :query::text IS NULL OR
    EXISTS (
        SELECT 1
        FROM accounts
        WHERE
            (name % :query OR email % :query) AND
            accounts.id = appointments.donor_id
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
WITH updated_appointment AS (
    UPDATE appointments
    SET
        status = 'rejected'::appointment_status,
        reason = :reason
    WHERE id = :id
    RETURNING donor_id
)
UPDATE accounts
SET is_banned = :is_banned
WHERE id = (SELECT donor_id FROM updated_appointment);

--! get_stats : AppointmentsStats()
SELECT
    (SELECT COUNT(id) FROM appointments WHERE status = 'on_process'::appointment_status) AS on_process_appointments,
    (SELECT COUNT(id) FROM appointments WHERE status = 'approved'::appointment_status) AS approved_appointments,
    (SELECT COUNT(id) FROM appointments WHERE status = 'done'::appointment_status) AS done_appointments,
    (SELECT COUNT(id) FROM appointments WHERE status = 'rejected'::appointment_status) AS rejected_appointments;
