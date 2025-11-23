# Quick Start: Testing Volunteer System (5 Minutes)

## Prerequisites
- Dev server running on http://localhost:8080
- Admin account credentials
- Supabase database access

---

## Step 1: Apply Database Migration (30 seconds)

### Option A: Via Supabase Dashboard
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Paste contents of `supabase/migrations/20251201000000_volunteer_system_policies.sql`
4. Click "Run"

### Option B: Via Supabase CLI
```powershell
cd c:\Pet-Adoption-and-Care-Management-System-master-2
supabase db push
```

---

## Step 2: Create Sample Volunteer Activity (1 minute)

Open Supabase SQL Editor and run:

```sql
-- Create a sample activity for testing
INSERT INTO volunteer_activities (
  title, 
  description, 
  date, 
  time, 
  location, 
  volunteers_needed,
  status
) VALUES (
  'Weekend Dog Walking',
  'Help walk and socialize our shelter dogs at the local park',
  CURRENT_DATE + INTERVAL '7 days',
  '10:00 AM - 12:00 PM',
  'Central Park - Main Entrance',
  5,
  'open'
);

-- Verify it was created
SELECT * FROM volunteer_activities;
```

---

## Step 3: Test Volunteer Registration (1 minute)

1. **Open**: http://localhost:8080/login
2. **Click**: "Sign Up" tab
3. **Select**: "Volunteer" from "I want to sign up as" dropdown
4. **Fill out**:
   - First Name: `Test`
   - Last Name: `Volunteer`
   - Email: `volunteer@test.com`
   - Phone: `555-123-4567`
   - Password: `password123`
   - Confirm Password: `password123`
   - **Availability**: `Weekends, 9am-5pm`
   - **Skills**: `Animal care, Dog walking, Event coordination`
   - **Experience**: `Previous shelter volunteer for 2 years`
5. **Click**: "Create Account"

**Expected Result**:
- Success message: "Your volunteer application is pending approval"
- Redirect to `/volunteer-portal`
- Status shows "pending"
- Application date displayed

---

## Step 4: Test Admin Approval (1 minute)

1. **Logout**: Click logout in volunteer portal
2. **Login**: Use admin credentials at http://localhost:8080/login
3. **Verify**: Auto-redirect to `/admin`
4. **Click**: "Volunteers" tab
5. **Verify**: See "Test Volunteer" with:
   - Email: volunteer@test.com
   - Skills: Animal care, Dog walking, Event coordination
   - Availability: Weekends, 9am-5pm
   - Status badge: "pending"
6. **Click**: "Approve" button

**Expected Result**:
- Success toast: "Volunteer approved successfully"
- Status badge changes to "approved"
- Approve/Reject buttons disappear

---

## Step 5: Test Volunteer Portal (1 minute)

1. **Logout**: From admin panel
2. **Login**: As volunteer (volunteer@test.com / password123)
3. **Verify**: Auto-redirect to `/volunteer-portal`
4. **Check Status Card**:
   - Status: "approved" (green badge)
   - Application Date: Today
   - Approved Date: Today
   - Availability: Weekends, 9am-5pm
   - Skills: Animal care, Dog walking, Event coordination
5. **Check Stats**:
   - Available Activities: 1
   - Upcoming Activities: 0
   - Completed Activities: 0
6. **Click**: "Available Activities" tab
7. **Verify**: See "Weekend Dog Walking" activity
8. **Click**: "Sign Up" button

**Expected Result**:
- Success toast: "You've been signed up for this activity!"
- Activity appears in "My Activities" tab
- Stats update: Upcoming Activities: 1

9. **Switch to**: "My Activities" tab
10. **Click**: "Mark Complete" button

**Expected Result**:
- Success toast: "Activity marked as completed!"
- Activity disappears from "My Activities"
- Activity appears in "Completed" tab
- Stats update: Completed Activities: 1

---

## Step 6: Test Admin Role Change (1 minute)

1. **Logout**: From volunteer portal
2. **Login**: As admin
3. **Click**: "Users" tab (in admin panel)
4. **Find**: "Test Volunteer" in user list
5. **Click**: Role dropdown (currently shows "Volunteer")
6. **Select**: "User"

**Expected Result**:
- Success toast: "User role updated successfully"
- Role updates in list

7. **Logout and re-login**: As volunteer@test.com
8. **Verify**: Redirects to `/dashboard` (not volunteer portal)
9. **Change back**: Admin changes role back to "Volunteer"
10. **Login again**: Should redirect to `/volunteer-portal`

---

## Troubleshooting

### Issue: Migration fails
**Solution**: 
- Check if migration already ran
- Verify Supabase connection
- Check for syntax errors in SQL

### Issue: Can't see volunteer in admin panel
**Solution**:
- Refresh the page
- Check browser console for errors
- Verify volunteer was created in database:
  ```sql
  SELECT * FROM volunteers ORDER BY application_date DESC LIMIT 5;
  ```

### Issue: Can't see activities in volunteer portal
**Solution**:
- Verify activity was created:
  ```sql
  SELECT * FROM volunteer_activities WHERE status = 'open';
  ```
- Check date is in future
- Verify RLS policies:
  ```sql
  SELECT * FROM volunteer_activities; -- As admin
  ```

### Issue: Role change doesn't work
**Solution**:
- Logout and login again
- Check user_roles table:
  ```sql
  SELECT * FROM user_roles WHERE user_id = 'USER_ID_HERE';
  ```

---

## Verification Checklist

After completing all steps, verify:

- [x] Volunteer can register with custom fields
- [x] Application appears in admin Volunteers tab
- [x] Admin can approve volunteer
- [x] Volunteer sees approved status
- [x] Volunteer can see available activities
- [x] Volunteer can sign up for activities
- [x] Volunteer can complete activities
- [x] Admin can change user roles
- [x] Role changes affect redirects

---

## Clean Up (Optional)

To remove test data:

```sql
-- Remove test volunteer assignment
DELETE FROM volunteer_assignments WHERE volunteer_id IN (
  SELECT id FROM auth.users WHERE email = 'volunteer@test.com'
);

-- Remove test volunteer
DELETE FROM volunteers WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'volunteer@test.com'
);

-- Remove test user role
DELETE FROM user_roles WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'volunteer@test.com'
);

-- Remove test profile
DELETE FROM profiles WHERE email = 'volunteer@test.com';

-- Remove test auth user (this will cascade delete everything)
-- CAUTION: This deletes the user account
-- DELETE FROM auth.users WHERE email = 'volunteer@test.com';

-- Remove test activity
DELETE FROM volunteer_activities WHERE title = 'Weekend Dog Walking';
```

---

## Success! 🎉

If all steps passed, the volunteer system is fully functional:
- ✅ Registration workflow
- ✅ Admin approval
- ✅ Volunteer portal
- ✅ Activity management
- ✅ Role management

**System is ready for production use!**

---

## Next: Real-World Usage

1. **Create real activities**: Add actual volunteer opportunities
2. **Process real applications**: Review and approve real volunteers
3. **Monitor usage**: Check volunteer engagement and activity completion
4. **Gather feedback**: Ask volunteers for improvement suggestions

For detailed documentation, see:
- `VOLUNTEER_SYSTEM_GUIDE.md` - Complete implementation details
- `ADMIN_QUICK_REFERENCE.md` - Admin user guide
- `VOLUNTEER_IMPLEMENTATION_SUMMARY.md` - Technical summary
