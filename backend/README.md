# Note App Backend with User Authentication

This is the backend implementation for the Part 2/Session 8 assignment, building upon the Part 1/Session 7 task management application.

## Features Implemented

### Core Features (80 Points)

1. **User Authentication**

   - Sign-up and sign-in functionality
   - JWT token-based authentication
   - Password hashing for security

2. **User Management**

   - Create, read, update, and delete users
   - User profile management

3. **Access Control**

   - Middleware to restrict access to certain features
   - Role-based permissions (user/admin)
   - Protected routes requiring authentication

4. **API Documentation**
   - Swagger documentation for all endpoints
   - Comprehensive endpoint descriptions

### Bonus Features

1. **Email Verification (15 Points)**

   - Verification token generation
   - Email sending functionality
   - OTP (One-Time Password) option

2. **Todo Middleware (3 Points)**

   - Validation middleware for todo operations
   - Logging middleware for todo operations

3. **Docker Deployment (2 Points)**
   - Dockerfile for containerization
   - Docker Compose configuration

## API Documentation

The API documentation is available at `/api-docs` when the server is running.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=9876
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key
   EMAIL_HOST=your_email_host
   EMAIL_PORT=your_email_port
   EMAIL_USER=your_email_user
   EMAIL_PASS=your_email_password
   EMAIL_FROM=your_email_from_address
   ```
4. Start the server:
   ```
   npm run dev
   ```

### Docker Deployment

To run the application using Docker:

1. Build the Docker image:
   ```
   docker build -t note-app .
   ```
2. Run the container:
   ```
   docker run -p 9876:9876 note-app
   ```

Or using Docker Compose:

```
docker-compose up
```

## API Endpoints

### User Routes

- `POST /api/users` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/verify/:token` - Verify user email
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

### Todo Routes

- `GET /api/products` - Get all todos
- `POST /api/products` - Create a new todo (protected)
- `PUT /api/products/:id` - Update a todo (protected)
- `DELETE /api/products/:id` - Delete a todo (protected)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected routes, include the JWT token in the Authorization header:

```
Authorization: Bearer your_token_here
```

## License

This project is licensed under the MIT License.

## Implementation Details

### Authentication Flow

1. User registers with name, email, and password
2. System generates a verification token and sends an email
3. User verifies email by clicking the link or entering OTP
4. User can then log in to get a JWT token
5. JWT token is used for authentication in protected routes

### Middleware Implementation

1. `auth.middleware.js` - Handles JWT verification and role-based access
2. `todo.middleware.js` - Validates todo data and logs operations

### Security Measures

1. Password hashing using bcrypt
2. JWT for secure authentication
3. Email verification to prevent fake accounts
4. Role-based access control

## API Testing Screenshots

[Include screenshots of API testing here]
