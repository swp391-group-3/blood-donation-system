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

--! get_by_email
SELECT id, password FROM accounts WHERE email = :email;

--! get : (gender?, address?, birthday?, blood_group?)
SELECT role, email, phone, name, gender, address, birthday, blood_group, is_active, created_at
FROM accounts
WHERE id = :id;

--! get_all : (gender?, address?, birthday?, blood_group?)
SELECT role, email, phone, name, gender, address, birthday, blood_group, is_active, created_at
FROM accounts;

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

--! get_by_role : (gender?, address?, birthday?, blood_group?)
SELECT role, email, phone, name, gender, address, birthday, blood_group, is_active, created_at
FROM accounts
WHERE role = :role;