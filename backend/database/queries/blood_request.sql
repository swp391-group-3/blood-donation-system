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

--! get_blood_group
SELECT blood_group
FROM request_blood_groups
WHERE request_id = :id;

--! get : BloodRequest
SELECT *
FROM blood_requests
WHERE id = :id AND now() < end_time AND is_active = true;

--! get_all : BloodRequest
SELECT *
FROM blood_requests
WHERE now() < end_time AND is_active = true;

--! update (priority?, title?, max_people?)
UPDATE blood_requests
SET
    priority = COALESCE(:priority, priority),
    title = COALESCE(:title, title),
    max_people = COALESCE(:max_people, max_people)
WHERE id = :id;

--! delete
UPDATE blood_requests SET is_active = false WHERE id = :id;
