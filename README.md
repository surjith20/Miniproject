# Fire Department Real-Time Monitoring System

A comprehensive web application with complete user authentication system for streamlining fire safety inspections, NOC applications, and real-time monitoring.

## New Authentication Features Added:

### 1. **Login System**
- Email/password authentication
- Demo accounts for different roles (Applicant, Official, Admin)
- Remember me functionality
- Forgot password option
- Form validation
- Loading states

### 2. **Registration System**
- New user registration with validation
- Role selection (Applicant, Official)
- Password strength requirements
- Terms acceptance
- Email availability check
- Demo registration buttons

### 3. **User Management**
- Persistent login with localStorage
- Role-based access control
- User profile display
- Logout functionality
- Admin user management (for admin role)

### 4. **Secure Features**
- Password validation (8+ chars, mixed case, numbers)
- Form validation with real-time feedback
- Protected routes based on authentication
- Session persistence
- Demo data protection

## Complete Application Flow:

1. **Authentication Flow:**
   - User visits app → Redirected to login page
   - Can login with existing credentials or use demo accounts
   - New users can register with validation
   - Successful login → Redirected to home page

2. **Role-Based Access:**
   - **Applicant**: Apply for NOC, Track status
   - **Official**: All applicant features + Dashboard access
   - **Admin**: All features + User management

3. **Protected Routes:**
   - All main features require authentication
   - Unauthorized users redirected to login
   - Role-specific features protected

## Technology Stack

- **Frontend**: React 18 with Vite
- **Routing**: React Router DOM 6
- **State Management**: React Hooks (useState, useEffect)
- **Storage**: localStorage for session persistence
- **Styling**: CSS Modules with custom design system
- **Icons**: Emoji and custom CSS icons
- **Build Tool**: Vite

## Installation

1. **Clone and navigate to project directory:**
```bash
cd fire-dept-frontend
