# Product Requirements Document for HOSTELOOM

**Product type:** Web-based Hostel Management System for Nigerian institutions and private hostel owners.

---

## 1. 📌 Product Overview
Hosteloom is a digital hostel administration and allocation system designed to help Nigerian schools and private hostel owners manage student accommodations efficiently. The system replaces manual allocation, paper records, Google Forms, and spreadsheet-based processes with a centralized digital platform.

## 2. 🎯 Product Objectives
1. Digitize hostel allocation processes.
2. Prevent room overbooking.
3. Improve payment transparency and tracking.
4. Provide real-time occupancy visibility.
5. Reduce administrative workload.
6. Improve student communication with hostel management.

## 3. 👥 Target Users
### Primary Users
* Private hostel owners
* School hostel administrators

### Secondary Users
* Students
* Hostel staff

## 4. 🧩 Core Problems Being Solved
* Manual room allocation errors
* Double booking of rooms
* Poor payment tracking
* Lack of occupancy visibility
* No centralized student records
* Inefficient complaint handling
* Poor reporting and data tracking

## 5. 🔑 User Roles
### 1. Super Admin
* Platform-level control
* Manages multiple hostels (if SaaS model)

### 2. Hostel Admin
* Manages specific hostel
* Reviews and approves student registrations
* Allocates rooms
* Tracks payments
* Generates reports
* Verifies payments
* Updates payment status
* Generates financial reports

### 3. Student
* Self-registers account
* Completes profile
* Views room availability
* Makes payments
* Submits maintenance requests
* Views allocation history
* Updates personal details

---

## 6. 📌 Core Features (MVP)

### 6.1 User Authentication & Role Management
* **Student Self-Registration:** Account creation, email verification, hostel/academic session selection, and profile completion. Status defaults to *Pending Approval*.
* **Admin Controls:** View new registrations, approve/reject accounts (with reasons), and manage account status (suspend/deactivate).

### 6.2 Hostel Setup & Configuration
* Create properties, blocks, floors, and rooms.
* Define room capacity, pricing, and gender restrictions.
* Set active academic sessions or terms.

### 6.3 Room Management
* Real-time status tracking (Vacant / Partially Occupied / Full).
* Occupant lists and occupancy history.

### 6.4 Student Management
* ID assignment and detailed record keeping (contact/guardian info).
* Allocation history and status updates.

### 6.5 Room Allocation System
* Availability-based assignment (prevents overbooking).
* Check-in/Check-out management and room reassignment.

### 6.6 Payment Management
* Record manual payments and generate references.
* Track status (Pending / Paid / Overdue) and issue digital receipts.
* Summary dashboards for revenue and outstanding balances.

### 6.7 Dashboard & Analytics
* High-level metrics: Total rooms/students, occupancy rates, revenue, and recent activity feeds.

### 6.8 Maintenance & Complaint System
* **Students:** Submit categorized complaints with descriptions.
* **Admins:** Assign staff, update status (In Progress / Resolved), and track response times.

---

## 7. 🚀 Advanced Features (Phase 2 & 3)
* **Online Payment Integration:** Automated confirmation and real-time status updates.
* **Notification System:** SMS/Email alerts for allocations and payment reminders.
* **Multi-Hostel Support:** Manage multiple properties under one parent account.
* **Visitor Logging:** Track entry/exit times for security.
* **Audit Logs:** Track all administrative actions for accountability.

## 8. 🔑 Security & Non-Functional Requirements
* **Security:** Role-based access control (RBAC), data encryption, and secure session management.
* **Performance:** Support for concurrent users and real-time data consistency.
* **Scalability:** Ability to handle academic session rollovers smoothly.

## 9. 📈 Success Metrics (KPIs)
* Zero overbooking incidents.
* Reduction in manual administrative hours.
* Improved "on-time" payment rates.
* Faster complaint resolution turnaround.