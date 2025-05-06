# Sequelize ORM Implementation

This project now supports both MongoDB and Sequelize ORM for database operations. You can toggle between the two database systems without changing your code.

## Setup

1. Install Sequelize and its dependencies:

```bash
npm run setup-sequelize
```

2. Copy the `.env.example` file to `.env` if you haven't already:

```bash
cp .env.example .env
```

3. Configure your database settings in the `.env` file:

```
# Database Toggle
USE_SEQUELIZE=false  # Set to true to use Sequelize, false to use MongoDB

# Sequelize Configuration (only used if USE_SEQUELIZE=true)
SQL_DIALECT=sqlite   # sqlite, mysql, postgres, etc.
SQL_STORAGE=./noteapp.sqlite  # Only for SQLite
# For MySQL/PostgreSQL
# SQL_DIALECT=mysql
# SQL_HOST=localhost
# SQL_DATABASE=noteapp
# SQL_USER=root
# SQL_PASSWORD=password
```

## Usage

### Running with MongoDB (Default)

```bash
npm run dev:mongo
# or
npm run dev  # Uses the setting in .env file
```

### Running with Sequelize

```bash
npm run dev:sequelize
```

### Toggling Between Databases

You can toggle between MongoDB and Sequelize using the toggle script:

```bash
npm run toggle-db
```

This will switch the `USE_SEQUELIZE` value in your `.env` file.

## How It Works

The application uses a toggle mechanism to switch between MongoDB and Sequelize:

1. **Database Connection**: The `db-toggle.js` file determines which database to connect to based on the `USE_SEQUELIZE` environment variable.

2. **Models**: The application uses different model implementations for MongoDB and Sequelize, but they expose the same interface.

3. **Controllers**: The controllers are also implemented for both database systems, but they provide the same API.

4. **Routes**: The routes use the controllers from the toggle mechanism, so they work with either database system.

## Sequelize Models

The Sequelize models are defined in the `backend/models/sequelize` directory:

- `user.model.js`: Defines the User model with fields for name, email, password, etc.
- `product.model.js`: Defines the Product model with fields for task, priority, and image.

## Benefits of Using Sequelize

1. **SQL Database Support**: You can now use SQL databases like MySQL, PostgreSQL, or SQLite.
2. **Data Validation**: Sequelize provides built-in data validation.
3. **Migrations**: You can use Sequelize migrations to manage database schema changes.
4. **Relationships**: Sequelize makes it easy to define and use relationships between tables.

## Notes

- When switching between databases, your data will not be transferred. Each database system maintains its own data.
- The first time you run with Sequelize, it will create the necessary tables in your SQL database.
- For production use, you should choose one database system and stick with it.
