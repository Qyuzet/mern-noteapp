# MERN Task Management Application with User Authentication

A full-stack task management application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring user authentication and management.

## Technologies Used

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI Components
- Zustand for State Management
- React Hook Form
- Zod for Validation
- React Router DOM

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for Authentication
- Bcrypt for Password Hashing
- Nodemailer for Email Verification
- Swagger for API Documentation
- Docker for Deployment

## Features

### Core Features

- User authentication (sign-up, sign-in)
- User management (CRUD operations)
- Email verification for new users
- Role-based access control
- Create, read, update, and delete tasks
- Priority-based task management
- API documentation with Swagger
- Docker deployment

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone [your-repository-url]
cd [your-project-name]
```

2. Install backend dependencies:

```bash
npm install
```

3. Install frontend dependencies:

```bash
cd frontend
npm install
```

4. Create a .env file in the root directory:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
```

## Running the Application

### Development Mode

Start both backend and frontend in development mode:

```bash
npm run dev
```

### Production Mode

For deployment:

```bash
npm run build
npm run start
```

## API Endpoints (with postman test)

- GET /api/products - Retrieve all tasks
  ![image](https://github.com/user-attachments/assets/85b34f3c-bb09-46e4-bb11-30b96faf329f)

- POST /api/products - Create a new task
  ![image](https://github.com/user-attachments/assets/d976df6d-e377-401f-9bfa-7b682519d6b5)

- PUT /api/products/:id - Update a task
  ![image](https://github.com/user-attachments/assets/96cfaf2b-2af8-4c36-abbd-60609dce0697)

- DELETE /api/products/:id - Delete a task
  ![image](https://github.com/user-attachments/assets/8242fe3c-d4c1-4f12-b7d6-b4867dbaed76)

## Project Structure

```
.
├── backend/
│   ├── config/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── store/
│   │   └── App.tsx
│   └── package.json
└── package.json
```

## Configuration

The application uses the following configuration files:

- frontend/vite.config.ts - Vite configuration
- frontend/tailwind.config.js - Tailwind CSS configuration
- frontend/tsconfig.json - TypeScript configuration
- .env - Environment variables

## Build

The build process is configured to:

1. Install all dependencies
2. Build the frontend application
3. Serve the built frontend through the Express.js server

## License

[Your License]

## Author

[Your Name]
