--: BloodRequest()

--! create
INSERT INTO blood_requests(
    staff_id,
    priority,
    title,
    max_people,
    start_time,
    end_time
)
VALUES (
    :staff_id,
    :priority,
    :title,
    :max_people,
    :start_time,
    :end_time
)
RETURNING id;

--! add_blood_group
INSERT INTO request_blood_groups(
    request_id,
    blood_group
)
VALUES (
    :request_id,
    :blood_group
);

--! get : BloodRequest
SELECT 
    *,
    (
        SELECT ARRAY(
            SELECT blood_group
            FROM request_blood_groups
            WHERE request_id = blood_requests.id
        )
    ) AS blood_groups,
    (
        SELECT COUNT(id)
        FROM appointments
        WHERE request_id = blood_requests.id
    ) as current_people,
    (staff_id = :account_id) as is_editable
FROM blood_requests
WHERE id = :id;

--! get_all : BloodRequest
SELECT 
    *,
    (
        SELECT ARRAY(
            SELECT blood_group
            FROM request_blood_groups
            WHERE request_id = blood_requests.id
        )
    ) AS blood_groups,
    (
        SELECT COUNT(id)
        FROM appointments
        WHERE request_id = blood_requests.id
    ) as current_people,
    (staff_id = :account_id) as is_editable
FROM blood_requests
WHERE now() < end_time AND is_active = true;

--! update (priority?, title?, max_people?)
UPDATE blood_requests
SET
    priority = COALESCE(:priority, priority),
    title = COALESCE(:title, title),
    max_people = COALESCE(:max_people, max_people)
WHERE id = :id AND staff_id = :staff_id;

--! delete
UPDATE blood_requests
SET is_active = false
WHERE id = :id AND staff_id = :staff_id;
