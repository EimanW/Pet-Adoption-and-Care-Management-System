-- ============================================================================
-- Volunteer System RLS Policies
-- This migration ensures all necessary RLS policies are in place for the
-- volunteer registration, approval, and portal functionality.
-- ============================================================================

-- Section 1: Volunteers Table Policies
-- Ensure users can insert their own volunteer applications
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'volunteers' 
    AND policyname = 'Users can create volunteer application'
  ) THEN
    CREATE POLICY "Users can create volunteer application"
      ON public.volunteers FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Ensure users can update their own volunteer applications (before approval)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'volunteers' 
    AND policyname = 'Users can update their own volunteer application'
  ) THEN
    CREATE POLICY "Users can update their own volunteer application"
      ON public.volunteers FOR UPDATE
      USING (auth.uid() = user_id AND status = 'pending');
  END IF;
END $$;

-- Ensure admins can update volunteer applications (for approval/rejection)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'volunteers' 
    AND policyname = 'Admins can update volunteer applications'
  ) THEN
    CREATE POLICY "Admins can update volunteer applications"
      ON public.volunteers FOR UPDATE
      USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- Section 2: Volunteer Activities Table - Already created in previous migration
-- No additional policies needed

-- Section 3: Volunteer Assignments Table - Already created in previous migration
-- No additional policies needed

-- Section 4: Update approved_by field when admin approves
-- Create a trigger function to set approved_by and approved_at
CREATE OR REPLACE FUNCTION public.handle_volunteer_approval()
RETURNS TRIGGER AS $$
BEGIN
  -- When status changes to 'approved', set approved_by and approved_at
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    NEW.approved_by := auth.uid();
    NEW.approved_at := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists and recreate
DROP TRIGGER IF EXISTS on_volunteer_approval ON public.volunteers;
CREATE TRIGGER on_volunteer_approval
  BEFORE UPDATE ON public.volunteers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_volunteer_approval();

-- Section 5: Grant necessary permissions
GRANT SELECT, INSERT ON public.volunteers TO authenticated;
GRANT UPDATE ON public.volunteers TO authenticated;

-- ============================================================================
-- End of Volunteer System RLS Policies
-- ============================================================================
