# Admin Quick Reference Guide

## Accessing Admin Features

### Login as Admin
1. Navigate to `/login`
2. Use admin credentials
3. You'll be automatically redirected to `/admin`

---

## Managing User Roles

### Change User Role
**Location**: Admin Panel → Users Tab

1. Scroll to "User Management" section
2. Find the user you want to modify
3. Click the role dropdown next to their name
4. Select new role:
   - **User** (Adopter) - Can browse pets, submit adoption applications
   - **Vet** - Can view vet portal, manage appointments
   - **Volunteer** - Can access volunteer portal, sign up for activities
   - **Admin** - Full system access
5. Role is updated immediately
6. User will see new role on next login/page refresh

**Example Use Cases**:
- Promote a regular user to volunteer after manual verification
- Grant vet access to veterinary staff
- Promote trusted users to admin
- Demote users if needed

---

## Managing Volunteers

### Viewing Volunteer Applications
**Location**: Admin Panel → Volunteers Tab

**Information Displayed**:
- Applicant name
- Email address
- Phone number
- Skills
- Availability
- Application status (pending/approved/rejected)

### Approving Volunteers
1. Navigate to Volunteers tab
2. Find pending applications
3. Review applicant information:
   - Skills: What they can help with
   - Availability: When they can volunteer
   - Experience: Previous volunteer work (optional)
4. Click **"Approve"** button
5. Volunteer status changes to "approved"
6. Volunteer can now access volunteer portal

### Rejecting Volunteers
1. Find pending application
2. Click **"Reject"** button
3. Status changes to "rejected"
4. Volunteer will not have access to volunteer portal

**Note**: The system automatically records:
- Who approved/rejected (your admin user ID)
- When the action was taken

---

## Managing Adoption Applications

### Review Applications
**Location**: Admin Panel → Applications Tab

1. View all pending adoption applications
2. See applicant details:
   - Home type (house, apartment, etc.)
   - Has yard
   - Has other pets
   - Has children
   - Experience with pets
   - Reason for adoption
3. Review admin notes from previous reviewers

### Approve/Reject Applications
1. Click **"Approve"** or **"Reject"** button
2. Application status updates
3. Applicant can see status in their dashboard

---

## Managing Pets

### Add New Pets
**Location**: Admin Panel → Pets Tab

1. Click **"Add New Pet"** button
2. Fill out pet information:
   - Name
   - Species (Dog, Cat, Bird, etc.)
   - Breed
   - Age
   - Gender
   - Size
   - Description
   - Health status
   - Vaccination status
   - Special needs
3. Upload pet photos
4. Set adoption fee
5. Click **"Save"**

### Edit Existing Pets
1. Find pet in the list
2. Click **"Edit"** button
3. Update any information
4. Click **"Save Changes"**

### Mark Pet as Adopted
1. Find adopted pet
2. Click **"Mark as Adopted"**
3. Pet status changes to "adopted"
4. Pet no longer appears in public listings

---

## Managing Vet Appointments

### View All Appointments
**Location**: Admin Panel → Appointments Tab (if available)

Admins can see:
- All scheduled vet appointments
- Pet information
- Owner details
- Appointment date/time
- Status (scheduled, completed, cancelled)

### Assign Vets
- Appointments can be assigned to specific vets
- Vets will see their appointments in vet portal

---

## Managing Resources

### Add Educational Resources
**Location**: Admin Panel → Resources Tab

1. Click **"Add Resource"**
2. Fill out:
   - Title
   - Category (Pet Care, Training, Health, etc.)
   - Description
   - Content/Article
   - External links (optional)
3. Click **"Publish"**

### Edit/Delete Resources
1. Find resource in list
2. Click **"Edit"** or **"Delete"**
3. Make changes
4. Click **"Save"**

---

## Managing Store Products

### Add Products
**Location**: Admin Panel → Store Tab

1. Click **"Add Product"**
2. Fill out:
   - Product name
   - Category (Food, Toys, Accessories, etc.)
   - Price
   - Description
   - Stock quantity
   - Product images
3. Click **"Save"**

### Manage Inventory
1. View current stock levels
2. Update quantities as items are sold
3. Mark items as "Out of Stock"

---

## Viewing Feedback

### Review User Feedback
**Location**: Admin Panel → Feedbacks Tab

**Features**:
- Real-time feedback submissions
- User ratings (1-5 stars)
- Comments and suggestions
- Contact information if provided
- Submission timestamps

**Actions**:
- Read feedback to improve services
- Follow up with users if needed
- Track satisfaction trends

---

## Dashboard Statistics

### Overview Metrics
**Location**: Admin Panel → Dashboard (default view)

**Key Metrics**:
- Total pets available
- Pending adoption applications
- Approved applications
- Rejected applications
- Total users
- Active volunteers
- Upcoming vet appointments
- Recent feedback

**Charts**:
- Applications over time
- Pet adoption trends
- User registration trends

---

## Creating Volunteer Activities

### Manual Method (via Database)
Currently, volunteer activities must be created directly in the database.

**SQL Example**:
```sql
INSERT INTO volunteer_activities (
  title, 
  description, 
  date, 
  time, 
  location, 
  volunteers_needed
) VALUES (
  'Dog Walking Event',
  'Help walk shelter dogs in the park',
  '2024-12-15',
  '10:00 AM',
  'Central Park',
  5
);
```

**Future Enhancement**: UI for creating activities will be added to admin panel.

---

## Best Practices

### Volunteer Management
- Review applications promptly (within 24-48 hours)
- Check skills and availability match shelter needs
- Verify contact information is valid
- Approve volunteers who can commit to regular schedule

### Adoption Applications
- Thoroughly review home environment details
- Consider pet compatibility (size, energy level)
- Check if applicant has realistic expectations
- Follow up with phone calls for high-value adoptions

### Pet Listings
- Use high-quality, clear photos
- Write detailed, honest descriptions
- Update health status regularly
- Remove adopted pets promptly

### User Role Changes
- Document reason for role changes
- Verify user identity before granting admin/vet roles
- Only promote trusted, verified users
- Can demote users if they misuse privileges

---

## Troubleshooting

### User Can't Access Their Role
**Issue**: User changed to 'vet' but still sees regular dashboard

**Solution**: User needs to logout and login again for role to take effect

---

### Volunteer Doesn't See Activities
**Issue**: Approved volunteer sees empty portal

**Possible Causes**:
1. No activities created yet → Create activities in database
2. All activities are full → Create more activities
3. Activities are closed → Check activity status in database

---

### Can't Find User to Change Role
**Issue**: User list doesn't show the user you need

**Solution**: 
- Check if user has completed signup
- Verify user has a profile record
- User might not have user_roles record → Add manually in database

---

## Database Access

### Direct Database Queries
For advanced operations, you may need to access Supabase directly:

1. Login to Supabase Dashboard
2. Navigate to SQL Editor
3. Run queries for complex operations

**Common Queries**:

**View all volunteers**:
```sql
SELECT 
  v.*,
  p.first_name,
  p.last_name,
  p.email
FROM volunteers v
JOIN profiles p ON v.user_id = p.id
ORDER BY v.application_date DESC;
```

**View all users with roles**:
```sql
SELECT 
  p.first_name,
  p.last_name,
  p.email,
  ur.role,
  p.created_at
FROM profiles p
LEFT JOIN user_roles ur ON p.id = ur.user_id
ORDER BY p.created_at DESC;
```

**Find users without roles**:
```sql
SELECT 
  p.id,
  p.first_name,
  p.last_name,
  p.email
FROM profiles p
LEFT JOIN user_roles ur ON p.id = ur.user_id
WHERE ur.role IS NULL;
```

---

## Support & Questions

For technical issues or questions about admin features:
1. Check this guide first
2. Review error messages in browser console
3. Check database logs in Supabase
4. Document the issue with screenshots
5. Contact system administrator or developer

---

## Security Notes

- **Never share admin credentials**
- **Log out when done**: Click "Logout" in header
- **Review permissions**: Only grant admin/vet roles to verified staff
- **Monitor activity**: Check for suspicious user behavior
- **Backup data**: Regular database backups are handled automatically
- **Protect user data**: Don't share user contact information externally
