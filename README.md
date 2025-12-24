# Fire Safety Portal - Project Documentation

## 📋 Project Overview
The **Fire Safety Portal** is a full-stack web application designed to digitize and streamline the Fire Application NOC (No Objection Certificate) process. It serves as a bridge between Applicants (Citizens/Businesses) and the Fire Department (Admins/Officials).

### Core Functionality
- **Applicants** can register, submit applications for fire safety certificates, and track their real-time status.
- **Administrators** can view all applications, review details, schedule inspections, and grant or reject approvals.
- **System** provides automated status updates, inspection scheduling reflection, and PDF report generation.

---

## 🏗️ Architecture & Technology Stack

The project follows a **Client-Server Architecture**:

### 1. Frontend (Client-Side)
- **Framework**: React.js (Vite) for fast, component-based UI.
- **Styling**: Custom CSS with Glassmorphism design principles (transparency, blurs, gradients).
- **Routing**: React Router DOM v6 for seamless navigation.
- **State Management**: React `useState` and `useEffect` hooks.
- **API Communication**: `fetch` API wrapper for backend requests.

### 2. Backend (Server-Side)
- **Runtime**: Node.js.
- **Framework**: Express.js for RESTful API routing.
- **Database**: SQLite (File-based SQL database) for easy setup and portability.
- **ORM**: Sequelize for database modeling and relationships.
- **Authentication**: Custom token-based auth (simplified for prototype).

---

## 📂 Directory Structure

### `Frontend/` folder
- **`src/components/`**: Contains all React UI components.
  - `Home.jsx`: Main dashboard for users.
  - `Admin.jsx`: Admin panel for managing cases.
  - `Apply.jsx`: Form for new applications.
  - `Status.jsx`: Tracking page with PDF generation.
  - `Auth/`: Login and Register components.
- **`src/api.js`**: Centralized API service to talk to the backend.

### `backend/` folder
- **`server.js`**: Entry point, initializes Express app and syncs Database.
- **`models/`**: Sequelize database schemas.
  - `User.js`: Stores user credentials and roles.
  - `Application.js`: Stores fire NOC application details.
  - `Inspection.js`: Stores inspection schedules and results.
- **`routes/`**: API endpoints.
  - `/api/auth`: Login/Register.
  - `/api/applications`: CRUD for applications.
  - `/api/inspections`: Scheduling and updates.

---

## 🚀 Setup Instructions

### Backend Setup
1. Open a terminal in the `backend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server (runs on Port 3000):
   ```bash
   node server.js
   ```

### Frontend Setup
1. Open a **new** terminal in the `Frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React dev server:
   ```bash
   npm run dev
   ```
4. Open the browser link provided (e.g., `http://localhost:5173`).

---

## 👥 User Roles & Features

### 👤 Applicant
- **Sign Up/Login**: Create an account to manage applications.
- **Apply Now**: Fill out a detailed form (Business Name, Address, Building Height, etc.).
- **Track Status**: Enter Application ID to see current stage (submitted -> under_review -> inspection -> approved).
- **View Schedule**: See when an inspector is visiting.
- **Download Report**: Generate a PDF of the application status.

### 🛡️ Admin / Official
- **Dashboard**: View key metrics (Total Applications, Pending Cases).
- **Case Management**:
  - Review submitted applications.
  - **Schedule Inspection**: Assign a date for physical verification.
  - **Update Status**: Move applications to "Approved" or "Rejected".
- **User Management**: View registered users (Admin only).

---

## 🔧 backend API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new user |
| POST | `/api/auth/login` | Authenticate user |
| GET | `/api/applications` | Get all applications |
| POST | `/api/applications` | Submit new application |
| POST | `/api/inspections` | Schedule an inspection |
| GET | `/api/inspections` | Get all inspection records |

---

## 🎨 Design Theme
The project uses a **"Fire & Safety"** theme:
- **Colors**: Primary Red (`#d32f2f`), White, and Glass-like Translucency.
- **Animations**: Fade-ins and smooth transitions for a premium feel.

---

© 2024 Fire Safety Department
