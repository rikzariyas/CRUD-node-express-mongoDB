# CRUD Node.js API

A lightweight Express + MongoDB REST API for user registration, admin authentication, and CRUD operations.

## Overview

This project demonstrates a basic backend setup for managing users with:

- Node.js and Express
- MongoDB using the official MongoDB driver
- JWT-based authentication
- bcrypt password hashing
- Joi validation
- role-based access control for admin routes

## Features

- User registration with password hashing
- User login with JWT token generation
- Admin login validation against environment credentials
- Fetch all users without exposing passwords
- Update a user name with PATCH
- Replace a user record with PUT
- Delete a user by ID
- Health check endpoint
- CORS, Helmet, and request logging middleware

## Tech Stack

- Node.js
- Express.js
- MongoDB
- JWT
- bcrypt
- Joi
- dotenv
- CORS
- Helmet
- Morgan

## Project Structure

```text
CRUD-node-express-mongoDB/
├── src/
│   ├── config/
│   │   ├── collection.js
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── userController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── validate.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   ├── validators/
│   │   ├── authValidators.js
│   │   ├── userFieldValidators.js
│   │   └── userValidators.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Prerequisites

Before running the project, make sure you have:

- Node.js 18+ installed
- npm installed
- MongoDB running locally or a MongoDB Atlas connection string

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/CRUD-node-express-mongoDB.git
cd CRUD-node-express-mongoDB
```

2. Install dependencies:

```bash
npm install
```

## Environment Configuration

Create a `.env` file in the project root based on `.env.example`:

```env
PORT=3000
ADMIN_USERNAME=admin@example.com
ADMIN_PASSWORD=your_secure_password
MONGODB_URI=mongodb://localhost:27017
DATABASE=CRUD1
JWT_SECRET=your_jwt_secret
```

### Environment variables

- `PORT`: Port used by the Express server
- `ADMIN_USERNAME`: Admin username for admin login
- `ADMIN_PASSWORD`: Admin password for admin login
- `MONGODB_URI`: MongoDB connection URI
- `DATABASE`: MongoDB database name
- `JWT_SECRET`: Secret key used to sign JWTs

## Running the API

Start the app in development mode:

```bash
npm run dev
```

Or start it without nodemon:

```bash
npm start
```

The server runs on the configured `PORT` (default: `3000`).

## API Endpoints

The project includes the following HTTP routes.

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| `GET` | `/health` | Check whether the server is running | No |
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/admin/login` | Admin login using env credentials | No |
| `POST` | `/api/users/login` | User login using email and password | No |
| `GET` | `/api/admin/users` | List all users without password hashes | Admin only |
| `PATCH` | `/api/users/:id` | Update a user's name | Logged-in user |
| `PUT` | `/api/users/:id` | Replace a user's data | Logged-in user |
| `DELETE` | `/api/admin/:id` | Delete a user by ID | Admin only |

### 1) Health check

```http
GET /health
```

Response example:

```json
{
  "status": "OK",
  "message": "The server is running"
}
```

### 2) Register user

```http
POST /api/auth/register
Content-Type: application/json
```

Request body:

```json
{
  "name": "Jane Doe",
  "age": 30,
  "email": "jane@example.com",
  "address": "123 Main Street",
  "password": "Abcdef1@",
  "role": "user"
}
```

Validation rules:

- `name`: letters and spaces only, min 3, max 50
- `email`: valid email format
- `address`: optional, minimum 5 characters
- `password`: must include uppercase, lowercase, number, and special character
- `age`: optional, between 10 and 80
- `role`: optional, either `admin` or `user`

### 3) Admin login

```http
POST /api/admin/login
Content-Type: application/json
```

Request body:

```json
{
  "username": "admin@example.com",
  "password": "YourSecurePassword123!"
}
```

This checks against the values set in `.env`:

```env
ADMIN_USERNAME=admin@example.com
ADMIN_PASSWORD=YourSecurePassword123!
```

### 4) User login

```http
POST /api/users/login
Content-Type: application/json
```

Request body:

```json
{
  "email": "jane@example.com",
  "password": "Abcdef1@"
}
```

Successful response:

```json
{
  "status": "OK",
  "message": "login successfully",
  "token": "<jwt-token>"
}
```

### 5) Get all users

```http
GET /api/admin/users
Authorization: Bearer <token>
```

Returns all users except the password field.

Example response:

```json
{
  "status": "OK",
  "data": [
    {
      "_id": "64f2a...",
      "userId": "uuid",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "age": 30,
      "address": "123 Main Street",
      "role": "user",
      "createdAt": "2026-10-23T00:00:00.000Z",
      "updatedAt": "2026-10-23T00:00:00.000Z"
    }
  ]
}
```

### 6) Update user name

```http
PATCH /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json
```

Request body:

```json
{
  "name": "Jane Smith"
}
```

### 7) Replace user

```http
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json
```

Request body:

```json
{
  "name": "Jane Smith",
  "age": 31,
  "email": "jane.smith@example.com",
  "address": "456 New Street",
  "password": "NewPassword1@"
}
```

### 8) Delete user

```http
DELETE /api/admin/:id
Authorization: Bearer <token>
```

This route deletes a user from the database by MongoDB `_id`.

## Example JWT Usage

After a successful login, send the token in the `Authorization` header:

```http
Authorization: Bearer <jwt-token>
```

## Notes

- `verifyToken` checks the JWT in the request header.
- `verifyAdmin` only allows users with `role === "Admin"` to access admin routes.
- `verifyUser` allows any valid logged-in user to access user routes.

## Authentication Behavior

- `verifyToken` validates the JWT from the `Authorization` header.
- `verifyAdmin` ensures that only users with `role === "Admin"` can access admin routes.
- `verifyUser` allows any valid logged-in user to access user-level routes.

## Validation

The project uses Joi for request validation, including:

- ID format checks
- name validation
- email validation
- password validation
- age range validation
- address length validation

## Security Notes

- Passwords are hashed with bcrypt before storage.
- JWT secrets should be stored in a secure `.env` file and never committed to source control.
- Do not expose `.env` in public repositories.
- Keep MongoDB access restricted and use strong credentials in production.

## License

This project is licensed under the ISC License.

- Never commit `.env` or expose database credentials.
- Hash passwords before storing them.
- Never return password hashes in API responses.
- Validate and sanitize incoming request data.
- Restrict access to protected routes when implementing authentication.
- Handle MongoDB connection errors and invalid ObjectIds appropriately.

## Learning Objectives

This project demonstrates practical backend development skills, including REST API design, Express routing, asynchronous JavaScript, MongoDB CRUD operations, environment configuration, password hashing, and error handling.
