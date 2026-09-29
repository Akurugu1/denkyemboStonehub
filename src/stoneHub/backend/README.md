
# StoneHub Backend

## Overview

This directory contains the backend API for the StoneHub application.

The backend provides server-side functionality for handling application requests,
database communication, authentication, product management, and other business
logic required by the StoneHub platform.

## Technologies

- Node.js
- Express.js
- MySQL
- JWT Authentication
- bcrypt
- Git & GitHub

## Project Structure

```
backend/
├── config/
│   └── Database configuration
├── controllers/
│   └── Request handling logic
├── models/
│   └── Database interaction logic
├── routes/
│   └── API endpoint definitions
├── server.js
└── package.json
```

## Setup Instructions

### 1. Install Dependencies

From the backend directory, run:

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file inside the backend folder.

Example:

```env
PORT=5000
DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=stonehub
JWT_SECRET=your_secret_key
EMAIL_USER=your_sender_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### 3. Start the Server

Development mode:

```bash
npm run dev
```

The backend server runs on:

```
http://localhost:5000
```

## Database

The backend uses MySQL.

Database name:

```
stonehub
```

The database schema is located in:

```
src/stoneHub/database
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a customer |
| POST | `/api/auth/login` | Login a customer |

### Products

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | Retrieve all products |
| GET | `/api/products/:id` | Retrieve product details |
| GET | `/api/products/category/:category_id` | Retrieve products by category |
| GET | `/api/products/search?keyword=value` | Search products |

### Admin Product Management

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/admin/products` | Create a product |
| GET | `/api/admin/products` | Retrieve products |
| PUT | `/api/admin/products/:id` | Update a product |
| DELETE | `/api/admin/products/:id` | Delete a product |

## Development Notes

Additional backend modules and API endpoints will be added as development continues.
