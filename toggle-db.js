import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to .env file
const envPath = path.join(__dirname, '.env');

// Read the current .env file
let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (error) {
  console.error('Error reading .env file:', error.message);
  process.exit(1);
}

// Check if USE_SEQUELIZE is already in the .env file
const useSequelizeRegex = /^USE_SEQUELIZE=.*/m;
const currentValue = process.env.USE_SEQUELIZE === 'true';
const newValue = !currentValue;

// Update the .env file
if (useSequelizeRegex.test(envContent)) {
  // Replace the existing value
  envContent = envContent.replace(useSequelizeRegex, `USE_SEQUELIZE=${newValue}`);
} else {
  // Add the new value
  envContent += `\nUSE_SEQUELIZE=${newValue}`;
}

// Write the updated .env file
try {
  fs.writeFileSync(envPath, envContent);
  console.log(`Database toggled to ${newValue ? 'Sequelize' : 'MongoDB'}`);
} catch (error) {
  console.error('Error writing .env file:', error.message);
  process.exit(1);
}

// Exit the process
process.exit(0);
