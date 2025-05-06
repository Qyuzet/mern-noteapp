import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Sequelize instance
// Default to SQLite for development, but can be configured to use MySQL, PostgreSQL, etc.
const sequelize = new Sequelize(
  process.env.SQL_DATABASE || 'noteapp',
  process.env.SQL_USER || 'root',
  process.env.SQL_PASSWORD || '',
  {
    host: process.env.SQL_HOST || 'localhost',
    dialect: process.env.SQL_DIALECT || 'sqlite',
    storage: process.env.SQL_STORAGE || './noteapp.sqlite', // Only used for SQLite
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  }
);

// Test the connection
export const testSequelizeConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Sequelize connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database with Sequelize:', error);
    return false;
  }
};

export default sequelize;
