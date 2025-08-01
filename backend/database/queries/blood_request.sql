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
    id, priority, title, max_people, start_time, end_time, is_active, created_at,
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

--! count (query?, priority?, blood_group?)
SELECT COUNT(*) 
FROM blood_requests
WHERE (
    :account_id = '00000000-0000-0000-0000-000000000000'::uuid
    OR (
        SELECT role
        FROM accounts
        WHERE id = :account_id
    ) != 'donor'::role
    OR EXISTS (
        SELECT 1
        FROM request_blood_groups
        WHERE request_id = blood_requests.id
        AND blood_group = ANY (
            CASE (
                SELECT blood_group
                FROM accounts
                WHERE id = :account_id
            )
                WHEN 'o_minus'  THEN ARRAY['a_plus','a_minus','b_plus','b_minus','ab_plus','ab_minus','o_plus','o_minus']::blood_group[]
                WHEN 'o_plus'   THEN ARRAY['a_plus','b_plus','ab_plus','o_plus']::blood_group[]
                WHEN 'a_minus'  THEN ARRAY['a_plus','a_minus','ab_plus','ab_minus']::blood_group[]
                WHEN 'a_plus'   THEN ARRAY['a_plus','ab_plus']::blood_group[]
                WHEN 'b_minus'  THEN ARRAY['b_plus','b_minus','ab_plus','ab_minus']::blood_group[]
                WHEN 'b_plus'   THEN ARRAY['b_plus','ab_plus']::blood_group[]
                WHEN 'ab_minus' THEN ARRAY['ab_plus','ab_minus']::blood_group[]
                WHEN 'ab_plus'  THEN ARRAY['ab_plus']::blood_group[]
            END
        )
    )
) AND (
    :query::text IS NULL OR
    (title LIKE '%' || :query || '%' )
) AND (
    :priority::request_priority IS NULL OR priority = :priority
) AND (
    :blood_group::blood_group IS NULL
    OR EXISTS (
        SELECT 1
        FROM request_blood_groups
        WHERE request_id = blood_requests.id
        AND blood_group = :blood_group
    )
) AND now() < end_time AND is_active = true;

--! get_all (query?, priority?, blood_group?) : BloodRequest
SELECT 
    id, priority, title, max_people, start_time, end_time, is_active, created_at,
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
WHERE (
    :account_id = '00000000-0000-0000-0000-000000000000'
    OR (
        SELECT role
        FROM accounts
        WHERE id = :account_id
    ) != 'donor'::role
    OR EXISTS (
        SELECT 1
        FROM request_blood_groups
        WHERE request_id = blood_requests.id
        AND blood_group = ANY (
            CASE (
                SELECT blood_group
                FROM accounts
                WHERE id = :account_id
            )
                WHEN 'o_minus'  THEN ARRAY['a_plus','a_minus','b_plus','b_minus','ab_plus','ab_minus','o_plus','o_minus']::blood_group[]
                WHEN 'o_plus'   THEN ARRAY['a_plus','b_plus','ab_plus','o_plus']::blood_group[]
                WHEN 'a_minus'  THEN ARRAY['a_plus','a_minus','ab_plus','ab_minus']::blood_group[]
                WHEN 'a_plus'   THEN ARRAY['a_plus','ab_plus']::blood_group[]
                WHEN 'b_minus'  THEN ARRAY['b_plus','b_minus','ab_plus','ab_minus']::blood_group[]
                WHEN 'b_plus'   THEN ARRAY['b_plus','ab_plus']::blood_group[]
                WHEN 'ab_minus' THEN ARRAY['ab_plus','ab_minus']::blood_group[]
                WHEN 'ab_plus'  THEN ARRAY['ab_plus']::blood_group[]
            END
        )
    )
) AND (
    :query::text IS NULL OR
    (title LIKE '%' || :query || '%' )
) AND (
    :priority::request_priority IS NULL OR priority = :priority
) AND (
    :blood_group::blood_group IS NULL
    OR EXISTS (
        SELECT 1
        FROM request_blood_groups
        WHERE request_id = blood_requests.id
        AND blood_group = :blood_group
    )
) AND now() < end_time AND is_active = true
LIMIT :page_size::int
OFFSET :page_size::int * :page_index::int;

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

--! get_stats : BloodRequestsStats()
SELECT
    (
        SELECT COUNT(id) FROM blood_requests 
        WHERE is_active = true
        AND now() < end_time
    ) AS total_requests,
    (
        SELECT COUNT(id) FROM blood_requests
        WHERE is_active = true
        AND now() < end_time
        AND priority = 'high'::request_priority
    ) AS urgent_requests,
    (
        SELECT CAST(
            COALESCE(SUM(max_people - (
                SELECT COUNT(id) 
                FROM appointments 
                WHERE request_id = blood_requests.id
            )), 0)
            AS BIGINT
        )
        FROM blood_requests 
        WHERE is_active = true
        AND now() < end_time
    ) AS donors_needed,
    (
        SELECT COUNT(id) FROM blood_requests
        WHERE is_active = true 
        AND now() < end_time
        AND :account_id != '00000000-0000-0000-0000-000000000000'::uuid
        AND EXISTS (
            SELECT 1
            FROM request_blood_groups
            WHERE request_id = blood_requests.id
            AND blood_group = ANY (
                CASE (
                    SELECT blood_group
                    FROM accounts
                    WHERE id = :account_id
                )
                    WHEN 'o_minus'  THEN ARRAY['o_minus','o_plus','a_minus','a_plus','b_minus','b_plus','ab_minus','ab_plus']::blood_group[]
                    WHEN 'o_plus'   THEN ARRAY['o_plus','a_plus','b_plus','ab_plus']::blood_group[]
                    WHEN 'a_minus'  THEN ARRAY['a_minus','a_plus','ab_minus','ab_plus']::blood_group[]
                    WHEN 'a_plus'   THEN ARRAY['a_plus','ab_plus']::blood_group[]
                    WHEN 'b_minus'  THEN ARRAY['b_minus','b_plus','ab_minus','ab_plus']::blood_group[]
                    WHEN 'b_plus'   THEN ARRAY['b_plus','ab_plus']::blood_group[]
                    WHEN 'ab_minus' THEN ARRAY['ab_minus','ab_plus']::blood_group[]
                    WHEN 'ab_plus'  THEN ARRAY['ab_plus']::blood_group[]
                END
            )
        )
    ) AS recommended_requests;
