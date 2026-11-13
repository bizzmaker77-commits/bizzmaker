# 🚀 Bizzmaker — Integrated Marketing Platform & WorkForce Management System

**Bizzmaker** is an integrated full-stack solution uniting the core **AI Digital Web** customer-facing platform and the **WorkForce OS Employee Management System** into a single cohesive project powered by an offline-ready **Dummy Database**.

---

## 🌟 Key Features

### 1. Core AI Digital Marketing Website
- Full marketing website with interactive showcases, services, client portfolios, transparent pricing, and blogs.
- **"Employee Login"** button integrated into the desktop header navigation and mobile drawer menu for fast staff access.

### 2. Employee & Role-Based Workspaces
- Dedicated login page at `/login` (and `/employee-login`).
- Automatic role-based routing upon authentication:
  - **EMPLOYEE** (`danish@aidigital.com`, `harshit@aidigital.com`, etc.) &rarr; `/dashboard/employee`
  - **TEAM LEAD** (`tl@workforce.com`) &rarr; `/dashboard/tl`
  - **SALES EXECUTIVE** (`jennifer@aidigital.com`) &rarr; `/dashboard/sales`
  - **CEO** (`nikhil@aidigital.com`) &rarr; `/dashboard/ceo`
  - **ADMIN** (`admin@aidigital.com`, `praveen@aidigital.com`) &rarr; `/admin` (Unified Admin Center)
  - **CLIENT** (`client@aidigital.com`) &rarr; `/dashboard/client`

### 3. Single Unified Admin Panel (`/admin`)
Both admin portals are unified under `/admin` with an instant suite switcher:
- **🌐 Website Marketing Suite**:
  - Live Visitor Traffic & Geo Analytics
  - Page & Section Visibility Toggles (Hide/Show any element)
  - Industry Plans & Pricing Manager
  - Portfolio Showcase Manager
  - Articles & Blog Post Editor
  - WhatsApp Automation Alerts
  - Onboarding Inquiries & Leads
  - Checkout Payment Reminders & Promo Codes
  - Career Job Applications
- **👥 Workforce & Agency Suite**:
  - Agency Executive KPIs (MRR, Clients, Deliverables)
  - Employee Directory & Onboarding Records
  - Daily Clock-In / Clock-Out Attendance Tracker
  - Task Board, Priority Flagging & Reassignments
  - Leave Requests & Approval Center
  - Performance Hub & Monthly Evaluations
  - Client Accounts & Deliverables Schedule
  - Payment Management Hub
  - Contract Renewal & Extension Center
  - Sales Hub, Dialing Log & Call Records
  - Audit Trail & Activity Logs

### 4. Zero-Dependency Dummy Database Engine
- **No MySQL required** (localhost:3306).
- **No PostgreSQL required** (Prisma cloud).
- Uses a local JSON-persisted engine in `data/dummy-db.json` with auto-sync:
  - Supports MySQL `pool.query(sql, params)` emulator for all AiDigitalWeb routes.
  - Supports Prisma ORM `findUnique`, `findMany`, `create`, `update`, `delete`, `count`, `include` relations for workforce management.
  - Preloaded with 16 users, 22 pricing plans, 5 active tasks, 4 clients, attendance records, blog posts, and visitor traffic.

---

## 🔑 Pre-Seeded Demo Credentials

| Role | Email | Password | Destination Dashboard |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@aidigital.com` | `Ai_Digital@0701` | Unified Admin (`/admin`) |
| **Business Head (Admin)** | `praveen@aidigital.com` | `Admin@#123` | Unified Admin (`/admin`) |
| **CEO** | `nikhil@aidigital.com` | `AiDigitals@246` | CEO Suite (`/dashboard/ceo`) |
| **Team Lead (TL)** | `tl@workforce.com` | `tl123` | Team Lead (`/dashboard/tl`) |
| **Graphic Designer** | `danish@aidigital.com` | `Danish@Ai123` | Employee (`/dashboard/employee`) |
| **Social Media Executive** | `harshit@aidigital.com` | `Harshit@Ai456` | Employee (`/dashboard/employee`) |
| **AI Video Producer** | `divyansh@aidigital.com` | `Divyansh@Ai546` | Employee (`/dashboard/employee`) |
| **Sales Executive** | `jennifer@aidigital.com` | `Jennifer@Ai123` | Sales Hub (`/dashboard/sales`) |
| **Client Account** | `client@aidigital.com` | *(Email login)* | Client Portal (`/dashboard/client`) |

---

## 🛠️ How to Run

1. Navigate to the `bizzmaker` directory:
   ```bash
   cd bizzmaker
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open in your browser:
   - **Public Website**: [http://localhost:3000](http://localhost:3000)
   - **Employee Login**: [http://localhost:3000/login](http://localhost:3000/login)
   - **Unified Admin Center**: [http://localhost:3000/admin](http://localhost:3000/admin)
