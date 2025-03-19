# MERN Task Management Application

A full-stack task management application built with the MERN stack (MongoDB, Express.js, React, Node.js).

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
- dotenv for Environment Variables

## Features

- Create, read, update, and delete tasks
- Priority-based task management
- Real-time updates with toast notifications
- Responsive design
- Form validation
- Database persistence

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

## API Endpoints

- GET /api/products - Retrieve all tasks
- POST /api/products - Create a new task
- PUT /api/products/:id - Update a task
- DELETE /api/products/:id - Delete a task

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
