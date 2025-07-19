--: Dashboard()

--! get_stats
SELECT 
    (SELECT COUNT(id) FROM accounts) AS total_users,
    (SELECT COUNT(id) FROM donations) AS total_donations,
    (SELECT COUNT(id) FROM blood_requests WHERE now() < end_time AND is_active = true) AS active_blood_requests,
    (SELECT COUNT(id) FROM blood_bags WHERE is_used = false) AS available_blood_bags;