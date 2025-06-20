-- ============================================
-- ASSUMED: Schema definitions are already executed above.
-- This section focuses solely on data insertion.
-- ============================================

-- 1. Accounts — only the three originals
INSERT INTO accounts (id, role, email, password, phone, name, gender, address, birthday, blood_group, is_active, created_at) VALUES
  ('11111111-1111-1111-1111-111111111111','admin','admin@example.com','hashedpw1','+841234567890','Nguyen Van A','male','123 Le Loi St, HCMC','1980-05-10','o_plus',true,'2025-06-01T08:00:00Z'),
  ('22222222-2222-2222-2222-222222222222','staff','staff1@blood.org','hashedpw2','+849876543210','Tran Thi B','female','456 Nguyen Hue Blvd, HCMC','1990-12-20','a_minus',true,'2025-06-05T09:30:00Z'),
  ('33333333-3333-3333-3333-333333333333','member','khanghuynh0245@gmail.com','hashedpw3','+848765432109','Le Van C','male','789 Pasteur Ave, HCMC','1995-07-15','b_plus',true,'2025-06-10T14:45:00Z')
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
INSERT INTO blogs (id, account_id, title, content, created_at) VALUES
  ('f1111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222','Looking for Donors','We need O+ donors this weekend.','2025-06-07T10:00:00Z'),
  ('f2222222-2222-2222-2222-222222222222','22222222-2222-2222-2222-222222222222','Blood Drive Successful','Thanks to all donors yesterday!','2025-06-08T11:15:00Z'),
  ('f3333333-3333-3333-3333-333333333333','22222222-2222-2222-2222-222222222222','Platelet Shortage Alert','Low platelet stock—please donate.','2025-06-16T09:00:00Z'),
  ('f4444444-4444-4444-4444-444444444444','33333333-3333-3333-3333-333333333333','My First Donation','Sharing my first-time donor journey.','2025-06-16T12:30:00Z'),
  ('f5555555-5555-5555-5555-555555555555','22222222-2222-2222-2222-222222222222','Upcoming Plasma Drive','Join us next week for plasma donations.','2025-06-17T08:45:00Z')
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

-- 7. Blood Requests (without blood_group)
INSERT INTO blood_requests (id, staff_id, priority, title, max_people, start_time, end_time, is_active, created_at) VALUES
  ('b1111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222','high','Emergency Collection',10,'2025-06-15T08:00:00Z','2025-06-20T17:00:00Z',true,'2025-06-05T09:00:00Z'),
  ('b2222222-2222-2222-2222-222222222222','22222222-2222-2222-2222-222222222222','medium','June Drive',8,'2025-06-18T09:00:00Z','2025-06-21T17:00:00Z',true,'2025-06-16T07:00:00Z'),
  ('b3333333-3333-3333-3333-333333333333','22222222-2222-2222-2222-222222222222','low','Monthly Donation',6,'2025-06-25T10:00:00Z','2025-06-30T15:00:00Z',true,'2025-06-17T09:15:00Z')
ON CONFLICT DO NOTHING;

-- 8. Request Blood Groups
INSERT INTO request_blood_groups (request_id, blood_group) VALUES
  ('b1111111-1111-1111-1111-111111111111','o_plus'),
  ('b1111111-1111-1111-1111-111111111111','b_plus'),
  ('b2222222-2222-2222-2222-222222222222','ab_plus'),
  ('b3333333-3333-3333-3333-333333333333','o_minus')
ON CONFLICT DO NOTHING;

-- 9. Appointments
INSERT INTO appointments (id, request_id, member_id) VALUES
  ('a1111111-1111-1111-1111-111111111111','b1111111-1111-1111-1111-111111111111','33333333-3333-3333-3333-333333333333'),
  ('a2222222-2222-2222-2222-222222222222','b2222222-2222-2222-2222-222222222222','33333333-3333-3333-3333-333333333333'),
  ('a3333333-3333-3333-3333-333333333333','b3333333-3333-3333-3333-333333333333','33333333-3333-3333-3333-333333333333')
ON CONFLICT DO NOTHING;

-- 10. Answers
INSERT INTO answers (question_id, appointment_id, content) VALUES
  (1,'a1111111-1111-1111-1111-111111111111','Yes, had breakfast.'),
  (2,'a1111111-1111-1111-1111-111111111111','Yes.'),
  (1,'a2222222-2222-2222-2222-222222222222','Ate a light meal.'),
  (2,'a3333333-3333-3333-3333-333333333333','Slept well.')
ON CONFLICT DO NOTHING;

-- 11. Healths
INSERT INTO healths (id, appointment_id, temperature, weight, upper_blood_pressure, lower_blood_pressure, heart_pulse, hemoglobin, is_good_health, note, created_at) VALUES
  ('e1111111-1111-1111-1111-111111111111','a1111111-1111-1111-1111-111111111111',36.6,62.5,120,80,72,13.5,true,'All good','2025-06-15T08:30:00Z'),
  ('e2222222-2222-2222-2222-222222222222','a2222222-2222-2222-2222-222222222222',36.8,61.0,117,77,69,13.7,true,'Feeling good','2025-06-18T08:30:00Z'),
  ('e3333333-3333-3333-3333-333333333333','a3333333-3333-3333-3333-333333333333',36.5,59.3,116,76,68,13.6,true,'Ready to donate','2025-06-25T10:30:00Z')
ON CONFLICT DO NOTHING;

-- 12. Donations
INSERT INTO donations (id, appointment_id, type, amount, created_at) VALUES
  ('d1111111-1111-1111-1111-111111111111','a1111111-1111-1111-1111-111111111111','whole_blood',450,'2025-06-15T09:00:00Z'),
  ('d2222222-2222-2222-2222-222222222222','a2222222-2222-2222-2222-222222222222','platelet',300,'2025-06-18T09:00:00Z'),
  ('d3333333-3333-3333-3333-333333333333','a3333333-3333-3333-3333-333333333333','plasma',250,'2025-06-25T11:00:00Z')
ON CONFLICT DO NOTHING;

-- 13. Blood Bags
INSERT INTO blood_bags (id, donation_id, component, is_used, amount, expired_time) VALUES
  ('bb111111-1111-1111-1111-111111111111','d1111111-1111-1111-1111-111111111111','red_cell',false,250,'2025-12-15T00:00:00Z'),
  ('bb111112-1111-1111-1111-111111111112','d1111111-1111-1111-1111-111111111111','plasma',false,200,'2026-01-15T00:00:00Z'),
  ('bb222221-2222-2222-2222-222222222221','d2222222-2222-2222-2222-222222222222','platelet',false,180,'2025-12-18T00:00:00Z'),
  ('bb222222-2222-2222-2222-222222222222','d2222222-2222-2222-2222-222222222222','plasma',false,120,'2026-01-18T00:00:00Z'),
  ('bb333331-3333-3333-3333-333333333331','d3333333-3333-3333-3333-333333333333','red_cell',false,250,'2025-12-20T00:00:00Z'),
  ('bb333332-3333-3333-3333-333333333332','d3333333-3333-3333-3333-333333333333','plasma',false,300,'2026-02-01T00:00:00Z')
ON CONFLICT DO NOTHING;
