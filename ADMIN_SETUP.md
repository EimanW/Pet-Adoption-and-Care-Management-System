# Admin Panel Setup Guide

## Admin Login Credentials

**Single Admin Account:**
- Email: `admin@pawhaven.com`
- Password: `Admin@123456`

## Setting Up the Admin Account

### Step 1: Create the User Account
1. Go to your website's signup page (`/login`)
2. Click "Sign Up"
3. Enter the following details:
   - **Email**: `admin@pawhaven.com`
   - **Password**: `Admin@123456`
   - **First Name**: `Admin`
   - **Last Name**: `User`
4. Submit the signup form

### Step 2: Get the User ID
1. Open your Supabase Dashboard
2. Go to **Authentication > Users**
3. Find the user with email `admin@pawhaven.com`
4. Copy the **UUID** (looks like: `12345678-1234-1234-1234-123456789abc`)

### Step 3: Assign Admin Role
1. Open your Supabase Dashboard
2. Go to **SQL Editor**
3. Open the file `scripts/create-admin-account.sql`
4. Replace `YOUR_USER_ID_HERE` with the actual UUID you copied
5. Execute the query

Example:
```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

### Step 4: Verify Admin Role
Run the verification query from the script to confirm the role was assigned correctly.

### Step 5: Populate Database with Sample Pets (Optional)
1. In Supabase SQL Editor
2. Copy the contents of `scripts/add-sample-pets.sql`
3. Execute the script
4. This will create 12 sample pets with medical records

## Admin Panel Features

### Pet Management (Full CRUD)
✅ **Add New Pets** - Complete form with 16 fields
✅ **Edit Existing Pets** - Update any pet information
✅ **Delete Pets** - Remove pets with confirmation
✅ **View Pet Details** - See complete pet profiles
✅ **Status Management** - Update pet adoption status

### Pet Form Fields:
- Basic Info: Name, Species, Breed, Age, Gender, Size, Color
- Description: Detailed personality and behavior notes
- Health: Health Status, Vaccination Status, Spayed/Neutered
- Behavior: Good with Kids, Good with Pets, Energy Level
- Media: Image URL
- Status: Available, Under Review, Adopted, In Care

### Application Management
✅ View all adoption applications
✅ Approve or reject applications
✅ See applicant details and pet information
✅ View application submission dates

### Feedback Management
✅ View all user feedback and ratings
✅ See which pets received feedback
✅ Monitor user comments

### User Management
✅ View all registered users
✅ See user roles (user, admin, vet, volunteer)
✅ Monitor user join dates

### System Activity
✅ View system logs
✅ Monitor user actions
✅ Track pet updates

## Access Control

- Only users with `admin` role can access the admin panel
- Non-admin users are automatically redirected to home page
- All admin actions are logged in the `system_logs` table
- Row Level Security (RLS) policies enforce admin-only write access

## Database Tables Used

- `pets` - Pet listings and information
- `adoption_applications` - User adoption requests
- `pet_feedback` - User ratings and comments
- `profiles` - User profile information
- `user_roles` - Role assignments
- `system_logs` - Activity tracking

## Next Steps

After setting up the admin account and sample data:

1. Login at `/login` with admin credentials
2. Navigate to `/admin` to access the admin panel
3. Test adding a new pet
4. Test editing an existing pet
5. Test deleting a pet
6. Review applications, feedback, and system logs
