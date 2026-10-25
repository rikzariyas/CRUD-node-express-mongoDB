# CRUD Node.js API

Express and MongoDB REST API for user registration, authentication, and CRUD operations.

## Setup

1. Install Node.js 20.19.0 or newer and MongoDB.
2. Install dependencies with `npm install`.
3. Copy `.env.example` to `.env` and configure the values:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017
DATABASE=CRUD1
JWT_SECRET=use_a_long_random_secret
```

4. Start the API with `npm run dev` during development or `npm start` otherwise.

Public registration always creates a regular user. Admin login is only supported if an admin document exists in the database; create it manually when needed.

## Endpoints

| Method   | Endpoint               | Access | Description                          |
| -------- | ---------------------- | ------ | ------------------------------------ |
| `GET`    | `/health`              | Public | Health check                         |
| `POST`   | `/api/auth/register`   | Public | Register a regular user              |
| `POST`   | `/api/users/login`     | Public | Log in as a user                     |
| `POST`   | `/api/admin/login`     | Public | Log in as an admin user              |
| `GET`    | `/api/admin/users`     | Admin  | List users without password hashes   |
| `PUT`    | `/api/admin/users/:id` | Admin  | Replace a user's profile             |
| `DELETE` | `/api/admin/users/:id` | Admin  | Delete a user                        |
| `PATCH`  | `/api/users/:id`       | Owner  | Update the signed-in user's name     |
| `PUT`    | `/api/users/:id`       | Owner  | Replace the signed-in user's profile |

For protected endpoints, send the token returned by login:

Authorization: Bearer <token>

Registration accepts `name`, `email`, and `password`; `age` and `address` are optional. Age must be a whole number from 10 to 80. Supplied addresses must contain 5 to 300 non-whitespace characters. Passwords are hashed before storage, and email addresses must be unique.

User and admin login accept `email` or `username`, respectively, along with `password`. Profile update and delete routes use the MongoDB document `_id`.

The API creates a unique index on user emails at startup. If migrating an existing database with duplicate email addresses, resolve those duplicates in the `users` collection before starting the API.

Errors return a JSON object with `status` and `message`; unexpected server errors return a generic message and are logged by the server.
