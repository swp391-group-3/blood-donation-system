--: Account(gender?, address?, birthday?, blood_group?)

--! register (password?)
INSERT INTO accounts(
    email,
    password,
    role,
    phone,
    name,
    gender,
    address,
    birthday,
    blood_group
)
VALUES(
    :email,
    COALESCE(:password, substr(md5(random()::text), 1, 25)),
    'member'::role,
    :phone,
    :name,
    :gender,
    :address,
    :birthday,
    :blood_group
)
RETURNING id;

--! create_staff
INSERT INTO accounts(
    email,
    password,
    role,
    phone,
    name,
    is_active
)
VALUES (
    :email,
    :password,
    'staff'::role,
    :phone,
    :name,
    true
)
RETURNING id;

--! get : Account
SELECT * 
FROM accounts
WHERE id = :id;

--! get_by_email : Account
SELECT * 
FROM accounts
WHERE email = :email
    AND is_active = true;

--! get_by_role : Account
SELECT * 
FROM accounts
WHERE role = :role
    AND is_active = true;

--! get_all : Account
SELECT *
FROM accounts
WHERE is_active = true;

--! update (phone?, name?, gender?, address?, birthday?)
UPDATE accounts
SET phone = COALESCE(:phone, phone),
    name = COALESCE(:name, name),
    gender = COALESCE(:gender, gender),
    address = COALESCE(:address, address),
    birthday = COALESCE(:birthday, birthday)
WHERE id = :id;

--! delete
UPDATE accounts SET is_active = false WHERE id = :id;

--! next_donatable_date
SELECT COALESCE((
    SELECT 
        CASE 
            WHEN (
                donations.created_at + 
                CASE 
                    WHEN donations.type = 'whole_blood' THEN INTERVAL '56 days'
                    WHEN donations.type = 'power_red' THEN INTERVAL '112 days'
                    WHEN donations.type = 'platelet' THEN INTERVAL '7 days'
                    WHEN donations.type = 'plasma' THEN INTERVAL '28 days'
                END
            ) <= now()
            THEN now()
            ELSE (
                donations.created_at + 
                CASE 
                    WHEN donations.type = 'whole_blood' THEN INTERVAL '56 days'
                    WHEN donations.type = 'power_red' THEN INTERVAL '112 days'
                    WHEN donations.type = 'platelet' THEN INTERVAL '7 days'
                    WHEN donations.type = 'plasma' THEN INTERVAL '28 days'
                END
            )
        END
    FROM donations
    WHERE (
        SELECT member_id
        FROM appointments
        WHERE id = donations.appointment_id
    ) = :id
    ORDER BY donations.created_at DESC
    LIMIT 1
), now()) AS next_donatable_date;

--! is_applied
SELECT EXISTS (
    SELECT 1
    FROM appointments
    WHERE member_id = :id
        AND status != 'rejected'::appointment_status
        AND status != 'done'::appointment_status
) AS is_applied;