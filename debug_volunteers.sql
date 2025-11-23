-- Run this in Supabase SQL Editor to check volunteer data and policies

-- 1. Check if there are any volunteers in the database
SELECT 
  v.id,
  v.user_id,
  v.status,
  v.skills,
  v.availability,
  v.application_date,
  p.first_name,
  p.last_name,
  p.email
FROM volunteers v
LEFT JOIN profiles p ON p.id = v.user_id
ORDER BY v.application_date DESC;

-- 2. Check current RLS policies on volunteers table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'volunteers';

-- 3. If no volunteers exist, create a test volunteer
-- First, get an existing user ID (replace with actual user ID from your auth.users table)
-- SELECT id, email FROM auth.users LIMIT 5;

-- Then insert a test volunteer (uncomment and replace USER_ID_HERE)
-- INSERT INTO volunteers (user_id, availability, skills, experience, status)
-- VALUES (
--   'USER_ID_HERE',
--   'Weekends, 9am-5pm',
--   'Animal care, Dog walking',
--   'Previous shelter volunteer',
--   'pending'
-- );
