-- Fix pet update policy to include WITH CHECK clause
-- This ensures the RLS policy allows updates to go through

DROP POLICY IF EXISTS "Admins can update pets" ON public.pets;

CREATE POLICY "Admins can update pets"
  ON public.pets FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Also add policies for vets to manage pets if needed
CREATE POLICY "Vets can update pets"
  ON public.pets FOR UPDATE
  USING (public.has_role(auth.uid(), 'vet'))
  WITH CHECK (public.has_role(auth.uid(), 'vet'));
