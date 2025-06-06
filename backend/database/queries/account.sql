--! register (password)
INSERT INTO accounts(email, password, role)
VALUES(
    :email,
    :password,
    'member'::role
)
RETURNING id;

--! oauth2_register
INSERT INTO accounts(email, password, role)
VALUES(
    :email,
    substr(md5(random()::text), 1, 25),
    'member'::role
)
ON CONFLICT DO NOTHING;

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

--! get_auth_status
SELECT is_active, role FROM accounts WHERE id = :id;

--! get_id_and_password
SELECT id, password FROM accounts WHERE email = :email;

--! get : (gender?, address?, birthday?, blood_group?)
SELECT role, email, phone, name, gender, address, birthday, blood_group, created_at
FROM accounts
WHERE id = :id;

--! get_all : (gender?, address?, birthday?, blood_group?)
SELECT role, email, phone, name, gender, address, birthday, blood_group, created_at
FROM accounts;

--! activate
--- Naive way to implement 2 stage registering
UPDATE accounts
SET phone = :phone,
    name = :name,
    gender = :gender,
    address = :address,
    birthday = :birthday,
    blood_group = :blood_group,
    is_active = true
WHERE id = :id AND is_active = false;

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
