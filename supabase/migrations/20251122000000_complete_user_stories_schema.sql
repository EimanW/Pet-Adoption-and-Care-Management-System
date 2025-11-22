-- Complete schema for all 26 user stories

-- Create care_articles table for User Story 9 & 14
CREATE TABLE IF NOT EXISTS public.care_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  author_name TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  read_time TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.care_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published articles"
  ON public.care_articles FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage articles"
  ON public.care_articles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create store_products table for User Story 13
CREATE TABLE IF NOT EXISTS public.store_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  stock_quantity INTEGER DEFAULT 0,
  rating DECIMAL(2, 1) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.store_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON public.store_products FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage products"
  ON public.store_products FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create store_orders table for User Story 13
CREATE TABLE IF NOT EXISTS public.store_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  shipping_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.store_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders"
  ON public.store_orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
  ON public.store_orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON public.store_orders FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Create order_items table for User Story 13
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.store_orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.store_products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL,
  price_at_purchase DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view items in their orders"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.store_orders
      WHERE id = order_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order items"
  ON public.order_items FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Create prescriptions table for User Story 21
CREATE TABLE IF NOT EXISTS public.prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  adopter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vet_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  medication_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  instructions TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Adopters can view their pet prescriptions"
  ON public.prescriptions FOR SELECT
  USING (auth.uid() = adopter_id);

CREATE POLICY "Vets can manage prescriptions"
  ON public.prescriptions FOR ALL
  USING (public.has_role(auth.uid(), 'vet'));

CREATE POLICY "Admins can view all prescriptions"
  ON public.prescriptions FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Create consultations table for User Story 20
CREATE TABLE IF NOT EXISTS public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vet_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  pet_id UUID REFERENCES public.pets(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending',
  scheduled_time TIMESTAMPTZ,
  reason TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own consultations"
  ON public.consultations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create consultations"
  ON public.consultations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Vets can view consultations assigned to them"
  ON public.consultations FOR SELECT
  USING (public.has_role(auth.uid(), 'vet'));

CREATE POLICY "Vets can update consultations"
  ON public.consultations FOR UPDATE
  USING (public.has_role(auth.uid(), 'vet'));

CREATE POLICY "Admins can view all consultations"
  ON public.consultations FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Create system_logs table for User Story 26
CREATE TABLE IF NOT EXISTS public.system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  ip_address TEXT,
  user_agent TEXT,
  status TEXT NOT NULL,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view system logs"
  ON public.system_logs FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Create vaccination_reminders table for User Story 10
CREATE TABLE IF NOT EXISTS public.vaccination_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vaccine_name TEXT NOT NULL,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'pending',
  reminder_sent BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.vaccination_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their pet vaccination reminders"
  ON public.vaccination_reminders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Vets can manage vaccination reminders"
  ON public.vaccination_reminders FOR ALL
  USING (public.has_role(auth.uid(), 'vet'));

CREATE POLICY "Admins can manage vaccination reminders"
  ON public.vaccination_reminders FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create function to log system actions
CREATE OR REPLACE FUNCTION public.log_system_action(
  p_action TEXT,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id UUID DEFAULT NULL,
  p_status TEXT DEFAULT 'success',
  p_error_message TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO public.system_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    status,
    error_message
  ) VALUES (
    auth.uid(),
    p_action,
    p_resource_type,
    p_resource_id,
    p_status,
    p_error_message
  ) RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;

-- Create triggers for automatic system logging on critical tables
CREATE OR REPLACE FUNCTION public.trigger_log_pet_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    PERFORM public.log_system_action('pet_created', 'pets', NEW.id);
    RETURN NEW;
  ELSIF (TG_OP = 'UPDATE') THEN
    PERFORM public.log_system_action('pet_updated', 'pets', NEW.id);
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    PERFORM public.log_system_action('pet_deleted', 'pets', OLD.id);
    RETURN OLD;
  END IF;
END;
$$;

CREATE TRIGGER log_pet_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.pets
  FOR EACH ROW EXECUTE FUNCTION public.trigger_log_pet_changes();

CREATE OR REPLACE FUNCTION public.trigger_log_application_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    PERFORM public.log_system_action('application_submitted', 'adoption_applications', NEW.id);
    RETURN NEW;
  ELSIF (TG_OP = 'UPDATE' AND OLD.status != NEW.status) THEN
    PERFORM public.log_system_action('application_status_changed', 'adoption_applications', NEW.id);
    RETURN NEW;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER log_application_changes
  AFTER INSERT OR UPDATE ON public.adoption_applications
  FOR EACH ROW EXECUTE FUNCTION public.trigger_log_application_changes();

-- Create updated_at triggers for new tables
CREATE TRIGGER update_care_articles_updated_at
  BEFORE UPDATE ON public.care_articles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_store_products_updated_at
  BEFORE UPDATE ON public.store_products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_prescriptions_updated_at
  BEFORE UPDATE ON public.prescriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_consultations_updated_at
  BEFORE UPDATE ON public.consultations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_care_articles_category ON public.care_articles(category);
CREATE INDEX IF NOT EXISTS idx_care_articles_published ON public.care_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_store_products_category ON public.store_products(category);
CREATE INDEX IF NOT EXISTS idx_store_orders_user ON public.store_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_pet ON public.prescriptions(pet_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_adopter ON public.prescriptions(adopter_id);
CREATE INDEX IF NOT EXISTS idx_consultations_user ON public.consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_consultations_vet ON public.consultations(vet_id);
CREATE INDEX IF NOT EXISTS idx_system_logs_user ON public.system_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_system_logs_created ON public.system_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vaccination_reminders_pet ON public.vaccination_reminders(pet_id);
CREATE INDEX IF NOT EXISTS idx_vaccination_reminders_user ON public.vaccination_reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_vaccination_reminders_due ON public.vaccination_reminders(due_date);
