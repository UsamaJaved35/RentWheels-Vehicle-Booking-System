# RentWheels — Vehicle Booking System

A full-stack vehicle booking system for a rent-a-car business. Admins can manage customers, vehicles, and bookings through a clean dashboard interface with JWT-based authentication.

## Tech Stack

### Backend
- **Runtime:** Node.js + Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Auth:** JWT (JSON Web Tokens)
- **Validation:** express-validator

### Frontend
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Animations:** Framer Motion
- **Notifications:** React Hot Toast

## Features

- **Authentication** — Admin signup and login with JWT tokens
- **Dashboard** — Overview stats (revenue, bookings, customers, vehicles) with recent bookings table
- **Customer Management** — Full CRUD operations for customer records
- **Vehicle Management** — Full CRUD operations for fleet vehicles (make, model, year, license plate, daily rate, status)
- **Booking Management** — Create bookings against customers and available vehicles, auto-calculated total amounts, status tracking (pending → active → completed/cancelled)
- **Vehicle Availability** — Vehicles are automatically marked as booked/available based on booking lifecycle

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/      # Auth & error handling middleware
│   │   ├── models/          # Mongoose schemas (User, Customer, Vehicle, Booking)
│   │   ├── routes/          # Express route definitions
│   │   ├── validators/      # Request validation rules
│   │   └── app.js           # Entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components (Layout, Modal, ConfirmDialog)
│   │   ├── context/        # Auth context provider
│   │   ├── pages/          # Page components (Dashboard, Customers, Vehicles, Bookings)
│   │   ├── services/       # Axios API client with interceptors
│   │   ├── types/          # TypeScript type definitions
│   │   ├── App.tsx         # Router setup
│   │   └── main.tsx        # Entry point
│   └── package.json
└── README.md
```

## Prerequisites

- **Node.js** v18+
- **MongoDB** running locally on port 27017 (or a remote connection string)

## Getting Started

### 1. Clone the repository

```bash
git clone <repo-url>
cd vehicle-booking-system
```

### 2. Set up the backend

```bash
cd backend
cp .env.example .env    # Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev             # Starts on http://localhost:5000
```

### 3. Set up the frontend

```bash
cd frontend
npm install
npm run dev             # Starts on http://localhost:3000
```

### 4. Open in browser

Navigate to `http://localhost:3000`, create an admin account via the signup page, and start managing your fleet.

## API Endpoints

### Auth
| Method | Endpoint         | Description       |
|--------|------------------|-------------------|
| POST   | `/api/auth/signup` | Register admin    |
| POST   | `/api/auth/login`  | Login admin       |
| GET    | `/api/auth/me`     | Get current user  |

### Customers (Protected)
| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| GET    | `/api/customers`      | List all customers  |
| GET    | `/api/customers/:id`  | Get one customer    |
| POST   | `/api/customers`      | Create customer     |
| PUT    | `/api/customers/:id`  | Update customer     |
| DELETE | `/api/customers/:id`  | Delete customer     |

### Vehicles (Protected)
| Method | Endpoint             | Description        |
|--------|----------------------|--------------------|
| GET    | `/api/vehicles`      | List all vehicles  |
| GET    | `/api/vehicles/:id`  | Get one vehicle    |
| POST   | `/api/vehicles`      | Create vehicle     |
| PUT    | `/api/vehicles/:id`  | Update vehicle     |
| DELETE | `/api/vehicles/:id`  | Delete vehicle     |

### Bookings (Protected)
| Method | Endpoint             | Description        |
|--------|----------------------|--------------------|
| GET    | `/api/bookings`      | List all bookings  |
| GET    | `/api/bookings/:id`  | Get one booking    |
| POST   | `/api/bookings`      | Create booking     |
| PUT    | `/api/bookings/:id`  | Update booking     |
| DELETE | `/api/bookings/:id`  | Delete booking     |

### Dashboard (Protected)
| Method | Endpoint              | Description       |
|--------|-----------------------|-------------------|
| GET    | `/api/dashboard/stats`| Get dashboard stats |

## Environment Variables

| Variable       | Description                  | Default                                    |
|----------------|------------------------------|--------------------------------------------|
| `PORT`         | Backend server port          | `5000`                                     |
| `MONGODB_URI`  | MongoDB connection string    | `mongodb://localhost:27017/vehicle-booking` |
| `JWT_SECRET`   | Secret key for JWT signing   | —                                          |
| `JWT_EXPIRES_IN` | Token expiration duration  | `7d`                                       |
