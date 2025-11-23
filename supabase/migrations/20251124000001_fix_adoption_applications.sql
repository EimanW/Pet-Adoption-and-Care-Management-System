-- Fix adoption applications RLS policy and add missing trigger
-- This ensures users can submit adoption applications

-- Drop existing policy and recreate with proper WITH CHECK
DROP POLICY IF EXISTS "Users can create applications" ON public.adoption_applications;

CREATE POLICY "Users can create applications"
  ON public.adoption_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Ensure UPDATE policy has both USING and WITH CHECK
DROP POLICY IF EXISTS "Admins can update applications" ON public.adoption_applications;

CREATE POLICY "Admins can update applications"
  ON public.adoption_applications FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create a trigger to automatically create a profile if it doesn't exist
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

-- Create trigger on auth.users (if it doesn't exist)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also add a function to ensure profile exists before inserting application
CREATE OR REPLACE FUNCTION public.ensure_profile_exists()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile if it doesn't exist
  INSERT INTO public.profiles (id, created_at)
  VALUES (NEW.user_id, NOW())
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS ensure_profile_before_application ON public.adoption_applications;
CREATE TRIGGER ensure_profile_before_application
  BEFORE INSERT ON public.adoption_applications
  FOR EACH ROW EXECUTE FUNCTION public.ensure_profile_exists();
