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
WHERE email = :email;

--! get_by_role : Account
SELECT * 
FROM accounts
WHERE role = :role;

--! get_all : Account
SELECT *
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
