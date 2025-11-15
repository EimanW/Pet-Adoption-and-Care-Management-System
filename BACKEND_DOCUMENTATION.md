# Backend Documentation - Pet Adoption & Care Management System

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Database Schema](#database-schema)
3. [Tables & Relationships](#tables--relationships)
4. [Security & Row Level Security (RLS)](#security--row-level-security)
5. [API Usage Examples](#api-usage-examples)
6. [Custom Functions](#custom-functions)
7. [How to Add New Features](#how-to-add-new-features)
8. [Authentication & Authorization](#authentication--authorization)

---

## 🏗️ Architecture Overview

### Technology Stack
- **Backend**: Supabase (PostgreSQL + REST API + Real-time subscriptions)
- **Database**: PostgreSQL 15+
- **Authentication**: Supabase Auth (JWT-based)
- **Storage**: Supabase Storage (for images)
- **Real-time**: WebSocket connections for live updates

### File Structure
```
supabase/
├── config.toml                          # Supabase project configuration
└── migrations/
    ├── 20251108180506_*.sql            # Main database schema (368 lines)
    ├── 20251108180547_*.sql            # Additional setup
    └── 20251109000000_vet_adoption_permissions.sql  # Vet permissions

src/integrations/supabase/
├── client.ts                            # Supabase client connection
└── types.ts                             # TypeScript database types
```

---

## 🗄️ Database Schema

### ER Diagram (Text Representation)
```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   profiles  │────────▶│  user_roles  │         │    pets     │
│             │         │              │         │             │
│ - id (PK)   │         │ - user_id    │         │ - id (PK)   │
│ - email     │         │ - role       │         │ - name      │
│ - phone     │         └──────────────┘         │ - species   │
└─────────────┘                                  │ - status    │
                                                 └──────┬──────┘
                                                        │
                    ┌───────────────────────────────────┼────────────┐
                    │                                   │            │
         ┌──────────▼─────────┐              ┌─────────▼────────┐   │
         │ adoption_applications│              │  pet_feedback   │   │
         │                    │              │                  │   │
         │ - id (PK)          │              │ - id (PK)        │   │
         │ - pet_id (FK)      │              │ - pet_id (FK)    │   │
         │ - user_id (FK)     │              │ - rating         │   │
         │ - status           │              │ - comment        │   │
         └────────────────────┘              └──────────────────┘   │
                                                                     │
         ┌────────────────────┐              ┌────────────────────┐ │
         │  medical_records   │◀─────────────┤ vet_appointments   │◀┘
         │                    │              │                    │
         │ - id (PK)          │              │ - id (PK)          │
         │ - pet_id (FK)      │              │ - pet_id (FK)      │
         │ - record_type      │              │ - user_id (FK)     │
         │ - date             │              │ - appointment_date │
         └────────────────────┘              └────────────────────┘
```

---

## 📊 Tables & Relationships

### 1. **User Management**

#### `profiles` Table
Stores user profile information.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | User ID (references auth.users) |
| `first_name` | TEXT | User's first name |
| `last_name` | TEXT | User's last name |
| `email` | TEXT | User's email address |
| `phone` | TEXT | Contact phone number |
| `avatar_url` | TEXT | Profile picture URL |
| `created_at` | TIMESTAMPTZ | Account creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

**Relationships:**
- One-to-One with `auth.users`
- One-to-Many with `adoption_applications`
- One-to-Many with `pet_feedback`

---

#### `user_roles` Table
Manages user permissions and roles.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Role assignment ID |
| `user_id` | UUID (FK) | References profiles.id |
| `role` | app_role ENUM | 'user', 'admin', 'vet', 'volunteer' |
| `created_at` | TIMESTAMPTZ | When role was assigned |

**UNIQUE Constraint:** `(user_id, role)` - Users can't have duplicate roles

---

### 2. **Pet Management**

#### `pets` Table
Central table for all pet information.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Unique pet identifier |
| `name` | TEXT | Pet's name |
| `species` | TEXT | Dog, Cat, Bird, etc. |
| `breed` | TEXT | Specific breed |
| `age` | INTEGER | Age in years |
| `gender` | TEXT | Male/Female |
| `size` | TEXT | Small/Medium/Large |
| `color` | TEXT | Fur/feather color |
| `description` | TEXT | Full description |
| `personality` | TEXT[] | Array of traits |
| `health_status` | TEXT | Current health condition |
| `vaccination_status` | TEXT | Vaccination records |
| `spayed_neutered` | BOOLEAN | Sterilization status |
| `good_with_kids` | BOOLEAN | Child-friendly flag |
| `good_with_pets` | BOOLEAN | Pet-friendly flag |
| `energy_level` | TEXT | Low/Medium/High |
| `image_url` | TEXT | Pet photo URL |
| `status` | TEXT | 'available', 'pending', 'adopted' |
| `arrival_date` | DATE | When pet joined shelter |
| `created_at` | TIMESTAMPTZ | Record creation time |
| `updated_at` | TIMESTAMPTZ | Last update time |

**Relationships:**
- One-to-Many with `adoption_applications`
- One-to-Many with `medical_records`
- One-to-Many with `vet_appointments`
- One-to-Many with `pet_feedback`

---

### 3. **Adoption System**

#### `adoption_applications` Table
Tracks all adoption requests and their status.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Application ID |
| `pet_id` | UUID (FK) | References pets.id |
| `user_id` | UUID (FK) | References auth.users.id |
| `status` | TEXT | 'pending', 'under_review', 'approved', 'rejected' |
| `home_type` | TEXT | House, Apartment, etc. |
| `has_yard` | BOOLEAN | Outdoor space availability |
| `has_other_pets` | BOOLEAN | Other pets in home |
| `has_children` | BOOLEAN | Children in household |
| `experience` | TEXT | Previous pet ownership experience |
| `reason` | TEXT | Why they want to adopt |
| `submitted_at` | TIMESTAMPTZ | Application submission time |
| `reviewed_at` | TIMESTAMPTZ | When reviewed by admin/vet |
| `reviewed_by` | UUID (FK) | Who reviewed (admin/vet ID) |
| `admin_notes` | TEXT | Internal notes from reviewer |

**Status Flow:**
```
pending → under_review → approved/rejected
```

---

#### `pet_feedback` Table
Reviews from adopters about their adopted pets.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Feedback ID |
| `pet_id` | UUID (FK) | References pets.id |
| `user_id` | UUID (FK) | References auth.users.id |
| `adoption_application_id` | UUID (FK) | References adoption_applications.id |
| `rating` | INTEGER | 1-5 star rating (CHECK constraint) |
| `comment` | TEXT | Feedback text |
| `created_at` | TIMESTAMPTZ | When feedback was submitted |
| `updated_at` | TIMESTAMPTZ | Last update time |

**UNIQUE Constraint:** `(adoption_application_id)` - One feedback per adoption

---

### 4. **Medical & Veterinary**

#### `medical_records` Table
Stores complete medical history for each pet.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Record ID |
| `pet_id` | UUID (FK) | References pets.id |
| `record_type` | TEXT | Vaccination, Treatment, Surgery, etc. |
| `description` | TEXT | Details of the medical event |
| `date` | DATE | When the event occurred |
| `veterinarian` | TEXT | Vet's name |
| `notes` | TEXT | Additional notes |
| `created_at` | TIMESTAMPTZ | Record creation time |

---

#### `vet_appointments` Table
Scheduled veterinary appointments.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Appointment ID |
| `pet_id` | UUID (FK) | References pets.id |
| `user_id` | UUID (FK) | References auth.users.id (optional) |
| `appointment_date` | TIMESTAMPTZ | Scheduled date and time |
| `reason` | TEXT | Purpose of visit |
| `status` | TEXT | 'scheduled', 'completed', 'cancelled' |
| `notes` | TEXT | Appointment notes |
| `created_at` | TIMESTAMPTZ | Record creation time |

---

### 5. **Community Features**

#### `volunteers` Table
Volunteer applications and management.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Volunteer record ID |
| `user_id` | UUID (FK) | References auth.users.id |
| `availability` | TEXT[] | Available days/times |
| `skills` | TEXT[] | Relevant skills |
| `experience` | TEXT | Previous volunteer experience |
| `status` | TEXT | 'pending', 'approved', 'active' |
| `application_date` | TIMESTAMPTZ | When they applied |
| `approved_at` | TIMESTAMPTZ | Approval timestamp |
| `approved_by` | UUID (FK) | Admin who approved |

---

#### `donations` Table
Tracks monetary and item donations.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Donation ID |
| `user_id` | UUID (FK) | References auth.users.id (nullable) |
| `donation_type` | TEXT | 'monetary', 'supplies', 'food', etc. |
| `amount` | DECIMAL | Money amount (if monetary) |
| `items` | TEXT | Description of donated items |
| `status` | TEXT | 'pending', 'received', 'acknowledged' |
| `created_at` | TIMESTAMPTZ | Donation timestamp |

---

#### `user_favorites` Table
Users' saved/favorite pets.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Favorite record ID |
| `user_id` | UUID (FK) | References auth.users.id |
| `pet_id` | UUID (FK) | References pets.id |
| `created_at` | TIMESTAMPTZ | When favorited |

**UNIQUE Constraint:** `(user_id, pet_id)` - Can't favorite same pet twice

---

## 🔒 Security & Row Level Security (RLS)

All tables have **Row Level Security (RLS)** enabled to ensure data privacy.

### Security Principles
1. **Users can only see their own data** (unless they're admin/vet)
2. **Public data** (like available pets) is visible to everyone
3. **Role-based access** for admins and vets
4. **Authenticated users only** for creating records

### Key Security Function

```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
```
This function checks if a user has a specific role. Used throughout RLS policies.

---

### RLS Policies by Table

#### `profiles` Table
```sql
-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

---

#### `user_roles` Table
```sql
-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);
```
**Note:** Only system can assign roles (no INSERT policy for users)

---

#### `pets` Table
```sql
-- Anyone can view available pets
CREATE POLICY "Anyone can view available pets"
  ON public.pets FOR SELECT
  USING (true);

-- Admins can insert pets
CREATE POLICY "Admins can insert pets"
  ON public.pets FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update pets
CREATE POLICY "Admins can update pets"
  ON public.pets FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete pets
CREATE POLICY "Admins can delete pets"
  ON public.pets FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));
```

---

#### `adoption_applications` Table
```sql
-- Users can view their own applications
CREATE POLICY "Users can view their own applications"
  ON public.adoption_applications FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all applications
CREATE POLICY "Admins can view all applications"
  ON public.adoption_applications FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Vets can view all applications
CREATE POLICY "Vets can view all adoption applications"
  ON public.adoption_applications FOR SELECT
  USING (public.has_role(auth.uid(), 'vet'));

-- Users can create applications
CREATE POLICY "Users can create applications"
  ON public.adoption_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can update applications
CREATE POLICY "Admins can update applications"
  ON public.adoption_applications FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Vets can update applications
CREATE POLICY "Vets can update adoption applications"
  ON public.adoption_applications FOR UPDATE
  USING (public.has_role(auth.uid(), 'vet'));
```

---

#### `pet_feedback` Table
```sql
-- Anyone can view feedback (public reviews)
CREATE POLICY "Anyone can view feedback"
  ON public.pet_feedback FOR SELECT
  USING (true);

-- Admins and vets can view all feedback
CREATE POLICY "Admins and vets can view all feedback"
  ON public.pet_feedback FOR SELECT
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'vet')
  );

-- Users can create feedback for their approved adoptions
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

-- Users can update their own feedback
CREATE POLICY "Users can update their own feedback"
  ON public.pet_feedback FOR UPDATE
  USING (auth.uid() = user_id);
```

---

#### `medical_records` Table
```sql
-- Vets and admins can view medical records
CREATE POLICY "Vets and admins can view medical records"
  ON public.medical_records FOR SELECT
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'vet')
  );

-- Vets and admins can create medical records
CREATE POLICY "Vets and admins can create medical records"
  ON public.medical_records FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'vet')
  );
```

---

#### `vet_appointments` Table
```sql
-- Users can view their own appointments
CREATE POLICY "Users can view their own appointments"
  ON public.vet_appointments FOR SELECT
  USING (auth.uid() = user_id);

-- Vets and admins can view all appointments
CREATE POLICY "Vets and admins can view all appointments"
  ON public.vet_appointments FOR SELECT
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'vet')
  );

-- Users can create appointments
CREATE POLICY "Users can create appointments"
  ON public.vet_appointments FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

---

#### `volunteers` Table
```sql
-- Users can view their own volunteer application
CREATE POLICY "Users can view their own volunteer application"
  ON public.volunteers FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all volunteer applications
CREATE POLICY "Admins can view all volunteer applications"
  ON public.volunteers FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Users can create volunteer applications
CREATE POLICY "Users can create volunteer applications"
  ON public.volunteers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can update volunteer applications
CREATE POLICY "Admins can update volunteer applications"
  ON public.volunteers FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));
```

---

#### `donations` Table
```sql
-- Users can view their own donations
CREATE POLICY "Users can view their own donations"
  ON public.donations FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Admins can view all donations
CREATE POLICY "Admins can view all donations"
  ON public.donations FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Anyone can create donations
CREATE POLICY "Anyone can create donations"
  ON public.donations FOR INSERT
  WITH CHECK (true);
```

---

#### `user_favorites` Table
```sql
-- Users can view their own favorites
CREATE POLICY "Users can view their own favorites"
  ON public.user_favorites FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create favorites
CREATE POLICY "Users can create favorites"
  ON public.user_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favorites
CREATE POLICY "Users can delete their own favorites"
  ON public.user_favorites FOR DELETE
  USING (auth.uid() = user_id);
```

---

## 🔧 Custom Functions

### 1. `handle_updated_at()` Trigger Function
Automatically updates the `updated_at` timestamp on record changes.

```sql
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Applied to:**
- `profiles` table
- `pets` table
- `pet_feedback` table

---

### 2. `handle_new_user()` Trigger Function
Automatically creates profile and assigns default role when user signs up.

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
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

-- Trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**What it does:**
1. When a new user signs up
2. Automatically creates their profile in `profiles` table
3. Assigns them the 'user' role in `user_roles` table

---

### 3. `has_role()` Security Function
Checks if a user has a specific role (used in RLS policies).

```sql
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
```

**Usage in policies:**
```sql
USING (public.has_role(auth.uid(), 'admin'))
```

---

## 💻 API Usage Examples

### Frontend Connection Setup

```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
```

---

### Common Query Patterns

#### 1. **Fetch All Available Pets**
```typescript
const { data: pets, error } = await supabase
  .from('pets')
  .select('*')
  .eq('status', 'available')
  .order('created_at', { ascending: false });
```

---

#### 2. **Fetch Pet with Related Data**
```typescript
const { data: pet, error } = await supabase
  .from('pets')
  .select(`
    *,
    medical_records (*),
    pet_feedback (
      *,
      profiles (first_name, last_name)
    )
  `)
  .eq('id', petId)
  .single();
```

---

#### 3. **Create Adoption Application**
```typescript
const { data, error } = await supabase
  .from('adoption_applications')
  .insert({
    pet_id: 'uuid-here',
    user_id: user.id,
    home_type: 'House',
    has_yard: true,
    has_other_pets: false,
    has_children: true,
    experience: 'Owned dogs for 10 years',
    reason: 'Looking for a family companion',
    status: 'pending'
  });
```

---

#### 4. **Get User's Adoption Applications**
```typescript
const { data: applications, error } = await supabase
  .from('adoption_applications')
  .select(`
    *,
    pets (name, species, image_url),
    profiles (first_name, last_name, email)
  `)
  .eq('user_id', user.id)
  .order('submitted_at', { ascending: false });
```

---

#### 5. **Admin: Approve Adoption Application**
```typescript
const { data, error } = await supabase
  .from('adoption_applications')
  .update({ 
    status: 'approved',
    reviewed_at: new Date().toISOString(),
    reviewed_by: adminUserId,
    admin_notes: 'Great applicant!'
  })
  .eq('id', applicationId);
```

---

#### 6. **Submit Pet Feedback**
```typescript
const { data, error } = await supabase
  .from('pet_feedback')
  .insert({
    pet_id: 'uuid-here',
    user_id: user.id,
    adoption_application_id: 'application-uuid',
    rating: 5,
    comment: 'Amazing pet! Very friendly and well-behaved.'
  });
```

---

#### 7. **Vet: View All Pending Applications**
```typescript
const { data: applications, error } = await supabase
  .from('adoption_applications')
  .select(`
    *,
    pets (
      id, name, species, breed, age, health_status
    ),
    profiles (
      first_name, last_name, email, phone
    )
  `)
  .eq('status', 'pending')
  .order('submitted_at', { ascending: false });
```

---

#### 8. **Real-time Subscriptions**
```typescript
// Listen for new feedbacks in real-time
const feedbackSubscription = supabase
  .channel('pet_feedback_changes')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'pet_feedback'
    },
    (payload) => {
      console.log('New feedback received:', payload.new);
      // Update your UI
    }
  )
  .subscribe();

// Don't forget to unsubscribe when component unmounts
return () => {
  feedbackSubscription.unsubscribe();
};
```

---

#### 9. **Complex Filtering**
```typescript
const { data: pets, error } = await supabase
  .from('pets')
  .select('*')
  .eq('status', 'available')
  .eq('good_with_kids', true)
  .in('species', ['Dog', 'Cat'])
  .gte('age', 1)
  .lte('age', 5)
  .order('created_at', { ascending: false });
```

---

#### 10. **Check User Role**
```typescript
const { data: userRoles } = await supabase
  .from('user_roles')
  .select('role')
  .eq('user_id', user.id);

const isAdmin = userRoles?.some(r => r.role === 'admin');
const isVet = userRoles?.some(r => r.role === 'vet');
```

---

## 🔐 Authentication & Authorization

### User Sign Up
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password',
  options: {
    data: {
      first_name: 'John',
      last_name: 'Doe'
    }
  }
});
// This automatically triggers handle_new_user() function
```

---

### User Sign In
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure-password'
});
```

---

### Get Current User
```typescript
const { data: { user } } = await supabase.auth.getUser();
```

---

### Sign Out
```typescript
const { error } = await supabase.auth.signOut();
```

---

## 🚀 How to Add New Features

### Step 1: Create a Migration File
Create a new SQL file in `supabase/migrations/` with naming convention:
```
YYYYMMDDHHmmss_descriptive_name.sql
```

Example: `20251115120000_add_pet_events_table.sql`

---

### Step 2: Write Your SQL Schema
```sql
-- Example: Adding a pet events table

CREATE TABLE public.pet_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  event_date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.pet_events ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Anyone can view pet events"
  ON public.pet_events FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage pet events"
  ON public.pet_events FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));
```

---

### Step 3: Apply Migration
If using Supabase CLI:
```bash
supabase db push
```

Or apply manually through Supabase Dashboard → SQL Editor

---

### Step 4: Update TypeScript Types
Regenerate types:
```bash
supabase gen types typescript --project-id YOUR_PROJECT_ID > src/integrations/supabase/types.ts
```

---

### Step 5: Use in Frontend
```typescript
// Fetch pet events
const { data: events, error } = await supabase
  .from('pet_events')
  .select('*')
  .eq('pet_id', petId)
  .order('event_date', { ascending: false });

// Create pet event
const { data, error } = await supabase
  .from('pet_events')
  .insert({
    pet_id: 'uuid-here',
    event_type: 'Birthday',
    event_date: '2025-01-15',
    description: 'First birthday celebration!'
  });
```

---

## 📚 Best Practices

### 1. **Always Use RLS**
Never disable Row Level Security. Always define explicit policies.

### 2. **Use Transactions for Related Operations**
```typescript
const { data, error } = await supabase.rpc('approve_adoption', {
  application_id: 'uuid',
  admin_id: 'uuid'
});
```

### 3. **Handle Errors Properly**
```typescript
const { data, error } = await supabase.from('pets').select('*');
if (error) {
  console.error('Database error:', error.message);
  // Show user-friendly message
  return;
}
// Process data
```

### 4. **Use Indexes for Performance**
```sql
CREATE INDEX idx_pets_status ON public.pets(status);
CREATE INDEX idx_applications_user ON public.adoption_applications(user_id);
```

### 5. **Validate Data on Both Client and Server**
Use PostgreSQL constraints:
```sql
CHECK (rating >= 1 AND rating <= 5)
CHECK (age > 0)
```

---

## 🔍 Troubleshooting

### Common Issues

#### 1. **RLS Policy Blocking Query**
**Error:** "new row violates row-level security policy"

**Solution:** Check that the user has the required role or ownership:
```sql
-- Check user's roles
SELECT * FROM user_roles WHERE user_id = 'user-uuid';

-- Check policy conditions
SELECT * FROM pg_policies WHERE tablename = 'your_table';
```

---

#### 2. **Foreign Key Violation**
**Error:** "violates foreign key constraint"

**Solution:** Ensure referenced record exists:
```typescript
// Check if pet exists before creating application
const { data: pet } = await supabase
  .from('pets')
  .select('id')
  .eq('id', petId)
  .single();

if (!pet) {
  throw new Error('Pet not found');
}
```

---

#### 3. **Unique Constraint Violation**
**Error:** "duplicate key value violates unique constraint"

**Solution:** Check for existing records:
```typescript
const { data: existing } = await supabase
  .from('user_favorites')
  .select('id')
  .eq('user_id', userId)
  .eq('pet_id', petId)
  .single();

if (existing) {
  console.log('Already favorited');
  return;
}
```

---

## 📊 Database Monitoring

### View Active Connections
```sql
SELECT * FROM pg_stat_activity;
```

### Check Table Sizes
```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### View Slow Queries
Enable in Supabase Dashboard → Database → Query Performance

---

## 🎯 Next Steps

1. **Add More Complex Features:**
   - Pet matching algorithm (stored procedure)
   - Automated email notifications (Edge Functions)
   - Payment processing for donations
   - Messaging system between adopters and admins

2. **Performance Optimization:**
   - Add database indexes
   - Implement caching
   - Use database views for complex queries

3. **Advanced Security:**
   - IP-based rate limiting
   - Audit logging
   - Multi-factor authentication

4. **Analytics:**
   - Track adoption success rates
   - Popular pet types
   - User engagement metrics

---

## 📖 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Migrations](https://supabase.com/docs/guides/cli/local-development#database-migrations)

---

## 👥 Support

For questions or issues:
- Team: Eiman Wasim, Syeda Afnan Hussain, Arooj Abrar
- Trello Board: [View Project Tasks](https://trello.com/invite/b/68e5d0351062a607dc4d8249/ATTI7c69d354f3c40500010cae01540ca014F47BA30B/pet-management-system)
- GitHub: [Repository](https://github.com/EimanW/Pet-Adoption-and-Care-Management-System)

---

**Last Updated:** November 15, 2025
**Backend Version:** 1.0.0
**Database Schema Version:** Migration 20251109000000
