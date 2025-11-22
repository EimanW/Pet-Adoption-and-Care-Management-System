# How to Populate Your Database with Pets

## Why You Don't See Any Pets

Your frontend is working correctly, but the Supabase database is empty! You need to:
1. Apply the database migrations
2. Add sample pet data

## Option 1: Use Supabase Studio (Recommended - Easiest)

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**: `ooczxggfkyykfvbqhtuy`
3. **Navigate to SQL Editor** (left sidebar)
4. **Create a new query**
5. **Copy and paste** the contents of `scripts/add-sample-pets.sql`
6. **Run the query** (click "Run" or press Ctrl+Enter)

This will add 12 sample pets with medical records to your database!

## Option 2: Apply All Migrations (Complete Setup)

If you haven't applied the migrations yet:

1. **Open Supabase SQL Editor**
2. **Run each migration file in order**:
   - First: `supabase/migrations/20251108180506_5dff941d-4066-42c1-898c-67534775a437.sql`
   - Second: `supabase/migrations/20251108180547_4ef73499-75fc-410f-a3f5-4f215dcb7bf9.sql`
   - Third: `supabase/migrations/20251109000000_vet_adoption_permissions.sql`
   - Fourth: `supabase/migrations/20251122000000_complete_user_stories_schema.sql`
   - Fifth: `supabase/migrations/20251122000001_seed_data.sql`
   - Finally: `scripts/add-sample-pets.sql`

## Option 3: Use Supabase CLI (Advanced)

If you have Supabase CLI installed:

```bash
# Make sure you're logged in
supabase login

# Link to your project
supabase link --project-ref ooczxggfkyykfvbqhtyu

# Push migrations
supabase db push

# Then run the sample pets script manually via Supabase Studio
```

## Option 4: Add Pets Through Admin Panel

1. **Create an admin account**:
   - Sign up at http://localhost:8080/login
   - Get your user ID from Supabase Dashboard → Authentication → Users
   - In Supabase SQL Editor, run:
   ```sql
   INSERT INTO user_roles (user_id, role) 
   VALUES ('YOUR_USER_ID_HERE', 'admin');
   ```
2. **Visit Admin Panel**: http://localhost:8080/admin
3. **Click "Add New Pet"** and fill in the form manually

## Quick Test (Fastest Method!)

**Just run this in Supabase SQL Editor**:

```sql
-- Quick single pet for testing
INSERT INTO public.pets (name, species, breed, age, gender, size, description, image_url, status) VALUES
('Max', 'dog', 'Golden Retriever', 3, 'male', 'large', 'Friendly golden retriever looking for a loving home!', 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=600', 'available');
```

Then refresh your pets page!

## After Adding Pets

1. Refresh http://localhost:8080/pets
2. You should see the pets appear
3. Try the search and filters
4. Click on a pet to see details
5. Click the heart to favorite (requires login)

## Troubleshooting

**Still not seeing pets?**
- Check browser console for errors (F12)
- Verify Supabase connection in `src/integrations/supabase/client.ts`
- Make sure Row Level Security policies are set up (migrations should do this)
- Check that the `pets` table exists in Supabase Dashboard → Table Editor

**Getting permission errors?**
- The RLS policy "Anyone can view available pets" should allow public access
- Check in Supabase Dashboard → Authentication → Policies
- Verify the `pets` table has the policy enabled
