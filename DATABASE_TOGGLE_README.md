# Database Toggle Feature

This application now supports toggling between MongoDB and Sequelize ORM directly from the user interface. This feature allows administrators to switch between database systems without modifying code or restarting the server manually.

## Setup Instructions

1. Install the required dependencies:

```bash
npm run setup-sequelize
```

2. Rename the new files to replace the existing ones:

```bash
npm run rename-files
```

3. Create a `.env` file with the necessary configuration (you can copy from `.env.example`):

```bash
cp .env.example .env
```

4. Start the application:

```bash
npm run dev
```

## Using the Toggle

1. **Login as an Admin User**: Only administrators can toggle the database system.

2. **Access the Toggle**: The database toggle switch is located in the sidebar at the bottom, below the logout button.

3. **Switch Database**: Click the toggle to switch between MongoDB and Sequelize.

4. **Wait for Restart**: After toggling, the server will automatically restart to apply the changes. This may take a few seconds.

## How It Works

The database toggle feature works as follows:

1. **Frontend Toggle**: The UI component sends a request to the backend to toggle the database.

2. **Backend Processing**: The backend updates the `.env` file to change the `USE_SEQUELIZE` value.

3. **Server Restart**: The server automatically restarts to apply the new database configuration.

4. **Database Initialization**: On restart, the application connects to the selected database system.

## Technical Details

- The toggle updates the `USE_SEQUELIZE` environment variable in the `.env` file.
- The application uses a database toggle mechanism to switch between MongoDB and Sequelize.
- Models and controllers are implemented for both database systems with the same interface.
- The server automatically restarts when the database is toggled.

## Notes

- When switching between databases, your data will not be transferred. Each database system maintains its own data.
- The first time you run with Sequelize, it will create the necessary tables in your SQL database.
- For production use, you should choose one database system and stick with it.
- The toggle feature is only available to administrators to prevent unauthorized changes.
