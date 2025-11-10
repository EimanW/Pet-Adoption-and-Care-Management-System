-- Add policy for vets to view adoption applications
CREATE POLICY "Vets can view all adoption applications"
  ON public.adoption_applications FOR SELECT
  USING (public.has_role(auth.uid(), 'vet'));

-- Add policy for vets to update adoption applications
CREATE POLICY "Vets can update adoption applications"
  ON public.adoption_applications FOR UPDATE
  USING (public.has_role(auth.uid(), 'vet'));

-- Add policy for admins and vets to view feedbacks
CREATE POLICY "Admins and vets can view all feedback"
  ON public.pet_feedback FOR SELECT
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'vet')
  );
