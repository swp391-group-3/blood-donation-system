-- ============================================
-- ASSUMED: Schema definitions are already executed above.
-- This section focuses solely on data insertion.
-- ============================================

-- 1. Accounts — only the three originals
INSERT INTO accounts (id, role, email, password, phone, name, gender, address, birthday, blood_group, is_active, created_at, is_banned) VALUES
  ('11111111-1111-1111-1111-111111111111','admin','admin@test.com','$2a$10$LTZhbjKO4EbC2YsVwQ6AfuDd3Xk0ZGEkNiK.ibeMnDDeUbNUSH80W','+841234567890','Nguyen Van A','male','123 Le Loi St, HCMC','1980-05-10','o_plus',true,'2025-06-01T08:00:00Z', false),
  ('22222222-2222-2222-2222-222222222222','staff','staff@test.com','$2a$10$LTZhbjKO4EbC2YsVwQ6AfuDd3Xk0ZGEkNiK.ibeMnDDeUbNUSH80W','+849876543210','Tran Thi B','female','456 Nguyen Hue Blvd, HCMC','1990-12-20','a_minus',true,'2025-06-05T09:30:00Z', false),
  ('33333333-3333-3333-3333-333333333333','donor','donor@test.com','$2a$10$LTZhbjKO4EbC2YsVwQ6AfuDd3Xk0ZGEkNiK.ibeMnDDeUbNUSH80W','+848765432109','Le Van C','male','789 Pasteur Ave, HCMC','1995-07-15','b_plus',true,'2025-06-10T14:45:00Z', false)
ON CONFLICT DO NOTHING;

-- 2. Questions
INSERT INTO questions (id, content, is_active) VALUES
  (1,'Have you eaten in the past 4 hours?',true),
  (2,'Did you get enough sleep last night?',true)
ON CONFLICT DO NOTHING;

-- 3. Tags
INSERT INTO tags (id, name) VALUES
  ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1','urgent'),
  ('bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbb2','community'),
  ('ccccccc3-cccc-cccc-cccc-ccccccccccc3','event'),
  ('aaaa1111-aaaa-1111-aaaa-111111111111','support'),
  ('bbbb2222-bbbb-2222-bbbb-222222222222','reminder'),
  ('cccc3333-cccc-3333-cccc-333333333333','thankful'),
  ('dddd4444-dddd-4444-dddd-444444444444','awareness'),
  ('eeee5555-eeee-5555-eeee-eeeeeeeeeeee','update')
ON CONFLICT DO NOTHING;

-- 4. Blogs
INSERT INTO blogs (id, account_id, title, description, content, created_at) VALUES
  ('f1111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222','Looking for Donors','','We need O+ donors this weekend.','2025-06-07T10:00:00Z'),
  ('f2222222-2222-2222-2222-222222222222','22222222-2222-2222-2222-222222222222','Blood Drive Successful','','Thanks to all donors yesterday!','2025-06-08T11:15:00Z'),
  ('f3333333-3333-3333-3333-333333333333','22222222-2222-2222-2222-222222222222','Platelet Shortage Alert','','Low platelet stock—please donate.','2025-06-16T09:00:00Z'),
  ('f4444444-4444-4444-4444-444444444444','33333333-3333-3333-3333-333333333333','My First Donation','','Sharing my first-time donor journey.','2025-06-16T12:30:00Z'),
  ('f5555555-5555-5555-5555-555555555555','22222222-2222-2222-2222-222222222222','Upcoming Plasma Drive','','Join us next week for plasma donations.','2025-06-17T08:45:00Z')
ON CONFLICT DO NOTHING;

-- 5. Blog_Tags
INSERT INTO blog_tags (blog_id, tag_id) VALUES
  ('f1111111-1111-1111-1111-111111111111','aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1'),
  ('f2222222-2222-2222-2222-222222222222','bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbb2'),
  ('f3333333-3333-3333-3333-333333333333','dddd4444-dddd-4444-dddd-444444444444'),
  ('f4444444-4444-4444-4444-444444444444','cccc3333-cccc-3333-cccc-333333333333'),
  ('f5555555-5555-5555-5555-555555555555','aaaa1111-aaaa-1111-aaaa-111111111111')
ON CONFLICT DO NOTHING;

-- 6. Comments
INSERT INTO comments (id, blog_id, account_id, content, created_at) VALUES
  ('c1111111-1111-1111-1111-111111111111','f1111111-1111-1111-1111-111111111111','33333333-3333-3333-3333-333333333333','Happy to help!','2025-06-07T12:00:00Z'),
  ('c2222222-2222-2222-2222-222222222222','f3333333-3333-3333-3333-333333333333','33333333-3333-3333-3333-333333333333','Count me in!','2025-06-16T09:30:00Z'),
  ('c3333333-3333-3333-3333-333333333333','f5555555-5555-5555-5555-555555555555','22222222-2222-2222-2222-222222222222','Looking forward!','2025-06-17T09:00:00Z')
ON CONFLICT DO NOTHING;

-- 1. blood_requests
INSERT INTO blood_requests (id, staff_id, priority, title, max_people, start_time, end_time, is_active, created_at) VALUES
  ('11111111-aaaa-bbbb-cccc-111111111111', '22222222-2222-2222-2222-222222222222', 'high', 'Emergency O+ Blood Needed', 5, '2025-06-18T09:00:00Z', '2025-06-18T12:00:00Z', true, '2025-06-16T08:00:00Z'),
  ('22222222-bbbb-cccc-dddd-222222222222', '22222222-2222-2222-2222-222222222222', 'medium', 'Weekend Blood Drive', 10, '2025-06-22T08:00:00Z', '2025-06-22T17:00:00Z', true, '2025-06-17T09:00:00Z')
ON CONFLICT DO NOTHING;

-- 2. request_blood_groups
INSERT INTO request_blood_groups (request_id, blood_group) VALUES
  ('11111111-aaaa-bbbb-cccc-111111111111', 'o_plus'),
  ('22222222-bbbb-cccc-dddd-222222222222', 'a_minus'),
  ('22222222-bbbb-cccc-dddd-222222222222', 'b_plus')
ON CONFLICT DO NOTHING;

-- 3. appointments
INSERT INTO appointments (id, request_id, donor_id, status) VALUES
  ('33333333-aaaa-bbbb-cccc-333333333333', '11111111-aaaa-bbbb-cccc-111111111111', '33333333-3333-3333-3333-333333333333', 'approved'),
  ('44444444-bbbb-cccc-dddd-444444444444', '22222222-bbbb-cccc-dddd-222222222222', '33333333-3333-3333-3333-333333333333', 'checked_in')
ON CONFLICT DO NOTHING;

-- 4. answers
INSERT INTO answers (question_id, appointment_id, content) VALUES
  (1, '33333333-aaaa-bbbb-cccc-333333333333', 'Yes'),
  (2, '33333333-aaaa-bbbb-cccc-333333333333', 'Yes'),
  (1, '44444444-bbbb-cccc-dddd-444444444444', 'No'),
  (2, '44444444-bbbb-cccc-dddd-444444444444', 'Yes')
ON CONFLICT DO NOTHING;

-- 5. healths
INSERT INTO healths (id, appointment_id, temperature, weight, upper_blood_pressure, lower_blood_pressure, heart_rate, is_good_health, note, created_at) VALUES
  ('55555555-aaaa-bbbb-cccc-555555555555', '33333333-aaaa-bbbb-cccc-333333333333', 36.6, 65.0, 120, 80, 72, true, 'Healthy and ready to donate.', '2025-06-18T08:45:00Z'),
  ('66666666-bbbb-cccc-dddd-666666666666', '44444444-bbbb-cccc-dddd-444444444444', 37.0, 70.5, 115, 75, 70, true, NULL, '2025-06-22T07:30:00Z')
ON CONFLICT DO NOTHING;

-- 6. donations
INSERT INTO donations (id, appointment_id, type, amount, created_at) VALUES
  ('77777777-aaaa-bbbb-cccc-777777777777', '33333333-aaaa-bbbb-cccc-333333333333', 'whole_blood', 450, '2025-06-18T10:30:00Z'),
  ('88888888-bbbb-cccc-dddd-888888888888', '44444444-bbbb-cccc-dddd-444444444444', 'platelet', 300, '2025-06-22T12:00:00Z')
ON CONFLICT DO NOTHING;

-- 7. blood_bags
INSERT INTO blood_bags (id, donation_id, component, is_used, amount, expired_time) VALUES
  ('99999999-aaaa-bbbb-cccc-999999999999', '77777777-aaaa-bbbb-cccc-777777777777', 'red_cell', false, 250, '2025-07-18T10:30:00Z'),
  ('aaaaaaaa-bbbb-cccc-dddd-aaaaaaaaaaaa', '77777777-aaaa-bbbb-cccc-777777777777', 'plasma', false, 200, '2025-07-18T10:30:00Z'),
  ('bbbbbbbb-cccc-dddd-eeee-bbbbbbbbbbbb', '88888888-bbbb-cccc-dddd-888888888888', 'platelet', false, 300, '2025-07-22T12:00:00Z')
ON CONFLICT DO NOTHING;
