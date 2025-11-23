-- ==========================================
-- CRITICAL SQL FIXES FOR ADMIN PANEL
-- ==========================================
-- INSTRUCTIONS:
-- 1. Open your Supabase dashboard
-- 2. Go to SQL Editor
-- 3. Copy and paste this ENTIRE file
-- 4. Click "Run" to execute
-- 5. Refresh your admin panel
-- ==========================================

-- 0. Fix foreign key relationships for proper JOINs
-- The issue is that adoption_applications.user_id references auth.users
-- but we need to join with profiles table
-- Since profiles.id also references auth.users.id, we need to ensure
-- the relationship is properly recognized

-- First, let's ensure the profiles table has all the necessary indexes
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);
CREATE INDEX IF NOT EXISTS idx_adoption_applications_user_id ON public.adoption_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_adoption_applications_pet_id ON public.adoption_applications(pet_id);
CREATE INDEX IF NOT EXISTS idx_volunteers_user_id ON public.volunteers(user_id);
CREATE INDEX IF NOT EXISTS idx_vet_appointments_user_id ON public.vet_appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_vet_appointments_pet_id ON public.vet_appointments(pet_id);
CREATE INDEX IF NOT EXISTS idx_donations_user_id ON public.donations(user_id);
CREATE INDEX IF NOT EXISTS idx_pet_feedback_user_id ON public.pet_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_pet_feedback_pet_id ON public.pet_feedback(pet_id);

-- 1. Fix adoption applications (Admin can't see pending requests)
DROP POLICY IF EXISTS "Users can view their own applications" ON public.adoption_applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON public.adoption_applications;
DROP POLICY IF EXISTS "Admins and vets can view all applications" ON public.adoption_applications;
DROP POLICY IF EXISTS "Users can create applications" ON public.adoption_applications;
DROP POLICY IF EXISTS "Authenticated users can create applications" ON public.adoption_applications;
DROP POLICY IF EXISTS "Admins can update applications" ON public.adoption_applications;
DROP POLICY IF EXISTS "Admins can delete applications" ON public.adoption_applications;
DROP POLICY IF EXISTS "Vets can view all adoption applications" ON public.adoption_applications;
DROP POLICY IF EXISTS "Vets can update adoption applications" ON public.adoption_applications;

CREATE POLICY "Users can view their own applications"
  ON public.adoption_applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins and vets can view all applications"
  ON public.adoption_applications FOR SELECT
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'vet')
  );

CREATE POLICY "Authenticated users can create applications"
  ON public.adoption_applications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update applications"
  ON public.adoption_applications FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete applications"
  ON public.adoption_applications FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 2. Fix pet update policy (User Story 16 - BROKEN)
DROP POLICY IF EXISTS "Admins can update pets" ON public.pets;
DROP POLICY IF EXISTS "Vets can update pets" ON public.pets;
DROP POLICY IF EXISTS "Pet owners can update their pets" ON public.pets;

CREATE POLICY "Admins can update pets"
  ON public.pets FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
  
CREATE POLICY "Vets can update pets"
  ON public.pets FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'vet'))
  WITH CHECK (public.has_role(auth.uid(), 'vet'));

-- Allow pet owners to update their adopted pets (name only in practice)
CREATE POLICY "Pet owners can update their pets"
  ON public.pets FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.adoption_applications
      WHERE adoption_applications.pet_id = pets.id
        AND adoption_applications.user_id = auth.uid()
        AND adoption_applications.status = 'approved'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.adoption_applications
      WHERE adoption_applications.pet_id = pets.id
        AND adoption_applications.user_id = auth.uid()
        AND adoption_applications.status = 'approved'
    )
  );

-- 3. Ensure profiles can be created and updated
-- First, add missing columns to profiles table if they don't exist
DO $$
BEGIN
  -- Add address column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'address'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN address TEXT;
  END IF;

  -- Add city column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'city'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN city TEXT;
  END IF;

  -- Add state column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'state'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN state TEXT;
  END IF;

  -- Add zip_code column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'zip_code'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN zip_code TEXT;
  END IF;
END $$;

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- 4. Create auto-profile trigger (User Story 1)
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

-- 5. Fix password recovery (User Story 24)
-- Password recovery is handled by Supabase Auth automatically
-- Just need to ensure it's enabled in your project settings

-- 6. Ensure all RLS is enabled
ALTER TABLE public.adoption_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vet_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for user_roles so users can read their own role
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;

CREATE POLICY "Users can view their own role"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
  ON public.user_roles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 7. Fix volunteers policies (Admin can't see/update volunteer applications)
DROP POLICY IF EXISTS "Users can view their own volunteer application" ON public.volunteers;
DROP POLICY IF EXISTS "Admins can view all volunteer applications" ON public.volunteers;
DROP POLICY IF EXISTS "Users can create volunteer applications" ON public.volunteers;
DROP POLICY IF EXISTS "Admins can update volunteer applications" ON public.volunteers;

CREATE POLICY "Users can view their own volunteer application"
  ON public.volunteers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all volunteer applications"
  ON public.volunteers FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create volunteer applications"
  ON public.volunteers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update volunteer applications"
  ON public.volunteers FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 8. Fix vet appointments policies (Admin can't see/update appointments)
DROP POLICY IF EXISTS "Users can view their own appointments" ON public.vet_appointments;
DROP POLICY IF EXISTS "Vets and admins can view all appointments" ON public.vet_appointments;
DROP POLICY IF EXISTS "Users can create appointments" ON public.vet_appointments;
DROP POLICY IF EXISTS "Admins can update appointments" ON public.vet_appointments;
DROP POLICY IF EXISTS "Vets can update appointments" ON public.vet_appointments;
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

CREATE POLICY "Users can create appointments"
  ON public.vet_appointments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

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

-- 9. Fix donations policies (Admin can't see all donations)
DROP POLICY IF EXISTS "Users can view their own donations" ON public.donations;
DROP POLICY IF EXISTS "Admins can view all donations" ON public.donations;
DROP POLICY IF EXISTS "Anyone can create donations" ON public.donations;

CREATE POLICY "Users can view their own donations"
  ON public.donations FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can view all donations"
  ON public.donations FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can create donations"
  ON public.donations FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 10. Fix feedbacks policies (Admin can't see feedback)
DROP POLICY IF EXISTS "Everyone can view feedback" ON public.pet_feedback;
DROP POLICY IF EXISTS "Users can view feedback" ON public.pet_feedback;
DROP POLICY IF EXISTS "Admins can view all feedback" ON public.pet_feedback;
DROP POLICY IF EXISTS "Users can create feedback" ON public.pet_feedback;
DROP POLICY IF EXISTS "Users can update their own feedback" ON public.pet_feedback;

CREATE POLICY "Everyone can view feedback"
  ON public.pet_feedback FOR SELECT
  USING (true);

CREATE POLICY "Admins can view all feedback"
  ON public.pet_feedback FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create feedback"
  ON public.pet_feedback FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feedback"
  ON public.pet_feedback FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 11. Ensure store tables have proper policies for admin
-- Store products policies
DROP POLICY IF EXISTS "Everyone can view products" ON public.store_products;
DROP POLICY IF EXISTS "Admins can insert products" ON public.store_products;
DROP POLICY IF EXISTS "Admins can update products" ON public.store_products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.store_products;

CREATE POLICY "Everyone can view products"
  ON public.store_products FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert products"
  ON public.store_products FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products"
  ON public.store_products FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products"
  ON public.store_products FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Store orders policies
DROP POLICY IF EXISTS "Users can view their own orders" ON public.store_orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.store_orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.store_orders;

CREATE POLICY "Users can view their own orders"
  ON public.store_orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON public.store_orders FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update orders"
  ON public.store_orders FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 12. Ensure care_articles table has proper policies for admin
DROP POLICY IF EXISTS "Everyone can view articles" ON public.care_articles;
DROP POLICY IF EXISTS "Admins can insert articles" ON public.care_articles;
DROP POLICY IF EXISTS "Admins can update articles" ON public.care_articles;
DROP POLICY IF EXISTS "Admins can delete articles" ON public.care_articles;

CREATE POLICY "Everyone can view articles"
  ON public.care_articles FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert articles"
  ON public.care_articles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update articles"
  ON public.care_articles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete articles"
  ON public.care_articles FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 13. Fix pet status constraint to allow valid values
-- Remove old constraint if exists and add proper one
DO $$
BEGIN
  -- Drop existing constraint if it exists
  ALTER TABLE public.pets DROP CONSTRAINT IF EXISTS table_status_check_constraint;
  ALTER TABLE public.pets DROP CONSTRAINT IF EXISTS pets_status_check;
  
  -- Add proper constraint with all valid status values
  ALTER TABLE public.pets ADD CONSTRAINT pets_status_check 
    CHECK (status IN ('available', 'under_review', 'adopted', 'in_care', 'pending'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 14. Add RLS policies for vet-specific tables (User Stories 8, 19, 20, 21)
-- Medical Records policies
DROP POLICY IF EXISTS "Everyone can view medical records" ON public.medical_records;
DROP POLICY IF EXISTS "Vets can insert medical records" ON public.medical_records;
DROP POLICY IF EXISTS "Vets can update medical records" ON public.medical_records;
DROP POLICY IF EXISTS "Admins can view medical records" ON public.medical_records;

CREATE POLICY "Everyone can view medical records"
  ON public.medical_records FOR SELECT
  USING (true);

CREATE POLICY "Vets can insert medical records"
  ON public.medical_records FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'vet') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Vets can update medical records"
  ON public.medical_records FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'vet') OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'vet') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view medical records"
  ON public.medical_records FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));
