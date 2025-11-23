-- ==========================================
-- ESSENTIAL FIXES FOR VET REDIRECT
-- ==========================================
-- Run this in Supabase SQL Editor to fix vet account issues
-- ==========================================

-- 1. Allow users to read their own role
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;

CREATE POLICY "Users can view their own role"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- 2. Allow admins to insert and update roles
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;

CREATE POLICY "Admins can insert roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
  ON public.user_roles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3. CRITICAL: Allow users to insert their own role during signup
DROP POLICY IF EXISTS "Users can insert their own role during signup" ON public.user_roles;

CREATE POLICY "Users can insert their own role during signup"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 4. Add missing profile columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'address'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN address TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'city'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN city TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'state'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN state TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'zip_code'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN zip_code TEXT;
  END IF;
END $$;

-- 5. Allow users to update their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 6. Fix vet_appointments policies so vets can view and update them
DROP POLICY IF EXISTS "Users can view their own appointments" ON public.vet_appointments;
DROP POLICY IF EXISTS "Vets and admins can view all appointments" ON public.vet_appointments;
DROP POLICY IF EXISTS "Admins and vets can update appointments" ON public.vet_appointments;

CREATE POLICY "Users can view their own appointments"
  ON public.vet_appointments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Vets and admins can view all appointments"
  ON public.vet_appointments FOR SELECT
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'vet')
  );

CREATE POLICY "Admins and vets can update appointments"
  ON public.vet_appointments FOR UPDATE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'vet')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'vet')
  );
