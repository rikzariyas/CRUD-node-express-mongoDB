# CRUD Node, Express, and MongoDB API

A REST API for registering users and managing user records. It is built with Node.js, Express.js, and the official MongoDB Node.js driver, with bcrypt password hashing.

## Features

- User registration
- Admin credential login
- List users without exposing password hashes
- Partially update user records
- Replace user records
- Delete user records
- MongoDB integration using the official MongoDB driver
- Health-check endpoint
- CORS and Helmet middleware
- Environment-based configuration

## Requirements

- Node.js (ES modules supported)
- npm
- MongoDB running locally or a MongoDB connection URI

## Getting started

### 1. Install dependencies

```bash
npm install
```

Ensure the official MongoDB driver is installed:

```bash
npm install mongodb
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and update the values for your environment.

```dotenv
PORT=4200
ADMIN_USERNAME=admin@example.com
ADMIN_PASSWORD=replace-with-a-strong-password
MONGODB_URI=mongodb://localhost:27017
DATABASE=CRUD1
```

- `PORT`: Port on which the Express server listens.
- `ADMIN_USERNAME`: Configured admin username.
- `ADMIN_PASSWORD`: Configured admin password.
- `MONGODB_URI`: MongoDB server connection URI.
- `DATABASE`: MongoDB database name.

Keep `.env` private and never commit real credentials to version control.

### 3. Start the API

Start the development server:

```bash
npm run dev
```

Start the server without nodemon:

```bash
npm start
```

The API listens on the configured port. If `PORT` is unset, the server uses port `3000`.

## API Endpoints

All request and response bodies use JSON unless noted otherwise.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Check server status |
| `POST` | `/api/auth/register` | Register a user |
| `POST` | `/api/auth/login` | Check configured admin credentials |
| `GET` | `/api/users` | Retrieve all users without password hashes |
| `PATCH` | `/api/users/:id` | Partially update a user's name |
| `PUT` | `/api/users/:id` | Replace a user record |
| `DELETE` | `/api/users/:id` | Delete a user |

Ensure that the route parameter names and controller logic match your actual implementation.

## Example Requests

### Health check

```http
GET /health
```

### Register a user

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "name": "Jane Doe",
  "age": 30,
  "email": "jane@example.com",
  "address": "123 Main Street",
  "password": "choose-a-password"
}
```

Passwords should be hashed using bcrypt before being stored in MongoDB.

The accepted fields depend on the validation implemented in your registration controller.

### Admin login

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "username": "admin@example.com",
  "password": "replace-with-a-strong-password"
}
```

The credentials are compared against `ADMIN_USERNAME` and `ADMIN_PASSWORD` configured in `.env`.

This endpoint checks the configured admin credentials. It does not automatically authenticate registered users or issue an authentication token.

### List users

```http
GET /api/users
```

Returns the user records while excluding the `password` field from the results.

### Partially update a user

```http
PATCH /api/users/<user-id>
Content-Type: application/json
```

```json
{
  "name": "Jane Smith"
}
```

Updates only the specified fields supported by the controller. The identifier may be a custom `userId` or MongoDB's `_id`, depending on the query used in your implementation.

### Replace a user

```http
PUT /api/users/<user-id>
Content-Type: application/json
```

```json
{
  "name": "Jane Smith",
  "age": 31,
  "email": "jane.smith@example.com",
  "address": "456 New Street"
}
```

Replaces the existing document's fields with the supplied fields, except for MongoDB's immutable `_id`. Include all fields you intend to retain.

### Delete a user

```http
DELETE /api/users/<user-id>
```

Deletes the specified user. The identifier location—URL parameter or request body—must match your controller implementation.

## Technology Stack

- **Node.js** — JavaScript runtime
- **Express.js** — Web framework and REST API routing
- **MongoDB** — NoSQL database
- **MongoDB Node.js Driver** — Direct database queries and CRUD operations
- **bcrypt** — Password hashing
- **dotenv** — Environment variable configuration
- **CORS** — Cross-origin request handling
- **Helmet** — HTTP security headers

## Project Structure

```text
src/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── authController.js  # Authentication handlers
│   └── userController.js  # User CRUD operations
├── routes/
│   ├── authRoutes.js      # Authentication routes
│   └── userRoutes.js      # User routes
└── server.js              # Application setup and startup
```

The exact filenames may differ depending on your implementation.

## MongoDB Usage

This project uses the official MongoDB Node.js driver directly, without Mongoose models or schemas.

Example query:

```javascript
const users = await db
  .collection("users")
  .find({}, { projection: { password: 0 } })
  .toArray();
```

Example update:

```javascript
await db.collection("users").updateOne(
  { _id: new ObjectId(id) },
  { $set: { name: "Jane Smith" } }
);
```

Example replacement:

```javascript
await db.collection("users").replaceOne(
  { _id: new ObjectId(id) },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    address: "456 New Street"
  }
);
```

## Security Notes

- Never commit `.env` or expose database credentials.
- Hash passwords before storing them.
- Never return password hashes in API responses.
- Validate and sanitize incoming request data.
- Restrict access to protected routes when implementing authentication.
- Handle MongoDB connection errors and invalid ObjectIds appropriately.

## Learning Objectives

This project demonstrates practical backend development skills, including REST API design, Express routing, asynchronous JavaScript, MongoDB CRUD operations, environment configuration, password hashing, and error handling.
