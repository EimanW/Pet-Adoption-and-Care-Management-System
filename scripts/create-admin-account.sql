-- ============================================
-- CREATE ADMIN ACCOUNT
-- ============================================
-- This script assigns admin role to a user
-- Run AFTER signing up through the website
-- ============================================

-- STEP 1: Sign up on the website with these credentials:
--   Email: admin@pawhaven.com
--   Password: Admin@123456
--   First Name: Admin
--   Last Name: User

-- STEP 2: After signing up, find the user ID:
--   Go to: Supabase Dashboard > Authentication > Users
--   Find: admin@pawhaven.com
--   Copy: The UUID (it will look like: 12345678-1234-1234-1234-123456789abc)

-- STEP 3: Replace 'YOUR_USER_ID_HERE' below with the actual UUID and run this query:

INSERT INTO public.user_roles (user_id, role)
VALUES ('96ced4c7-60cd-4ca8-a5ea-c72feb0c4e3b', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Example (replace the UUID with your actual user ID):
-- INSERT INTO public.user_roles (user_id, role)
-- VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'admin')
-- ON CONFLICT (user_id, role) DO NOTHING;

-- ============================================
-- VERIFICATION QUERY
-- ============================================
-- Run this to verify the admin role was assigned:

SELECT 
  u.id,
  u.email,
  u.created_at,
  p.first_name,
  p.last_name,
  ur.role
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'admin@pawhaven.com';
