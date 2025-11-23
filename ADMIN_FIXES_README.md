# Admin Panel Fixes

## Problem
The admin panel cannot see:
- Pending adoption applications
- Volunteer applications  
- Vet appointments
- Donations
- Pet feedbacks
- Cannot update/manage these items

## Root Cause
Row Level Security (RLS) policies are missing proper permissions for admin role. Specifically:
1. Missing `WITH CHECK` clauses on UPDATE policies
2. Missing admin access on SELECT policies
3. Some policies use wrong authentication checks

## Solution

### Step 1: Run SQL Fixes
1. Open your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Open the file: `CRITICAL_FIXES_NEEDED.sql`
5. Copy ALL contents and paste into SQL Editor
6. Click **RUN** button
7. Wait for "Success" message

### Step 2: Verify Fixes
After running SQL, refresh your admin panel and check:

#### ✅ Applications Tab
- Should show all adoption applications (not just empty)
- Can approve/reject applications
- See applicant details

#### ✅ Volunteers Tab  
- Should show all volunteer applications
- Can approve/reject volunteers
- See volunteer skills and availability

#### ✅ More Tab
- **Donations section**: See all donations with amounts
- **Feedbacks section**: See all pet feedbacks with ratings
- **Appointments section**: See all vet appointments
- **Orders section**: See all store orders

#### ✅ Pets Tab
- Can edit pet information (changes should persist)
- Can add new pets
- Can delete pets

#### ✅ Resources Tab
- Can add/edit care articles
- Can delete articles

#### ✅ Store Tab
- Can add/edit products
- Can delete products
- Can update stock levels

### Step 3: Test Admin Actions
1. **Test Adoption Application**: 
   - Go to Applications tab
   - Click "Approve" on a pending application
   - Should change status to "Approved"

2. **Test Pet Edit**:
   - Go to Pets tab
   - Click "Edit" on any pet
   - Change the name or description
   - Click "Update Pet"
   - Refresh page - changes should persist

3. **Test Volunteer Management**:
   - Go to Volunteers tab
   - Approve a pending volunteer
   - Status should update

## What the SQL Does

The `CRITICAL_FIXES_NEEDED.sql` file:

1. **Fixes Adoption Applications** - Adds admin read/write access
2. **Fixes Pet Updates** - Adds WITH CHECK clause for admin updates
3. **Fixes Profile Creation** - Allows new users to create profiles
4. **Fixes Auto-Profile Trigger** - Creates profiles automatically on signup
5. **Fixes Volunteers** - Adds admin read/write/update access
6. **Fixes Appointments** - Adds admin and vet read/write access
7. **Fixes Donations** - Adds admin read access to all donations
8. **Fixes Feedbacks** - Adds admin read access to all feedback
9. **Fixes Store Products** - Adds admin CRUD access
10. **Fixes Store Orders** - Adds admin read/update access
11. **Fixes Care Articles** - Adds admin CRUD access

## Console Debugging

I've added detailed console logging to help diagnose issues. After running the SQL:

1. Open browser DevTools (F12)
2. Go to Console tab
3. Refresh admin panel
4. Look for logs like:
   ```
   Fetching applications as admin...
   Current user ID: <your-user-id>
   User role check: { role: 'admin' }
   Applications fetch result: { count: 5, dataLength: 5, ... }
   Successfully loaded 5 applications
   ```

If you see errors in console, copy and paste them for further debugging.

## Still Having Issues?

If admin panel still doesn't work after running SQL:

1. **Verify Admin Role**: 
   - Open Supabase Dashboard
   - Go to Table Editor → user_roles
   - Find your user ID
   - Ensure role is set to 'admin'

2. **Check Function Exists**:
   - Go to SQL Editor
   - Run: `SELECT has_role('your-user-id', 'admin');`
   - Should return TRUE

3. **Check RLS is Enabled**:
   - Go to Table Editor
   - Click on adoption_applications table
   - Verify "Enable RLS" is checked

4. **Clear Cache**:
   - Hard refresh browser (Ctrl+Shift+R)
   - Clear browser cache
   - Sign out and sign back in

## Next Steps After Fix

Once admin panel is working:

1. Review and approve pending adoption applications
2. Manage volunteer applications  
3. Add sample pets if database is empty (use "Add Sample Pets" button in More tab)
4. Configure OAuth providers (Google, Facebook) in Supabase Dashboard → Authentication → Providers
5. Test all admin features thoroughly
