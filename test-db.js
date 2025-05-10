// Simple test script to check MongoDB connection
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('MongoDB URI:', process.env.MONGO_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
})
.then(() => {
  console.log('Connected to MongoDB successfully!');
  
  // Create a simple schema
  const TestSchema = new mongoose.Schema({
    name: String,
    createdAt: { type: Date, default: Date.now }
  });
  
  // Create a model
  const Test = mongoose.model('Test', TestSchema);
  
  // Create a test document
  return Test.create({ name: 'Test Document' });
})
.then(doc => {
  console.log('Created test document:', doc);
  return mongoose.connection.close();
})
.then(() => {
  console.log('Connection closed');
  process.exit(0);
})
.catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
