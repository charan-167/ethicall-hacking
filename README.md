# SecureWiFi — Password-Based First Access Authentication System

> **3rd-Year Engineering Project Demonstration | AI & Data Science**  
> **Title:** Design of a Secure Wireless Network with Password-Based Authentication for First Access

---

## 📌 Project Overview & Objectives

**SecureWiFi** is a full-stack cybersecurity educational web application that simulates a **zero-trust wireless access control gateway**. It demonstrates how modern enterprise Wi-Fi networks detect unauthenticated or new devices when they join for the first time, isolate them into a restricted state, and require secure password authentication before granting full network access.

### Key Objectives:
1. **First Access Detection:** Identify new devices by MAC address and place them in a restricted (`Pending`) state.
2. **Password-Based Authentication:** Verify credentials using salted `bcrypt` password hashing.
3. **Automated Lockout Protection:** Lock devices after 5 consecutive failed attempts.
4. **Security Auditing:** Record detailed authentication logs and security events.
5. **Admin Monitoring & Analytics:** Provide real-time dashboards with Recharts, interactive network topology, and exportable PDF/CSV reports.

---

## 🛠️ Technology Stack

### **Frontend:**
- **React 18** with **TypeScript**
- **Tailwind CSS** (Dark cybersecurity aesthetics with glassmorphism)
- **Lucide React** (Modern iconography)
- **Recharts** (Real-time analytics graphs)
- **Framer Motion** (Smooth UI animations)

### **Backend:**
- **Node.js** & **Express.js** (REST API)
- **SQLite 3** (`sqlite` async driver for local execution & easy migration to PostgreSQL/MySQL)
- **bcryptjs** (Password hashing & verification)
- **jsonwebtoken (JWT)** (Admin authentication & session management)
- **express-rate-limit** & **helmet** (Security hardening)

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+)

### Installation & Setup

1. **Install Dependencies:**
   ```bash
   npm run setup
   ```

2. **Start Backend & Frontend Concurrently:**
   ```bash
   npm run dev
   ```
   - **Frontend App:** [http://localhost:3000](http://localhost:3000)
   - **Backend REST API:** [http://localhost:5000/api](http://localhost:5000/api)

---

## 🔑 Demo Credentials

| Role | Username | Password | Purpose |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin` | `AdminPass123!` | Access Admin Dashboard & Settings |
| **User Device (Valid)** | `Charan` | `SecureWiFi2026!` | Test Successful First Access Auth |
| **User Device (Invalid)** | `Guest` | `wrong` | Test Failed Auth & Lockout |

---

## 🌐 API Endpoint Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Admin JWT login |
| `GET` | `/api/auth/verify` | Verify admin session token |
| `POST` | `/api/devices/register` | Detects new device and sets `Pending` status |
| `POST` | `/api/authenticate/device` | Verifies password & updates status to `Authorized` or `Blocked` |
| `GET` | `/api/devices` | Returns connected devices with filters |
| `PUT` | `/api/devices/:id` | Update device status (Authorize, Block, Unblock) |
| `POST` | `/api/devices/:id/revoke` | Revoke network access for a device |
| `GET` | `/api/logs/authentication` | Audit logs query |
| `GET` | `/api/dashboard/statistics` | Dashboard summary metrics |
| `GET` | `/api/dashboard/activity` | Recharts activity graph data |
| `GET` | `/api/network/topology` | Interactive network topology graph nodes |
| `GET/PUT` | `/api/network/settings` | Retrieve / Persist network settings in SQLite DB |
| `POST` | `/api/simulator/action` | Viva event simulator trigger |

---

## 💡 Demonstration Flow for College Evaluators (Viva)

1. Click **"Start Demo"** or navigate to **`/first-access`**.
2. Submit the pre-filled device details (`Charan-Laptop`, `SecureWiFi2026!`).
3. Observe state transition to **AUTHORIZED** and check the **User Dashboard** timeline.
4. Go to **`/simulator`** or test entering a wrong password (`wrong`) 5 times to observe **AUTOMATED DEVICE LOCKOUT**.
5. Log in to the **Admin Dashboard** (`/admin-dashboard`) to inspect live Recharts graphs, change network security policies in **`/security-settings`**, or print the PDF security report in **`/reports`**.

---

## 📜 License & Academic Usage
Developed for educational demonstration purposes. No real hardware network adapters or routers are modified.
