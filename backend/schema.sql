CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE blood_group AS ENUM (
    'o_plus',
    'o_minus',
    'a_plus',
    'a_minus',
    'b_plus',
    'b_minus',
    'ab_plus',
    'ab_minus'
);

CREATE TYPE role AS ENUM (
    'member',
    'staff',
    'admin'
);

CREATE TYPE gender AS ENUM (
    'male',
    'female'
);

CREATE TABLE IF NOT EXISTS accounts(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    role role NOT NULL,
    email varchar(128) UNIQUE NOT NULL,
    password varchar(72) NOT NULL,
    phone varchar(16) UNIQUE,
    name varchar(64),
    gender gender,
    address text,
    birthday date,
    blood_group blood_group,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blogs(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id uuid NOT NULL REFERENCES accounts(id),
    title text NOT NULL,
    description text NOT NULL,
    content text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comments(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    blog_id uuid NOT NULL REFERENCES blogs(id),
    account_id uuid NOT NULL REFERENCES accounts(id),
    content text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tags(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(32) NOT NULL
);

CREATE TABLE IF NOT EXISTS blog_tags(
    blog_id uuid NOT NULL REFERENCES blogs(id),
    tag_id uuid NOT NULL REFERENCES tags(id),

    PRIMARY KEY (blog_id, tag_id)
);

CREATE TYPE request_priority AS ENUM (
    'low',
    'medium',
    'high'
);

CREATE TABLE IF NOT EXISTS blood_requests(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id uuid NOT NULL REFERENCES accounts(id),
    priority request_priority NOT NULL,
    title text NOT NULL,
    max_people int NOT NULL,
    start_time timestamptz NOT NULL,
    end_time timestamptz NOT NULL,
    is_active bool NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS request_blood_groups(
    request_id uuid NOT NULL,
    blood_group blood_group NOT NULL,
    PRIMARY KEY (request_id, blood_group)
);

CREATE TYPE appointment_status AS ENUM(
    'on_process',
    'approved',
    'checked_in',
    'done',
    'rejected'
);

CREATE TABLE IF NOT EXISTS appointments(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id uuid NOT NULL REFERENCES blood_requests(id),
    member_id uuid NOT NULL REFERENCES accounts(id),
    status appointment_status NOT NULL DEFAULT 'on_process'::appointment_status,

    UNIQUE (request_id, member_id)
);

CREATE TABLE IF NOT EXISTS questions(
    id serial PRIMARY KEY,
    content text NOT NULL,
    is_active bool NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS answers(
    question_id int NOT NULL REFERENCES questions(id),
    appointment_id uuid NOT NULL REFERENCES appointments(id),
    content text NOT NULL
);

CREATE TABLE IF NOT EXISTS healths(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id uuid NOT NULL REFERENCES appointments(id),
    temperature real NOT NULL,
    weight real NOT NULL,
    upper_blood_pressure int NOT NULL,
    lower_blood_pressure int NOT NULL,
    heart_rate int NOT NULL,
    is_good_health bool NOT NULL,
    note text,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TYPE donation_type AS ENUM (
    'whole_blood',
    'power_red',
    'platelet',
    'plasma'
);

CREATE TABLE IF NOT EXISTS donations(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id uuid NOT NULL REFERENCES appointments(id),
    type donation_type NOT NULL,
    amount int NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TYPE blood_component AS ENUM (
    'red_cell',
    'platelet',
    'plasma'
);

CREATE TABLE IF NOT EXISTS blood_bags(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    donation_id uuid NOT NULL REFERENCES donations(id),
    component blood_component NOT NULL,
    is_used bool NOT NULL DEFAULT false,
    amount int NOT NULL,
    expired_time timestamptz NOT NULL
);
