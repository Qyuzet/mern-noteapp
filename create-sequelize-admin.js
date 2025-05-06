import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Sequelize instance
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './noteapp.sqlite',
  logging: console.log,
});

// Define User model
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  verificationToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  verificationTokenExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user',
  },
});

// Create admin user
const createAdminUser = async () => {
  try {
    // Connect to the database
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    // Sync the model
    await User.sync();
    
    // Check if admin user already exists
    const adminExists = await User.findOne({ where: { email: 'admin@example.com' } });
    
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
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'hashed_password123_' + Date.now(),
      role: 'admin',
      isVerified: true,
    });
    
    console.log('Admin user created successfully');
    
    // Close the connection
    await sequelize.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  }
};

// Run the function
createAdminUser();
