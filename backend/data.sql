-- ============================================
-- ASSUMED: Schema definitions are already executed above.
-- This section focuses solely on data insertion.
-- ============================================

-- 1. Accounts — only the three originals
INSERT INTO accounts (id, role, email, password, phone, name, gender, address, birthday, blood_group, is_active, created_at) VALUES
  ('11111111-1111-1111-1111-111111111111','admin','admin@test.com','$2a$10$LTZhbjKO4EbC2YsVwQ6AfuDd3Xk0ZGEkNiK.ibeMnDDeUbNUSH80W','+841234567890','Nguyen Van A','male','123 Le Loi St, HCMC','1980-05-10','o_plus',true,'2025-06-01T08:00:00Z'),
  ('22222222-2222-2222-2222-222222222222','staff','staff@test.com','$2a$10$LTZhbjKO4EbC2YsVwQ6AfuDd3Xk0ZGEkNiK.ibeMnDDeUbNUSH80W','+849876543210','Tran Thi B','female','456 Nguyen Hue Blvd, HCMC','1990-12-20','a_minus',true,'2025-06-05T09:30:00Z'),
  ('33333333-3333-3333-3333-333333333333','member','member@test.com','$2a$10$LTZhbjKO4EbC2YsVwQ6AfuDd3Xk0ZGEkNiK.ibeMnDDeUbNUSH80W','+848765432109','Le Van C','male','789 Pasteur Ave, HCMC','1995-07-15','b_plus',true,'2025-06-10T14:45:00Z')
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