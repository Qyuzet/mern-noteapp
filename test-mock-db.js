// Test script for mock database
import { MockProduct } from './backend/models/mock-db.js';

// Test the mock database
async function testMockDb() {
  try {
    console.log('Testing mock database...');
    
    // Test find all
    const allTasks = await MockProduct.find();
    console.log('All tasks:', allTasks);
    
    // Test create
    const newTask = await MockProduct.create({
      task: 'Test Task',
      priority: 3,
      image: 'https://picsum.photos/200/300'
    });
    console.log('Created task:', newTask);
    
    // Test find by ID
    const foundTask = await MockProduct.findById(newTask._id);
    console.log('Found task by ID:', foundTask);
    
    // Test update
    const updatedTask = await MockProduct.findByIdAndUpdate(newTask._id, {
      task: 'Updated Test Task'
    }, { new: true });
    console.log('Updated task:', updatedTask);
    
    // Test delete
    const deletedTask = await MockProduct.findByIdAndDelete(newTask._id);
    console.log('Deleted task:', deletedTask);
    
    // Verify deletion
    const allTasksAfterDelete = await MockProduct.find();
    console.log('All tasks after delete:', allTasksAfterDelete);
    
    console.log('Mock database tests completed successfully!');
  } catch (error) {
    console.error('Error testing mock database:', error);
  }
}

// Run the test
testMockDb();
