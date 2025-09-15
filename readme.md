# HRMS Project

A Human Resource Management System (HRMS) backend built with Node.js, Express and MongoDB. This project provides APIs for managing employees, attendance, leaves, roles, and related HR-functions.

---

## 🛠 Features

- Employee management: create, view, update, delete employee records  
- Authentication & authorization (login, JWT / token-based)  
- Attendance tracking: clock in / clock out / view attendance  
- Leave management: apply for leave, approve/reject leaves, leave history  
- Role & permissions: different roles (e.g. admin, manager, staff) with different levels of access  
- Middleware for validation, error handling, and authentication  
- Clean folder structure (controllers, routes, models, middleware, utils, etc.)

---

## 📦 Tech Stack

| Component        | Technology             |
|------------------|-------------------------|
| Backend          | Node.js / Express       |
| Database         | MongoDB (Mongoose ORM)  |
| Authentication   | JWT / Token             |
| Validation       | Express middleware      |
| Error Handling   | Centralized handlers    |

---

## 📂 Project Structure

HRMS-project/
├── config/ # configuration files (db, environment etc.)
├── controllers/ # route handlers (business logic)
├── middleware/ # auth, validation, error handling
├── models/ # mongoose schemas and models
├── routes/ # express router definitions
├── utils/ # helper modules, utilities
├── server.js # entry point of the app
├── package.json
└── .gitignore
