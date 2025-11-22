-- Create vaccinations table
CREATE TABLE public.vaccinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  vaccine_name TEXT NOT NULL,
  date_administered DATE NOT NULL,
  next_due_date DATE,
  veterinarian TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.vaccinations ENABLE ROW LEVEL SECURITY;

-- Vaccinations policies
CREATE POLICY "Anyone can view vaccinations"
  ON public.vaccinations FOR SELECT
  USING (true);

CREATE POLICY "Vets can add vaccinations"
  ON public.vaccinations FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'vet') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Vets can update vaccinations"
  ON public.vaccinations FOR UPDATE
  USING (public.has_role(auth.uid(), 'vet') OR public.has_role(auth.uid(), 'admin'));

-- Create prescriptions table
CREATE TABLE public.prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  medication_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  instructions TEXT NOT NULL,
  prescribed_date DATE NOT NULL,
  veterinarian_id UUID REFERENCES auth.users(id) NOT NULL,
  veterinarian_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

-- Prescriptions policies
CREATE POLICY "Pet owners can view their pet prescriptions"
  ON public.prescriptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.adoption_applications aa
      WHERE aa.pet_id = prescriptions.pet_id
        AND aa.user_id = auth.uid()
        AND aa.status = 'approved'
    )
    OR public.has_role(auth.uid(), 'vet')
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Vets can add prescriptions"
  ON public.prescriptions FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'vet'));

CREATE POLICY "Vets can update their prescriptions"
  ON public.prescriptions FOR UPDATE
  USING (veterinarian_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Create consultations table
CREATE TABLE public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vet_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending',
  requested_date TIMESTAMPTZ DEFAULT NOW(),
  scheduled_date TIMESTAMPTZ,
  consultation_type TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- Consultations policies
CREATE POLICY "Users can view their own consultation requests"
  ON public.consultations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Vets can view all consultations"
  ON public.consultations FOR SELECT
  USING (public.has_role(auth.uid(), 'vet') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create consultation requests"
  ON public.consultations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Vets can update consultations"
  ON public.consultations FOR UPDATE
  USING (public.has_role(auth.uid(), 'vet') OR public.has_role(auth.uid(), 'admin'));

-- Create volunteer_activities table
CREATE TABLE public.volunteer_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  volunteers_needed INTEGER NOT NULL DEFAULT 1,
  volunteers_assigned INTEGER NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.volunteer_activities ENABLE ROW LEVEL SECURITY;

-- Volunteer activities policies
CREATE POLICY "Anyone can view open volunteer activities"
  ON public.volunteer_activities FOR SELECT
  USING (true);

CREATE POLICY "Admins can create volunteer activities"
  ON public.volunteer_activities FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update volunteer activities"
  ON public.volunteer_activities FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete volunteer activities"
  ON public.volunteer_activities FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Create volunteer_assignments table
CREATE TABLE public.volunteer_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_id UUID REFERENCES public.volunteer_activities(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'assigned',
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(volunteer_id, activity_id)
);

ALTER TABLE public.volunteer_assignments ENABLE ROW LEVEL SECURITY;

-- Volunteer assignments policies
CREATE POLICY "Volunteers can view their own assignments"
  ON public.volunteer_assignments FOR SELECT
  USING (auth.uid() = volunteer_id);

CREATE POLICY "Admins can view all assignments"
  ON public.volunteer_assignments FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Volunteers can sign up for activities"
  ON public.volunteer_assignments FOR INSERT
  WITH CHECK (auth.uid() = volunteer_id AND public.has_role(auth.uid(), 'volunteer'));

CREATE POLICY "Volunteers can update their assignments"
  ON public.volunteer_assignments FOR UPDATE
  USING (auth.uid() = volunteer_id);

CREATE POLICY "Admins can update any assignment"
  ON public.volunteer_assignments FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Add updated_at triggers
CREATE TRIGGER update_vaccinations_updated_at
  BEFORE UPDATE ON public.vaccinations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_prescriptions_updated_at
  BEFORE UPDATE ON public.prescriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_consultations_updated_at
  BEFORE UPDATE ON public.consultations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_volunteer_activities_updated_at
  BEFORE UPDATE ON public.volunteer_activities
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to automatically update volunteers_assigned count
CREATE OR REPLACE FUNCTION public.update_volunteers_assigned_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.volunteer_activities
    SET volunteers_assigned = volunteers_assigned + 1
    WHERE id = NEW.activity_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.volunteer_activities
    SET volunteers_assigned = GREATEST(0, volunteers_assigned - 1)
    WHERE id = OLD.activity_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update volunteer count
CREATE TRIGGER volunteer_assignment_count
  AFTER INSERT OR DELETE ON public.volunteer_assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_volunteers_assigned_count();
