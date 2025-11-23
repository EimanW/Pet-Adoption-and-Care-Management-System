# Volunteer System Implementation Guide

## Overview
This document describes the complete volunteer system implementation, including volunteer registration, admin approval workflow, and the volunteer portal.

## Implementation Summary

### 1. Volunteer Registration (Login.tsx)
**Location**: `src/pages/Login.tsx`

**Changes Made**:
- Added "Volunteer" option to signup dropdown
- Added conditional volunteer-specific form fields:
  - Availability (text input)
  - Skills (text input) 
  - Experience (text input - optional)
- Updated signup handler to insert volunteer data into `volunteers` table with status='pending'
- Updated success message for volunteer signups

**User Flow**:
1. User selects "Volunteer" from account type dropdown
2. Additional volunteer fields appear in the signup form
3. User fills out basic info + volunteer-specific fields
4. On submit, creates:
   - Auth user account
   - Profile record
   - User_roles record (role='volunteer')
   - Volunteers record (status='pending')
5. User receives message: "Your volunteer application is pending approval."

### 2. Admin Volunteer Management (Admin.tsx)
**Location**: `src/pages/Admin.tsx`

**Existing Implementation**:
- **Volunteers Tab**: Displays all volunteer applications
- **fetchVolunteers()**: Fetches volunteers with profile data using separate queries
- **handleVolunteerAction()**: Approves or rejects volunteer applications
- **UI Features**:
  - Shows applicant name, email, phone
  - Displays skills and availability
  - Status badge (pending/approved/rejected)
  - Approve/Reject buttons for pending applications

**Admin Workflow**:
1. Admin navigates to Volunteers tab in admin panel
2. Views list of volunteer applications with status
3. Reviews applicant information (name, skills, availability, experience)
4. Clicks "Approve" or "Reject" button
5. Volunteer status updates in database
6. Trigger automatically sets `approved_by` and `approved_at` fields

### 3. Volunteer Portal (VolunteerPortal.tsx)
**Location**: `src/pages/VolunteerPortal.tsx`

**Features**:
- **Access Control**: Only users with 'volunteer' role can access
- **Volunteer Status Card**: Shows application status, dates, availability, skills
- **Three Main Tabs**:
  1. **My Activities**: Assigned volunteer activities
  2. **Available Activities**: Activities volunteers can sign up for
  3. **Completed**: History of completed activities

**Stats Dashboard**:
- Upcoming activities count
- Completed activities count
- Available activities count

**Volunteer Workflow**:
1. Volunteer logs in and is redirected to /volunteer-portal
2. If status is 'pending', sees pending status with application date
3. If status is 'approved', can view and sign up for activities
4. Can mark assigned activities as complete
5. Tracks volunteer history

### 4. Role Management (Admin.tsx)
**Location**: `src/pages/Admin.tsx` (User Management section)

**Existing Implementation**:
- **handleUserRoleChange()**: Function to update user roles
- **Role Dropdown**: Shows User/Admin/Vet/Volunteer options
- Updates `user_roles` table
- Refreshes user list after change

**Admin Workflow**:
1. Admin navigates to Users tab
2. Selects new role from dropdown for any user
3. Role is updated in database
4. Success toast notification shown

### 5. Dashboard Redirect (Login.tsx & Dashboard.tsx)
**Already Implemented**:
- Login.tsx redirects volunteers to /volunteer-portal after successful login
- Dashboard.tsx also includes volunteer redirect logic

## Database Schema

### Volunteers Table
```sql
CREATE TABLE public.volunteers (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  availability TEXT,
  skills TEXT,
  experience TEXT,
  status TEXT DEFAULT 'pending',  -- pending, approved, rejected
  application_date TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id)
);
```

### Volunteer Activities Table
```sql
CREATE TABLE public.volunteer_activities (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  volunteers_needed INTEGER DEFAULT 1,
  volunteers_assigned INTEGER DEFAULT 0,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Volunteer Assignments Table
```sql
CREATE TABLE public.volunteer_assignments (
  id UUID PRIMARY KEY,
  volunteer_id UUID REFERENCES auth.users(id),
  activity_id UUID REFERENCES volunteer_activities(id),
  status TEXT DEFAULT 'assigned',
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(volunteer_id, activity_id)
);
```

## RLS Policies

### Volunteers Table Policies
1. Users can view their own volunteer application
2. Admins can view all volunteer applications
3. Users can create volunteer application
4. Users can update their own application (if pending)
5. Admins can update volunteer applications

### Volunteer Activities Policies
1. Anyone can view open volunteer activities
2. Admins can create/update/delete volunteer activities

### Volunteer Assignments Policies
1. Volunteers can view their own assignments
2. Admins can view all assignments
3. Volunteers can sign up for activities (INSERT)
4. Volunteers can update their own assignments
5. Admins can update any assignment

## Database Triggers

### Volunteer Approval Trigger
```sql
CREATE TRIGGER on_volunteer_approval
  BEFORE UPDATE ON public.volunteers
  FOR EACH ROW
  EXECUTE FUNCTION handle_volunteer_approval();
```
- Automatically sets `approved_by` and `approved_at` when status changes to 'approved'
- Ensures audit trail of who approved which volunteer

### Volunteer Count Trigger
```sql
CREATE TRIGGER update_volunteer_count
  AFTER INSERT OR DELETE ON public.volunteer_assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_volunteers_assigned_count();
```
- Automatically updates `volunteers_assigned` count in volunteer_activities
- Increments on INSERT, decrements on DELETE

## Testing Checklist

### Volunteer Registration
- [ ] Navigate to login page
- [ ] Click "Sign Up" tab
- [ ] Select "Volunteer" from account type dropdown
- [ ] Verify volunteer fields appear (availability, skills, experience)
- [ ] Fill out all required fields
- [ ] Submit form
- [ ] Verify success message: "Your volunteer application is pending approval"
- [ ] Verify redirect to /volunteer-portal
- [ ] Verify volunteer sees "pending" status

### Admin Approval
- [ ] Login as admin user
- [ ] Navigate to admin panel
- [ ] Click "Volunteers" tab
- [ ] Verify pending volunteer application appears
- [ ] Verify applicant details are shown (name, email, skills, availability)
- [ ] Click "Approve" button
- [ ] Verify success toast
- [ ] Verify status badge changes to "approved"
- [ ] Verify "Approve" and "Reject" buttons disappear

### Volunteer Portal (Approved)
- [ ] Login as approved volunteer
- [ ] Verify redirect to /volunteer-portal
- [ ] Verify status shows "approved"
- [ ] Verify stats cards show correct counts
- [ ] Navigate to "Available Activities" tab
- [ ] Verify activities list appears (if any exist)
- [ ] Sign up for an activity
- [ ] Verify activity appears in "My Activities" tab
- [ ] Mark activity as complete
- [ ] Verify activity moves to "Completed" tab

### Admin Role Management
- [ ] Login as admin
- [ ] Navigate to Users tab
- [ ] Select a user
- [ ] Change role using dropdown (e.g., User → Volunteer)
- [ ] Verify success toast
- [ ] Verify role updates in user list
- [ ] Logout and login as that user
- [ ] Verify user has new role permissions

### Edge Cases
- [ ] Volunteer signup without optional experience field
- [ ] Reject a volunteer application
- [ ] Change volunteer back to regular user
- [ ] Sign up for activity that becomes full
- [ ] Volunteer with no assigned activities

## Admin Tasks

### Creating Volunteer Activities (Admin Panel)
Currently, admins need to manually insert volunteer activities into the database. Future enhancement could add a UI for this.

**Manual SQL to create sample activity**:
```sql
INSERT INTO volunteer_activities (title, description, date, time, location, volunteers_needed)
VALUES 
  ('Dog Walking Event', 'Help walk shelter dogs in the park', '2024-12-15', '10:00 AM', 'Central Park', 5),
  ('Adoption Event Setup', 'Set up booths for weekend adoption event', '2024-12-20', '9:00 AM', 'PawHaven Shelter', 3),
  ('Pet Care Training', 'Learn basic pet care and handling', '2024-12-22', '2:00 PM', 'Training Room', 10);
```

## File Changes Summary

### Modified Files
1. **src/pages/Login.tsx**
   - Added volunteer option to signup
   - Added volunteer form fields
   - Updated signup handler

2. **src/pages/Admin.tsx**
   - Fixed `fetchVolunteers()` to use `application_date` instead of `submitted_at`
   - Volunteers tab already implemented
   - handleVolunteerAction already implemented
   - handleUserRoleChange already implemented

3. **src/pages/VolunteerPortal.tsx**
   - Updated interface to use string types for availability/skills
   - Updated display logic for text fields instead of arrays

### New Files
4. **supabase/migrations/20251201000000_volunteer_system_policies.sql**
   - RLS policies for volunteers table
   - Trigger function for approval workflow
   - Permissions grants

## User Stories Implemented

✅ **US-11: Volunteer Registration**
- Volunteers can register through signup form
- Application includes availability, skills, and experience
- Status starts as 'pending'

✅ **US-12: Volunteer Approval**
- Admin can view all volunteer applications
- Admin can approve or reject applications
- Approval tracked with timestamp and admin user

✅ **US-13: Volunteer Portal**
- Approved volunteers access volunteer portal
- View application status
- See assigned activities
- Sign up for available activities
- Mark activities as complete

✅ **Admin Feature: Role Management**
- Admin can change any user's role
- Supports User, Admin, Vet, Volunteer roles
- Updates persist and affect user permissions

## Next Steps (Optional Enhancements)

1. **Activity Management UI**: Add UI in admin panel to create/edit volunteer activities
2. **Email Notifications**: Send email when volunteer is approved/rejected
3. **Volunteer Analytics**: Show volunteer hours, impact metrics
4. **Activity Calendar**: Visual calendar view of volunteer activities
5. **Volunteer Badges**: Gamification with achievement badges
6. **Background Checks**: Integration for volunteer screening
7. **Volunteer Chat**: Communication system between volunteers and staff
