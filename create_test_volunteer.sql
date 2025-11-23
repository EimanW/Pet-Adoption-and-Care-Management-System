-- Create a test volunteer application
-- This will create a volunteer record linked to your admin user

-- Step 1: Get your admin user ID
-- Copy the ID from the result below
SELECT id, email FROM auth.users WHERE email LIKE '%admin%' OR email LIKE '%test%' LIMIT 5;

-- Step 2: Insert test volunteer (replace 'YOUR_USER_ID_HERE' with actual user ID from above)
-- Or use this dynamic version that finds the first user:

DO $$
DECLARE
  test_user_id UUID;
BEGIN
  -- Get the first user ID (or you can change the WHERE clause to match a specific user)
  SELECT id INTO test_user_id 
  FROM auth.users 
  LIMIT 1;

  -- Insert test volunteer application
  INSERT INTO volunteers (user_id, availability, skills, experience, status)
  VALUES (
    test_user_id,
    ARRAY['Weekends', 'Evenings']::TEXT[],
    ARRAY['Animal care', 'Dog walking', 'Event coordination']::TEXT[],
    'Previous shelter volunteer for 2 years',
    'pending'
  )
  ON CONFLICT DO NOTHING;

  RAISE NOTICE 'Test volunteer created for user: %', test_user_id;
END $$;

-- Step 3: Verify the volunteer was created
SELECT 
  v.id,
  v.status,
  v.skills,
  v.availability,
  v.application_date,
  p.email
FROM volunteers v
JOIN profiles p ON p.id = v.user_id
ORDER BY v.application_date DESC;
