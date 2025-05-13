# 🧩 Simple CRUD API

This project is a simple Node.js-based CRUD API for managing users, built using only Node.js core modules (no frameworks like Express). It includes support for:

- Basic user CRUD operations
- UUIDv4 user IDs
- In-memory data storage
- RESTful endpoints under `/api/users`
- Horizontal scaling using Node.js `Cluster` API with round-robin load balancing
- `.env` configuration
- Basic test support (optional)

---

## 📦 Installation

```bash
git clone <your-repo-url>
cd <your-repo-folder>
npm install
```

> Make sure you have Node.js 22+ installed.

---

## ⚙️ Configuration

Create a `.env` file in the root directory:

```
PORT=4000
```

---

## 🚀 Running the App

### Single-instance mode

Start the server in normal single-process mode:

```bash
npm start
```

The server will be available at: `http://localhost:<PORT>`, e.g., `http://localhost:4000/api/users`.

---

### Cluster Mode (Horizontal Scaling)

Run the app in cluster mode using a load balancer:

```bash
npm run start:multi
```

- Load balancer listens at `http://localhost:<PORT>` (default: 4000)
- Worker processes listen on `PORT + 1`, `PORT + 2`, ..., `PORT + N` (one per CPU minus 1)

The load balancer distributes requests across worker processes using a round-robin algorithm.

---

## 📘 API Endpoints

All routes are prefixed with `/api/users`

### Get All Users

```http
GET /api/users
```

### Get User by ID

```http
GET /api/users/:id
```

### Create User

```http
POST /api/users
Content-Type: application/json

{
  "username": "john",
  "age": 30,
  "hobbies": ["reading", "hiking"]
}
```

### Update User

```http
PUT /api/users/:id
Content-Type: application/json

{
  "username": "john_updated",
  "age": 31,
  "hobbies": ["reading", "gaming"]
}
```

### Delete User

```http
DELETE /api/users/:id
```

---

## 🧪 Testing (optional)

You can add tests using tools like `mocha` + `supertest`.