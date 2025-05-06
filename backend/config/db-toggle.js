import dotenv from 'dotenv';
import { connectDB as connectMongoDB } from './db.js';
import { testSequelizeConnection } from './sequelize.js';

// Load environment variables
dotenv.config();

// Default to MongoDB if not specified
const useSequelize = process.env.USE_SEQUELIZE === 'true';

export const getDbType = () => {
  return useSequelize ? 'sequelize' : 'mongodb';
};

export const connectDB = async () => {
  if (useSequelize) {
    // Test Sequelize connection
    const success = await testSequelizeConnection();
    if (!success) {
      console.error('Failed to connect to SQL database. Falling back to MongoDB.');
      return connectMongoDB();
    }
    return true;
  } else {
    // Connect to MongoDB
    return connectMongoDB();
  }
};

export default { connectDB, getDbType };
