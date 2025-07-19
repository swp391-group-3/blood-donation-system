--: Dashboard()

--! get_stats : DashboardStats()
SELECT 
    (SELECT COUNT(id) FROM accounts) AS total_users,
    (SELECT COUNT(id) FROM donations) AS total_donations,
    (SELECT COUNT(id) FROM blood_requests WHERE now() < end_time AND is_active = true) AS active_blood_requests,
    (SELECT COUNT(id) FROM blood_bags WHERE is_used = false) AS available_blood_bags;

--! get_donation_trends : DonationTrend()
SELECT created_at
FROM donations;

--! get_request_trends : RequestTrend()
SELECT start_time
FROM blood_requests;

--! get_blood_group_distribution : BloodGroup()
SELECT blood_group
FROM accounts;