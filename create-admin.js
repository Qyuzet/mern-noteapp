import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './backend/models/user.model.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Create admin user
const createAdminUser = async () => {
  try {
    // Connect to the database
    const conn = await connectDB();

    // Check if admin user already exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });

    if (adminExists) {
      console.log('Admin user already exists');
      
      // Update the user to be an admin and verified
      adminExists.role = 'admin';
      adminExists.isVerified = true;
      await adminExists.save();
      
      console.log('Admin user updated');
      return;
    }

    // Create new admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
      isVerified: true,
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  }
};

// Run the function
createAdminUser();
