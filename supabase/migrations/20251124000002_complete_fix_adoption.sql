-- COMPLETE FIX for adoption applications
-- This will completely reset and fix all policies

-- 1. Drop ALL existing policies
DROP POLICY IF EXISTS "Users can view their own applications" ON public.adoption_applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON public.adoption_applications;
DROP POLICY IF EXISTS "Users can create applications" ON public.adoption_applications;
DROP POLICY IF EXISTS "Admins can update applications" ON public.adoption_applications;
DROP POLICY IF EXISTS "Vets can view all adoption applications" ON public.adoption_applications;
DROP POLICY IF EXISTS "Vets can update adoption applications" ON public.adoption_applications;

-- 2. Create new policies with proper permissions

-- Allow users to view their own applications
CREATE POLICY "Users can view their own applications"
  ON public.adoption_applications FOR SELECT
  USING (auth.uid() = user_id);

-- Allow admins and vets to view all applications
CREATE POLICY "Admins and vets can view all applications"
  ON public.adoption_applications FOR SELECT
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'vet')
  );

-- Allow ANY authenticated user to create applications (this is the key fix)
CREATE POLICY "Authenticated users can create applications"
  ON public.adoption_applications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow admins to update applications
CREATE POLICY "Admins can update applications"
  ON public.adoption_applications FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete applications
CREATE POLICY "Admins can delete applications"
  ON public.adoption_applications FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 3. Ensure profiles table allows inserts
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- 4. Create the auto-profile creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at)
  VALUES (NEW.id, NEW.email, NOW())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Verify RLS is enabled (it should be)
ALTER TABLE public.adoption_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
