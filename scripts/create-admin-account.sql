-- Create Admin Account
-- Run this in Supabase SQL Editor AFTER creating the admin user through the signup page

-- Step 1: First, sign up with these credentials on the website:
-- Email: admin@pawhaven.com
-- Password: Admin@123456
-- First Name: Admin
-- Last Name: User

-- Step 2: After signing up, get the user ID from Supabase Dashboard > Authentication > Users
-- Look for the user with email "admin@pawhaven.com" and copy their UUID

-- Step 3: Run this query, replacing 'USER_ID_HERE' with the actual UUID:

-- Example (replace with your actual user ID):
-- INSERT INTO user_roles (user_id, role) 
-- VALUES ('12345678-1234-1234-1234-123456789abc', 'admin')
-- ON CONFLICT (user_id, role) DO NOTHING;

-- OR if you want to create the admin directly in the database:

-- OPTION A: Create admin account directly (recommended)
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Insert into auth.users (this creates the actual auth account)
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@pawhaven.com',
    crypt('Admin@123456', gen_salt('bf')), -- Password: Admin@123456
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Admin","last_name":"User"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  )
  ON CONFLICT (email) DO NOTHING
  RETURNING id INTO admin_user_id;

  -- If user already exists, get their ID
  IF admin_user_id IS NULL THEN
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@pawhaven.com';
  END IF;

  -- Create profile (will be created by trigger, but ensuring it exists)
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (admin_user_id, 'admin@pawhaven.com', 'Admin', 'User')
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name;

  -- Assign admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (admin_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  RAISE NOTICE 'Admin account created successfully with email: admin@pawhaven.com';
END $$;

-- Verify admin was created
SELECT 
  u.email,
  u.email_confirmed_at,
  p.first_name,
  p.last_name,
  ur.role
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'admin@pawhaven.com';
