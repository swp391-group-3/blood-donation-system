--: BloodBag()

--! get : BloodBag
SELECT 
    id,
    donation_id,
    (
        SELECT blood_group
        FROM accounts
        WHERE id = (
            SELECT member_id
            FROM appointments
            WHERE id = (
                SELECT appointment_id
                FROM donations
                WHERE id = blood_bags.donation_id
            )
        )
    ) AS blood_group,
    component,
	is_used,
	amount,
	expired_time
FROM blood_bags
WHERE id = :id;

--! get_all : BloodBag
SELECT 
    id,
    donation_id,
    (
        SELECT blood_group
        FROM accounts
        WHERE id = (
            SELECT member_id
            FROM appointments
            WHERE id = (
                SELECT appointment_id
                FROM donations
                WHERE id = blood_bags.donation_id
            )
        )
    ) AS blood_group,
    component,
	is_used,
	amount,
	expired_time
FROM blood_bags;

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
