--: BloodBag()

--! get : BloodBag
SELECT 
    *,
    (
        SELECT blood_group
        FROM accounts
        WHERE id = (
            SELECT donor_id
            FROM appointments
            WHERE id = (
                SELECT appointment_id
                FROM donations
                WHERE id = blood_bags.donation_id
            )
        )
    ) AS blood_group
FROM blood_bags
WHERE id = :id;

--! get_all_scheduler : BloodBag
SELECT 
    *,
    (
        SELECT blood_group
        FROM accounts
        WHERE id = (
            SELECT donor_id
            FROM appointments
            WHERE id = (
                SELECT appointment_id
                FROM donations
                WHERE id = blood_bags.donation_id
            )
        )
    ) AS blood_group
FROM blood_bags
WHERE is_used = false;

--! count (component?, blood_group?)
SELECT COUNT(id)
FROM blood_bags
WHERE (
    :component::blood_component IS NULL OR component = :component
) AND (
    :blood_group::blood_group IS NULL OR (
        CASE :mode
            WHEN 'Exact' THEN (
                SELECT blood_group
                FROM accounts
                WHERE id = (
                    SELECT donor_id
                    FROM appointments
                    WHERE id = (
                        SELECT appointment_id
                        FROM donations
                        WHERE id = blood_bags.donation_id
                    )
                )
            ) = :blood_group
            WHEN 'Compatible' THEN (
                SELECT blood_group
                FROM accounts
                WHERE id = (
                    SELECT donor_id
                    FROM appointments
                    WHERE id = (
                        SELECT appointment_id
                        FROM donations
                        WHERE id = blood_bags.donation_id
                    )
                )
            ) = ANY (
                CASE :blood_group
                    WHEN 'a_plus'   THEN ARRAY['a_plus','a_minus','o_plus','o_minus']::blood_group[]
                    WHEN 'a_minus'  THEN ARRAY['a_minus','o_minus']::blood_group[]
                    WHEN 'b_plus'   THEN ARRAY['b_plus','b_minus','o_plus','o_minus']::blood_group[]
                    WHEN 'b_minus'  THEN ARRAY['b_minus','o_minus']::blood_group[]
                    WHEN 'ab_plus'  THEN ARRAY['a_plus','a_minus','b_plus','b_minus','ab_plus','ab_minus','o_plus','o_minus']::blood_group[]
                    WHEN 'ab_minus' THEN ARRAY['ab_minus','a_minus','b_minus','o_minus']::blood_group[]
                    WHEN 'o_plus'   THEN ARRAY['o_plus','o_minus']::blood_group[]
                    WHEN 'o_minus'  THEN ARRAY['o_minus']::blood_group[]
                END
            )
        END
    )
) AND is_used = false;

--! get_all (component?, blood_group?) : BloodBag
SELECT 
    *,
    (
        SELECT blood_group
        FROM accounts
        WHERE id = (
            SELECT donor_id
            FROM appointments
            WHERE id = (
                SELECT appointment_id
                FROM donations
                WHERE id = blood_bags.donation_id
            )
        )
    ) AS blood_group
FROM blood_bags
WHERE (
    :component::blood_component IS NULL OR component = :component
) AND (
    :blood_group::blood_group IS NULL OR (
        CASE :mode
            WHEN 'Exact' THEN (
                SELECT blood_group
                FROM accounts
                WHERE id = (
                    SELECT donor_id
                    FROM appointments
                    WHERE id = (
                        SELECT appointment_id
                        FROM donations
                        WHERE id = blood_bags.donation_id
                    )
                )
            ) = :blood_group
            WHEN 'Compatible' THEN (
                SELECT blood_group
                FROM accounts
                WHERE id = (
                    SELECT donor_id
                    FROM appointments
                    WHERE id = (
                        SELECT appointment_id
                        FROM donations
                        WHERE id = blood_bags.donation_id
                    )
                )
            ) = ANY (
                CASE :blood_group
                    WHEN 'a_plus'   THEN ARRAY['a_plus','a_minus','o_plus','o_minus']::blood_group[]
                    WHEN 'a_minus'  THEN ARRAY['a_minus','o_minus']::blood_group[]
                    WHEN 'b_plus'   THEN ARRAY['b_plus','b_minus','o_plus','o_minus']::blood_group[]
                    WHEN 'b_minus'  THEN ARRAY['b_minus','o_minus']::blood_group[]
                    WHEN 'ab_plus'  THEN ARRAY['a_plus','a_minus','b_plus','b_minus','ab_plus','ab_minus','o_plus','o_minus']::blood_group[]
                    WHEN 'ab_minus' THEN ARRAY['ab_minus','a_minus','b_minus','o_minus']::blood_group[]
                    WHEN 'o_plus'   THEN ARRAY['o_plus','o_minus']::blood_group[]
                    WHEN 'o_minus'  THEN ARRAY['o_minus']::blood_group[]
                END
            )
        END
    )
) AND is_used = false
ORDER BY expired_time ASC
LIMIT :page_size::int
OFFSET :page_size::int * :page_index::int;

--! create
INSERT INTO blood_bags (
    donation_id,
    component,
    amount,
    expired_time
)
VALUES (
    :donation_id,
    :component,
    :amount,
    :expired_time
)
RETURNING id;

--! delete
UPDATE blood_bags
SET is_used = true
WHERE id = :id;

--! update (component?, amount?, expired_time?)
UPDATE blood_bags
SET
    component = COALESCE(:component, component),
    amount = COALESCE(:amount, amount),
    expired_time = COALESCE(:expired_time, expired_time)
WHERE id = :id;

--! get_stats : BloodStorageStats()
SELECT
    (SELECT COUNT(id) FROM blood_bags) AS total_bags,
    (SELECT COUNT(id) FROM blood_bags WHERE is_used = false) AS available_bags,
    (SELECT COUNT(id) FROM blood_bags
        WHERE is_used = false 
        AND expired_time > NOW()
        AND expired_time <= NOW() + INTERVAL '7 day') AS expiring_bags,
    (SELECT COUNT(id) FROM blood_bags 
        WHERE is_used = false 
        AND expired_time <= NOW()) AS expired_bags;
