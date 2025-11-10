-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('user', 'admin', 'vet', 'volunteer');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- User roles policies
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create pets table
CREATE TABLE public.pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  breed TEXT,
  age INTEGER,
  gender TEXT,
  size TEXT,
  color TEXT,
  description TEXT,
  personality TEXT[],
  health_status TEXT,
  vaccination_status TEXT,
  spayed_neutered BOOLEAN DEFAULT FALSE,
  good_with_kids BOOLEAN DEFAULT FALSE,
  good_with_pets BOOLEAN DEFAULT FALSE,
  energy_level TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'available',
  arrival_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

-- Pets policies (public viewing, admin management)
CREATE POLICY "Anyone can view available pets"
  ON public.pets FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert pets"
  ON public.pets FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update pets"
  ON public.pets FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete pets"
  ON public.pets FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Create adoption_applications table
CREATE TABLE public.adoption_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending',
  home_type TEXT,
  has_yard BOOLEAN,
  has_other_pets BOOLEAN,
  has_children BOOLEAN,
  experience TEXT,
  reason TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  admin_notes TEXT
);

ALTER TABLE public.adoption_applications ENABLE ROW LEVEL SECURITY;

-- Adoption application policies
CREATE POLICY "Users can view their own applications"
  ON public.adoption_applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all applications"
  ON public.adoption_applications FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create applications"
  ON public.adoption_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update applications"
  ON public.adoption_applications FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Create pet_feedback table
CREATE TABLE public.pet_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  adoption_application_id UUID REFERENCES public.adoption_applications(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(adoption_application_id)
);

ALTER TABLE public.pet_feedback ENABLE ROW LEVEL SECURITY;

-- Enable realtime for feedback
ALTER PUBLICATION supabase_realtime ADD TABLE public.pet_feedback;

-- Feedback policies
CREATE POLICY "Anyone can view feedback"
  ON public.pet_feedback FOR SELECT
  USING (true);

CREATE POLICY "Users can create feedback for their approved adoptions"
  ON public.pet_feedback FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.adoption_applications
      WHERE id = adoption_application_id
        AND user_id = auth.uid()
        AND status = 'approved'
    )
  );

CREATE POLICY "Users can update their own feedback"
  ON public.pet_feedback FOR UPDATE
  USING (auth.uid() = user_id);

-- Create medical_records table
CREATE TABLE public.medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  record_type TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  veterinarian TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;

-- Medical records policies
CREATE POLICY "Vets and admins can view medical records"
  ON public.medical_records FOR SELECT
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'vet')
  );

CREATE POLICY "Vets and admins can create medical records"
  ON public.medical_records FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'vet')
  );

-- Create vet_appointments table
CREATE TABLE public.vet_appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  appointment_date TIMESTAMPTZ NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.vet_appointments ENABLE ROW LEVEL SECURITY;

-- Vet appointments policies
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
  WITH CHECK (auth.uid() = user_id);

-- Create volunteers table
CREATE TABLE public.volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  availability TEXT[],
  skills TEXT[],
  experience TEXT,
  status TEXT DEFAULT 'pending',
  application_date TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;

-- Volunteer policies
CREATE POLICY "Users can view their own volunteer application"
  ON public.volunteers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all volunteer applications"
  ON public.volunteers FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create volunteer applications"
  ON public.volunteers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update volunteer applications"
  ON public.volunteers FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Create donations table
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  donation_type TEXT NOT NULL,
  amount DECIMAL,
  items TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Donation policies
CREATE POLICY "Users can view their own donations"
  ON public.donations FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can view all donations"
  ON public.donations FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can create donations"
  ON public.donations FOR INSERT
  WITH CHECK (true);

-- Create user_favorites table
CREATE TABLE public.user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, pet_id)
);

ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- Favorites policies
CREATE POLICY "Users can view their own favorites"
  ON public.user_favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create favorites"
  ON public.user_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON public.user_favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_pets_updated_at
  BEFORE UPDATE ON public.pets
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_feedback_updated_at
  BEFORE UPDATE ON public.pet_feedback
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();